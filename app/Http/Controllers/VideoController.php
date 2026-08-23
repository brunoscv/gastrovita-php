<?php

namespace App\Http\Controllers;

use App\Models\Video;
use App\Support\Slugify;
use App\Support\YoutubeClient;
use App\Support\YoutubeIdExtractor;
use Illuminate\Http\Request;
use RuntimeException;

class VideoController extends Controller
{
    public function index(Request $request)
    {
        $onlyPublished = $request->query('all') !== 'true';

        $query = Video::orderBy('order');
        if ($onlyPublished) {
            $query->where('published', true);
        }

        return response()->json($query->get());
    }

    public function show(string $id)
    {
        $video = Video::find($id);

        if (! $video) {
            return $this->notFound('Vídeo não encontrado');
        }

        return response()->json($video);
    }

    /**
     * Substitui o upload multipart síncrono do Node: em vez de receber o
     * arquivo aqui, abre uma sessão de upload resumível do YouTube e devolve
     * a URL pro navegador do admin enviar o arquivo direto pro Google. Depois
     * de concluído, o frontend chama POST /videos com o youtubeId resultante.
     */
    public function initUpload(Request $request)
    {
        $body = $request->json()->all();
        $title = is_string($body['title'] ?? null) ? trim($body['title']) : '';

        if ($title === '') {
            return $this->validationError(['title é obrigatório']);
        }

        $published = array_key_exists('published', $body) ? (bool) $body['published'] : true;

        try {
            $uploadUrl = (new YoutubeClient())->initResumableUpload($title, $published);
        } catch (RuntimeException $e) {
            return response()->json(['error' => $e->getMessage()], 502);
        }

        return response()->json(['uploadUrl' => $uploadUrl], 201);
    }

    public function store(Request $request)
    {
        $body = $request->json()->all();
        $errors = $this->validateInput($body, true);

        if ($errors) {
            return $this->validationError($errors);
        }

        $youtubeId = YoutubeIdExtractor::extract($body['youtubeId']);
        if (! $youtubeId) {
            return $this->validationError(['youtubeId inválido']);
        }

        $title = trim($body['title']);

        $video = Video::create([
            'title' => $title,
            'youtubeId' => $youtubeId,
            'thumbnailUrl' => $body['thumbnailUrl'] ?? null,
            'slug' => $this->uniqueSlugFor($title),
            'order' => $body['order'] ?? $this->nextOrder(Video::class),
            'published' => $body['published'] ?? true,
        ]);

        return response()->json($video, 201);
    }

    public function update(Request $request, string $id)
    {
        $body = $request->json()->all();
        $errors = $this->validateInput($body, false);

        if ($errors) {
            return $this->validationError($errors);
        }

        $video = Video::find($id);

        if (! $video) {
            return $this->notFound('Vídeo não encontrado');
        }

        if (array_key_exists('youtubeId', $body)) {
            $extracted = YoutubeIdExtractor::extract($body['youtubeId']);
            if (! $extracted) {
                return $this->validationError(['youtubeId inválido']);
            }
            $video->youtubeId = $extracted;
        }

        // O slug nunca é regerado ao editar o título — mesma regra de doctors.
        foreach (['thumbnailUrl', 'order', 'published'] as $field) {
            if (array_key_exists($field, $body)) {
                $video->{$field} = $body[$field];
            }
        }
        if (array_key_exists('title', $body)) {
            $video->title = trim($body['title']);
        }
        $video->save();

        return response()->json($video);
    }

    public function destroy(string $id)
    {
        $video = Video::find($id);

        if (! $video) {
            return $this->notFound('Vídeo não encontrado');
        }

        $video->delete();

        return response('', 204);
    }

    private function uniqueSlugFor(string $title): string
    {
        $base = Slugify::make($title);
        $slug = $base;
        $n = 2;

        while (Video::where('slug', $slug)->exists()) {
            $slug = "{$base}-{$n}";
            $n++;
        }

        return $slug;
    }

    private function validateInput(array $body, bool $requireFields): array
    {
        $errors = [];

        if ($requireFields && (! is_string($body['title'] ?? null) || trim($body['title']) === '')) {
            $errors[] = 'title é obrigatório';
        }
        if (array_key_exists('title', $body) && ! is_string($body['title'])) {
            $errors[] = 'title precisa ser texto';
        }
        if ($requireFields && (! is_string($body['youtubeId'] ?? null) || trim($body['youtubeId']) === '')) {
            $errors[] = 'youtubeId é obrigatório';
        }
        if (array_key_exists('youtubeId', $body) && ! is_string($body['youtubeId'])) {
            $errors[] = 'youtubeId precisa ser texto';
        }
        if (array_key_exists('thumbnailUrl', $body) && $body['thumbnailUrl'] !== null && ! is_string($body['thumbnailUrl'])) {
            $errors[] = 'thumbnailUrl precisa ser texto ou null';
        }
        if (array_key_exists('order', $body) && ! is_int($body['order']) && ! is_float($body['order'])) {
            $errors[] = 'order precisa ser numérico';
        }
        if (array_key_exists('published', $body) && ! is_bool($body['published'])) {
            $errors[] = 'published precisa ser booleano';
        }

        return $errors;
    }
}
