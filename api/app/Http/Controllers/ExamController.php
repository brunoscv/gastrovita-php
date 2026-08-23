<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use Illuminate\Http\Request;

class ExamController extends Controller
{
    public function index()
    {
        return response()->json(Exam::orderBy('order')->get());
    }

    public function show(string $id)
    {
        $exam = Exam::find($id);

        if (! $exam) {
            return $this->notFound('Exame não encontrado');
        }

        return response()->json($exam);
    }

    public function store(Request $request)
    {
        $body = $request->json()->all();
        $errors = $this->validateInput($body, true);

        if ($errors) {
            return $this->validationError($errors);
        }

        $exam = Exam::create([
            'name' => trim($body['name']),
            'order' => $body['order'] ?? $this->nextOrder(Exam::class),
        ]);

        return response()->json($exam, 201);
    }

    public function update(Request $request, string $id)
    {
        $body = $request->json()->all();
        $errors = $this->validateInput($body, false);

        if ($errors) {
            return $this->validationError($errors);
        }

        $exam = Exam::find($id);

        if (! $exam) {
            return $this->notFound('Exame não encontrado');
        }

        if (array_key_exists('name', $body)) {
            $exam->name = trim($body['name']);
        }
        if (array_key_exists('order', $body)) {
            $exam->order = $body['order'];
        }
        $exam->save();

        return response()->json($exam);
    }

    public function destroy(string $id)
    {
        $exam = Exam::find($id);

        if (! $exam) {
            return $this->notFound('Exame não encontrado');
        }

        $exam->delete();

        return response('', 204);
    }

    private function validateInput(array $body, bool $requireName): array
    {
        $errors = [];

        if ($requireName && (! is_string($body['name'] ?? null) || trim($body['name']) === '')) {
            $errors[] = 'name é obrigatório';
        }
        if (array_key_exists('name', $body) && ! is_string($body['name'])) {
            $errors[] = 'name precisa ser texto';
        }
        if (array_key_exists('order', $body) && ! is_int($body['order']) && ! is_float($body['order'])) {
            $errors[] = 'order precisa ser numérico';
        }

        return $errors;
    }
}
