<?php

namespace App\Http\Controllers;

use App\Models\AdminUser;
use Illuminate\Http\Request;
use Laravel\Lumen\Routing\Controller as BaseController;

class Controller extends BaseController
{
    /**
     * Junta as mensagens de validação com "; ", igual às rotas Express originais,
     * e responde 400 — em vez do formato padrão 422 do Laravel Validator.
     */
    protected function validationError(array $errors)
    {
        return response()->json(['error' => implode('; ', $errors)], 400);
    }

    protected function notFound(string $message)
    {
        return response()->json(['error' => $message], 404);
    }

    protected function authUser(Request $request): ?AdminUser
    {
        return $request->attributes->get('authUser');
    }

    /**
     * Igual ao padrão repetido em todas as rotas de criação do Node:
     * "order = last ? last.order + 1 : 0".
     */
    protected function nextOrder(string $modelClass): int
    {
        $last = $modelClass::orderByDesc('order')->first();

        return $last ? $last->order + 1 : 0;
    }
}
