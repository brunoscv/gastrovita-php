<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

/**
 * Equivalente ao requireRole(...roles) do Express. Depende do RequireAuth já
 * ter rodado antes e preenchido `authUser` nos atributos do request.
 */
class RequireRole
{
    public function handle(Request $request, Closure $next, string ...$roles)
    {
        $user = $request->attributes->get('authUser');

        if (! $user || ! in_array($user->role, $roles, true)) {
            return response()->json(['error' => 'Sem permissão para esta ação'], 403);
        }

        return $next($request);
    }
}
