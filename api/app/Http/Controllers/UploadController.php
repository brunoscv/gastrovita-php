<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        if (! $request->hasFile('file')) {
            return response()->json(['error' => 'Nenhum arquivo enviado'], 400);
        }

        $folder = is_string($request->query('folder')) ? $request->query('folder') : 'misc';
        $file = $request->file('file');

        $extension = $file->getClientOriginalExtension();
        $base = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $base = strtolower($base);
        $base = preg_replace('/[^a-z0-9]+/', '-', $base);
        $base = trim($base, '-');

        $filename = $base.'-'.round(microtime(true) * 1000).($extension ? ".{$extension}" : '');

        $destination = base_path("uploads/{$folder}");
        $file->move($destination, $filename);

        return response()->json(['url' => "/uploads/{$folder}/{$filename}"], 201);
    }
}
