<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

/**
 * Substitui o express-rate-limit (que guardava contadores na memória do
 * processo Node) por um contador em cache de arquivo — sobrevive entre
 * requests sem precisar de um processo de vida longa nem de Redis, o que
 * funciona em hospedagem compartilhada.
 *
 * Uso: 'middleware' => 'throttle.ip:login' ou 'throttle.ip:contact'
 */
class ThrottleByIp
{
    private const LIMITS = [
        'login' => [
            'max' => 10,
            'windowSeconds' => 15 * 60,
            'message' => 'Muitas tentativas de login. Tente novamente em alguns minutos.',
        ],
        'contact' => [
            'max' => 20,
            'windowSeconds' => 15 * 60,
            'message' => 'Muitas mensagens enviadas. Tente novamente mais tarde.',
        ],
    ];

    public function handle(Request $request, Closure $next, string $key)
    {
        $config = self::LIMITS[$key];
        $cacheKey = "throttle:{$key}:{$request->ip()}";

        $count = Cache::get($cacheKey, 0);

        if ($count >= $config['max']) {
            return response()->json(['error' => $config['message']], 429);
        }

        Cache::put($cacheKey, $count + 1, $config['windowSeconds']);

        return $next($request);
    }
}
