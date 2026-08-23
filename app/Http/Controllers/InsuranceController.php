<?php

namespace App\Http\Controllers;

use App\Models\Insurance;
use Illuminate\Http\Request;

class InsuranceController extends Controller
{
    public function index()
    {
        return response()->json(Insurance::orderBy('order')->get());
    }

    public function show(string $id)
    {
        $insurance = Insurance::find($id);

        if (! $insurance) {
            return $this->notFound('Convênio não encontrado');
        }

        return response()->json($insurance);
    }

    public function store(Request $request)
    {
        $body = $request->json()->all();
        $errors = $this->validateInput($body, true);

        if ($errors) {
            return $this->validationError($errors);
        }

        $insurance = Insurance::create([
            'name' => trim($body['name']),
            'logoUrl' => $body['logoUrl'] ?? null,
            'order' => $body['order'] ?? $this->nextOrder(Insurance::class),
        ]);

        return response()->json($insurance, 201);
    }

    public function update(Request $request, string $id)
    {
        $body = $request->json()->all();
        $errors = $this->validateInput($body, false);

        if ($errors) {
            return $this->validationError($errors);
        }

        $insurance = Insurance::find($id);

        if (! $insurance) {
            return $this->notFound('Convênio não encontrado');
        }

        if (array_key_exists('name', $body)) {
            $insurance->name = trim($body['name']);
        }
        if (array_key_exists('logoUrl', $body)) {
            $insurance->logoUrl = $body['logoUrl'];
        }
        if (array_key_exists('order', $body)) {
            $insurance->order = $body['order'];
        }
        $insurance->save();

        return response()->json($insurance);
    }

    public function destroy(string $id)
    {
        $insurance = Insurance::find($id);

        if (! $insurance) {
            return $this->notFound('Convênio não encontrado');
        }

        $insurance->delete();

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
        if (array_key_exists('logoUrl', $body) && $body['logoUrl'] !== null && ! is_string($body['logoUrl'])) {
            $errors[] = 'logoUrl precisa ser texto ou null';
        }
        if (array_key_exists('order', $body) && ! is_int($body['order']) && ! is_float($body['order'])) {
            $errors[] = 'order precisa ser numérico';
        }

        return $errors;
    }
}
