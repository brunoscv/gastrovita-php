<?php

namespace App\Http\Middleware;

use App\Models\AdminUser;
use Closure;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Http\Request;
use Throwable;

/**
 * Equivalente ao requireAuth do Express: lê o cookie de sessão, valida o JWT
 * e confirma que o admin ainda existe e está ativo a cada request (desativar
 * um usuário invalida a sessão dele na hora, mesmo com JWT ainda válido).
 */
class RequireAuth
{
    public const COOKIE_NAME = 'gastrovita_token';

    public function handle(Request $request, Closure $next)
    {
        $token = $request->cookie(self::COOKIE_NAME);

        if (! $token) {
            return response()->json(['error' => 'Não autenticado'], 401);
        }

        try {
            $payload = JWT::decode($token, new Key(env('JWT_SECRET'), 'HS256'));
        } catch (Throwable $e) {
            return response()->json(['error' => 'Não autenticado'], 401);
        }

        $admin = AdminUser::find($payload->sub ?? null);

        if (! $admin || ! $admin->active) {
            return response()->json(['error' => 'Não autenticado'], 401);
        }

        $request->attributes->set('authUser', $admin);

        return $next($request);
    }
}
