<?php

namespace App\Http\Controllers;

use App\Support\YoutubeClient;
use Illuminate\Http\Request;
use RuntimeException;

class YoutubeController extends Controller
{
    public function status()
    {
        return response()->json((new YoutubeClient())->getStatus());
    }

    public function connect()
    {
        return redirect((new YoutubeClient())->buildConsentUrl());
    }

    public function callback(Request $request)
    {
        $code = $request->query('code');
        $webOrigin = env('WEB_ORIGIN', 'http://localhost:3000');

        if (! is_string($code)) {
            return redirect("{$webOrigin}/admin/videos?youtube=error");
        }

        try {
            (new YoutubeClient())->exchangeCodeAndStoreAccount($code);
        } catch (RuntimeException $e) {
            logger()->error('Falha ao conectar conta do YouTube: '.$e->getMessage());

            return redirect("{$webOrigin}/admin/videos?youtube=error");
        }

        return redirect("{$webOrigin}/admin/videos?youtube=connected");
    }
}
