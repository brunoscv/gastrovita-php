<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;
use App\Support\YoutubeIdExtractor;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    private const TYPES = ['youtube', 'image', 'text'];

    public function index()
    {
        return response()->json(Testimonial::orderBy('order')->get());
    }

    public function show(string $id)
    {
        $testimonial = Testimonial::find($id);

        if (! $testimonial) {
            return $this->notFound('Depoimento não encontrado');
        }

        return response()->json($testimonial);
    }

    public function store(Request $request)
    {
        $body = $request->json()->all();
        $errors = $this->validateInput($body, true);

        if ($errors) {
            return $this->validationError($errors);
        }

        $type = $body['type'];
        $youtubeId = null;

        if ($type === 'youtube') {
            $youtubeId = YoutubeIdExtractor::extract($body['youtubeId']);
            if (! $youtubeId) {
                return $this->validationError(['youtubeId inválido']);
            }
        }

        $testimonial = Testimonial::create([
            'authorName' => $body['authorName'] ?? null,
            'type' => $type,
            'youtubeId' => $youtubeId,
            'imageUrl' => $type === 'image' ? $body['imageUrl'] : null,
            'text' => $type === 'text' ? $body['text'] : null,
            'rating' => $body['rating'] ?? null,
            'order' => $body['order'] ?? $this->nextOrder(Testimonial::class),
        ]);

        return response()->json($testimonial, 201);
    }

    public function update(Request $request, string $id)
    {
        $body = $request->json()->all();

        $testimonial = Testimonial::find($id);
        if (! $testimonial) {
            return $this->notFound('Depoimento não encontrado');
        }

        $errors = $this->validateInput($body, false);
        if ($errors) {
            return $this->validationError($errors);
        }

        $effectiveType = $body['type'] ?? $testimonial->type;

        $youtubeId = null;
        $youtubeIdProvided = false;
        if ($effectiveType === 'youtube') {
            $raw = array_key_exists('youtubeId', $body) ? $body['youtubeId'] : $testimonial->youtubeId;
            $extracted = $raw ? YoutubeIdExtractor::extract($raw) : null;
            if (! $extracted) {
                return $this->validationError(['youtubeId inválido']);
            }
            $youtubeId = $extracted;
            $youtubeIdProvided = true;
        } elseif (array_key_exists('type', $body)) {
            $youtubeId = null;
            $youtubeIdProvided = true;
        }

        if ($youtubeIdProvided) {
            $testimonial->youtubeId = $youtubeId;
        }
        if (array_key_exists('authorName', $body)) {
            $testimonial->authorName = $body['authorName'];
        }
        if (array_key_exists('type', $body)) {
            $testimonial->type = $effectiveType;
        }
        // imageUrl e text só mudam quando vêm explicitamente no body — trocar o
        // type não limpa esses campos automaticamente (mesmo comportamento do Node).
        if (array_key_exists('imageUrl', $body)) {
            $testimonial->imageUrl = $body['imageUrl'];
        }
        if (array_key_exists('text', $body)) {
            $testimonial->text = $body['text'];
        }
        if (array_key_exists('order', $body)) {
            $testimonial->order = $body['order'];
        }
        if (array_key_exists('rating', $body)) {
            $testimonial->rating = $body['rating'];
        }
        $testimonial->save();

        return response()->json($testimonial);
    }

    public function destroy(string $id)
    {
        $testimonial = Testimonial::find($id);

        if (! $testimonial) {
            return $this->notFound('Depoimento não encontrado');
        }

        $testimonial->delete();

        return response('', 204);
    }

    private function validateInput(array $body, bool $requireType): array
    {
        $errors = [];

        if ($requireType && ! is_string($body['type'] ?? null)) {
            $errors[] = 'type é obrigatório';
        }
        if (array_key_exists('type', $body) && ! in_array($body['type'], self::TYPES, true)) {
            $errors[] = 'type precisa ser um de: '.implode(', ', self::TYPES);
        }
        if (array_key_exists('authorName', $body) && $body['authorName'] !== null && ! is_string($body['authorName'])) {
            $errors[] = 'authorName precisa ser texto ou null';
        }
        if (array_key_exists('order', $body) && ! is_int($body['order']) && ! is_float($body['order'])) {
            $errors[] = 'order precisa ser numérico';
        }
        if (
            array_key_exists('rating', $body) && $body['rating'] !== null &&
            ((! is_int($body['rating']) && ! is_float($body['rating'])) || $body['rating'] < 1 || $body['rating'] > 5)
        ) {
            $errors[] = 'rating precisa ser um número entre 1 e 5, ou null';
        }

        $type = $body['type'] ?? null;
        if ($type === 'youtube' && (! is_string($body['youtubeId'] ?? null) || trim($body['youtubeId']) === '')) {
            $errors[] = 'youtubeId é obrigatório para depoimentos do tipo youtube';
        }
        if ($type === 'image' && (! is_string($body['imageUrl'] ?? null) || trim($body['imageUrl']) === '')) {
            $errors[] = 'imageUrl é obrigatório para depoimentos do tipo image';
        }
        if ($type === 'text' && (! is_string($body['text'] ?? null) || trim($body['text']) === '')) {
            $errors[] = 'text é obrigatório para depoimentos do tipo text';
        }

        return $errors;
    }
}
