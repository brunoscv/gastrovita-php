<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    public function index()
    {
        return response()->json(Faq::orderBy('order')->get());
    }

    public function show(string $id)
    {
        $faq = Faq::find($id);

        if (! $faq) {
            return $this->notFound('Pergunta não encontrada');
        }

        return response()->json($faq);
    }

    public function store(Request $request)
    {
        $body = $request->json()->all();
        $errors = $this->validateInput($body, true);

        if ($errors) {
            return $this->validationError($errors);
        }

        $order = $body['order'] ?? $this->nextOrder(Faq::class);

        $faq = Faq::create([
            'question' => trim($body['question']),
            'answer' => trim($body['answer']),
            'order' => $order,
        ]);

        return response()->json($faq, 201);
    }

    public function update(Request $request, string $id)
    {
        $body = $request->json()->all();
        $errors = $this->validateInput($body, false);

        if ($errors) {
            return $this->validationError($errors);
        }

        $faq = Faq::find($id);

        if (! $faq) {
            return $this->notFound('Pergunta não encontrada');
        }

        if (array_key_exists('question', $body)) {
            $faq->question = trim($body['question']);
        }
        if (array_key_exists('answer', $body)) {
            $faq->answer = trim($body['answer']);
        }
        if (array_key_exists('order', $body)) {
            $faq->order = $body['order'];
        }
        $faq->save();

        return response()->json($faq);
    }

    public function destroy(string $id)
    {
        $faq = Faq::find($id);

        if (! $faq) {
            return $this->notFound('Pergunta não encontrada');
        }

        $faq->delete();

        return response('', 204);
    }

    private function validateInput(array $body, bool $requireFields): array
    {
        $errors = [];

        if ($requireFields && (! is_string($body['question'] ?? null) || trim($body['question']) === '')) {
            $errors[] = 'question é obrigatório';
        }
        if (array_key_exists('question', $body) && ! is_string($body['question'])) {
            $errors[] = 'question precisa ser texto';
        }
        if ($requireFields && (! is_string($body['answer'] ?? null) || trim($body['answer']) === '')) {
            $errors[] = 'answer é obrigatório';
        }
        if (array_key_exists('answer', $body) && ! is_string($body['answer'])) {
            $errors[] = 'answer precisa ser texto';
        }
        if (array_key_exists('order', $body) && ! is_int($body['order']) && ! is_float($body['order'])) {
            $errors[] = 'order precisa ser numérico';
        }

        return $errors;
    }
}
