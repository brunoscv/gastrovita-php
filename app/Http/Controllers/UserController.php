<?php

namespace App\Http\Controllers;

use App\Models\AdminUser;
use Illuminate\Http\Request;

class UserController extends Controller
{
    private const ROLES = ['SUPER_ADMIN', 'EDITOR'];

    public function index()
    {
        return response()->json(AdminUser::orderBy('createdAt')->get());
    }

    public function store(Request $request)
    {
        $body = $request->json()->all();
        $email = $body['email'] ?? null;
        $password = $body['password'] ?? null;
        $name = $body['name'] ?? null;
        $role = $body['role'] ?? null;

        if (! $email || ! $password) {
            return $this->validationError(['email e password são obrigatórios']);
        }
        if (strlen((string) $password) < 8) {
            return $this->validationError(['A senha precisa ter ao menos 8 caracteres']);
        }
        if ($role && ! in_array($role, self::ROLES, true)) {
            return $this->validationError(['role inválido']);
        }

        if (AdminUser::where('email', $email)->exists()) {
            return response()->json(['error' => 'Já existe um usuário com esse email'], 409);
        }

        $user = AdminUser::create([
            'email' => $email,
            'name' => $name,
            'passwordHash' => password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]),
            'role' => $role ?? 'EDITOR',
        ]);

        return response()->json($user, 201);
    }

    public function update(Request $request, string $id)
    {
        $body = $request->json()->all();

        $target = AdminUser::find($id);
        if (! $target) {
            return $this->notFound('Usuário não encontrado');
        }

        $role = $body['role'] ?? null;
        if ($role && ! in_array($role, self::ROLES, true)) {
            return $this->validationError(['role inválido']);
        }

        $willDowngradeRole = $role && $role !== 'SUPER_ADMIN' && $target->role === 'SUPER_ADMIN';
        $willDeactivate = array_key_exists('active', $body) && $body['active'] === false && $target->active;

        if (($willDowngradeRole || $willDeactivate) && $target->role === 'SUPER_ADMIN') {
            if ($this->activeSuperAdminCount($target->id) === 0) {
                return $this->validationError(['Não é possível remover o último super administrador ativo do sistema']);
            }
        }

        if (array_key_exists('name', $body)) {
            $target->name = $body['name'];
        }
        if (array_key_exists('role', $body)) {
            $target->role = $body['role'];
        }
        if (array_key_exists('active', $body)) {
            $target->active = $body['active'];
        }
        $target->save();

        return response()->json($target);
    }

    public function resetPassword(Request $request, string $id)
    {
        $body = $request->json()->all();
        $newPassword = $body['newPassword'] ?? null;

        if (! $newPassword || strlen((string) $newPassword) < 8) {
            return $this->validationError(['newPassword precisa ter ao menos 8 caracteres']);
        }

        $target = AdminUser::find($id);
        if (! $target) {
            return $this->notFound('Usuário não encontrado');
        }

        $target->passwordHash = password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => 10]);
        $target->save();

        return response()->json(['ok' => true]);
    }

    /**
     * Soft-delete por padrão: preserva histórico/rastreabilidade de quem criou/editou
     * conteúdo. Nunca faz DELETE físico — só desativa.
     */
    public function destroy(string $id)
    {
        $target = AdminUser::find($id);
        if (! $target) {
            return $this->notFound('Usuário não encontrado');
        }

        if ($target->role === 'SUPER_ADMIN' && $target->active) {
            if ($this->activeSuperAdminCount($target->id) === 0) {
                return $this->validationError(['Não é possível remover o último super administrador ativo do sistema']);
            }
        }

        $target->active = false;
        $target->save();

        return response()->json($target);
    }

    private function activeSuperAdminCount(string $excludeId): int
    {
        return AdminUser::where('role', 'SUPER_ADMIN')
            ->where('active', true)
            ->where('id', '!=', $excludeId)
            ->count();
    }
}
