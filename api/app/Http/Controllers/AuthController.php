<?php

namespace App\Http\Controllers;

use App\Http\Middleware\RequireAuth;
use App\Models\AdminUser;
use Firebase\JWT\JWT;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Cookie;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $body = $request->json()->all();
        $email = $body['email'] ?? null;
        $password = $body['password'] ?? null;

        if (! $email || ! $password) {
            return $this->validationError(['email e password são obrigatórios']);
        }

        $admin = AdminUser::where('email', $email)->first();

        if (! $admin || ! $admin->active) {
            return response()->json(['error' => 'Credenciais inválidas'], 401);
        }

        if (! password_verify($password, $admin->passwordHash)) {
            return response()->json(['error' => 'Credenciais inválidas'], 401);
        }

        $ttlDays = (int) env('JWT_TTL_DAYS', 7);
        $token = JWT::encode([
            'sub' => $admin->id,
            'role' => $admin->role,
            'email' => $admin->email,
            'iat' => time(),
            'exp' => time() + ($ttlDays * 86400),
        ], env('JWT_SECRET'), 'HS256');

        $response = response()->json([
            'id' => $admin->id,
            'email' => $admin->email,
            'name' => $admin->name,
            'role' => $admin->role,
        ]);

        $this->setAuthCookie($response, $token, $ttlDays);

        return $response;
    }

    public function logout()
    {
        $response = response()->json(['ok' => true]);
        $response->headers->clearCookie(RequireAuth::COOKIE_NAME, '/');

        return $response;
    }

    public function me(Request $request)
    {
        $admin = AdminUser::find($this->authUser($request)->id);

        if (! $admin) {
            return response()->json(['error' => 'Não autenticado'], 401);
        }

        return response()->json([
            'id' => $admin->id,
            'email' => $admin->email,
            'name' => $admin->name,
            'role' => $admin->role,
        ]);
    }

    public function updatePassword(Request $request)
    {
        $body = $request->json()->all();
        $currentPassword = $body['currentPassword'] ?? null;
        $newPassword = $body['newPassword'] ?? null;

        if (! $currentPassword || ! $newPassword) {
            return $this->validationError(['currentPassword e newPassword são obrigatórios']);
        }
        if (strlen((string) $newPassword) < 8) {
            return $this->validationError(['A nova senha precisa ter ao menos 8 caracteres']);
        }

        $admin = AdminUser::find($this->authUser($request)->id);
        if (! $admin) {
            return response()->json(['error' => 'Não autenticado'], 401);
        }

        if (! password_verify($currentPassword, $admin->passwordHash)) {
            return response()->json(['error' => 'Senha atual incorreta'], 401);
        }

        $admin->passwordHash = password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => 10]);
        $admin->save();

        return response()->json(['ok' => true]);
    }

    private function setAuthCookie($response, string $token, int $ttlDays): void
    {
        $isProd = env('APP_ENV') === 'production';

        $response->headers->setCookie(Cookie::create(
            RequireAuth::COOKIE_NAME,
            $token,
            time() + ($ttlDays * 86400),
            '/',
            null,
            $isProd,
            true,
            false,
            'lax'
        ));
    }
}
