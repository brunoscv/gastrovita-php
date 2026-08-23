<?php

namespace App\Http\Controllers;

use App\Models\ContactSubmission;
use Illuminate\Http\Request;

class ContactSubmissionController extends Controller
{
    /**
     * Rota pública: qualquer visitante do site pode enviar uma mensagem pelo
     * formulário de contato.
     */
    public function store(Request $request)
    {
        $body = $request->json()->all();
        $errors = $this->validateInput($body);

        if ($errors) {
            return $this->validationError($errors);
        }

        $submission = ContactSubmission::create([
            'name' => trim($body['name']),
            'email' => trim($body['email']),
            'phone' => $body['phone'] ?? null,
            'city' => $body['city'] ?? null,
            'isPatient' => $body['isPatient'] ?? null,
            'subject' => $body['subject'] ?? null,
            'message' => trim($body['message']),
        ]);

        return response()->json(['id' => $submission->id], 201);
    }

    /**
     * Daqui pra baixo, só admin autenticado — é a "caixa de entrada" do painel.
     */
    public function index()
    {
        return response()->json(ContactSubmission::orderByDesc('createdAt')->get());
    }

    public function update(Request $request, string $id)
    {
        $body = $request->json()->all();

        if (array_key_exists('read', $body) && ! is_bool($body['read'])) {
            return $this->validationError(['read precisa ser booleano']);
        }

        $submission = ContactSubmission::find($id);
        if (! $submission) {
            return $this->notFound('Mensagem não encontrada');
        }

        if (array_key_exists('read', $body)) {
            $submission->read = $body['read'];
            $submission->save();
        }

        return response()->json($submission);
    }

    public function destroy(string $id)
    {
        $submission = ContactSubmission::find($id);

        if (! $submission) {
            return $this->notFound('Mensagem não encontrada');
        }

        $submission->delete();

        return response('', 204);
    }

    private function validateInput(array $body): array
    {
        $errors = [];

        if (! is_string($body['name'] ?? null) || trim($body['name']) === '') {
            $errors[] = 'name é obrigatório';
        }
        if (! is_string($body['email'] ?? null) || ! preg_match('/^[^\s@]+@[^\s@]+\.[^\s@]+$/', $body['email'])) {
            $errors[] = 'email inválido';
        }
        if (! is_string($body['message'] ?? null) || trim($body['message']) === '') {
            $errors[] = 'message é obrigatório';
        }
        foreach (['phone', 'city', 'isPatient', 'subject'] as $field) {
            if (array_key_exists($field, $body) && $body[$field] !== null && ! is_string($body[$field])) {
                $errors[] = "{$field} precisa ser texto ou null";
            }
        }

        return $errors;
    }
}
