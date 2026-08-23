<?php

return [

    // Cache em arquivo: substitui o rate-limit em memória do Express (express-rate-limit)
    // por algo que sobrevive entre requests sem precisar de um processo de vida longa
    // nem de Redis/Memcached — funciona em qualquer hospedagem compartilhada.
    'default' => env('CACHE_DRIVER', 'file'),

    'stores' => [
        'file' => [
            'driver' => 'file',
            'path' => storage_path('framework/cache/data'),
        ],
    ],

    'prefix' => 'gastrovita_cache',

];
