<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Support\Slugify;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    public function index(Request $request)
    {
        $onlyActive = $request->query('all') !== 'true';

        $query = Doctor::orderBy('order');
        if ($onlyActive) {
            $query->where('active', true);
        }

        return response()->json($query->get());
    }

    public function show(string $id)
    {
        $doctor = Doctor::find($id);

        if (! $doctor) {
            return $this->notFound('Médico não encontrado');
        }

        return response()->json($doctor);
    }

    public function store(Request $request)
    {
        $body = $request->json()->all();
        $errors = $this->validateInput($body, true);

        if ($errors) {
            return $this->validationError($errors);
        }

        $name = trim($body['name']);

        $doctor = Doctor::create([
            'name' => $name,
            'slug' => $this->uniqueSlugFor($name),
            'crm' => $body['crm'] ?? null,
            'specialty' => $body['specialty'] ?? null,
            'bio' => $body['bio'] ?? null,
            'photoUrl' => $body['photoUrl'] ?? null,
            'order' => $body['order'] ?? $this->nextOrder(Doctor::class),
            'active' => $body['active'] ?? true,
        ]);

        return response()->json($doctor, 201);
    }

    public function update(Request $request, string $id)
    {
        $body = $request->json()->all();
        $errors = $this->validateInput($body, false);

        if ($errors) {
            return $this->validationError($errors);
        }

        $doctor = Doctor::find($id);

        if (! $doctor) {
            return $this->notFound('Médico não encontrado');
        }

        // O slug nunca é regerado ao editar o nome — permanece o original,
        // igual ao comportamento da rota Express.
        foreach (['crm', 'specialty', 'bio', 'photoUrl', 'order', 'active'] as $field) {
            if (array_key_exists($field, $body)) {
                $doctor->{$field} = $body[$field];
            }
        }
        if (array_key_exists('name', $body)) {
            $doctor->name = trim($body['name']);
        }
        $doctor->save();

        return response()->json($doctor);
    }

    public function destroy(string $id)
    {
        $doctor = Doctor::find($id);

        if (! $doctor) {
            return $this->notFound('Médico não encontrado');
        }

        $doctor->delete();

        return response('', 204);
    }

    private function uniqueSlugFor(string $name): string
    {
        $base = Slugify::make($name);
        $slug = $base;
        $n = 2;

        while (Doctor::where('slug', $slug)->exists()) {
            $slug = "{$base}-{$n}";
            $n++;
        }

        return $slug;
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
        foreach (['crm', 'specialty', 'bio', 'photoUrl'] as $field) {
            if (array_key_exists($field, $body) && $body[$field] !== null && ! is_string($body[$field])) {
                $errors[] = "{$field} precisa ser texto ou null";
            }
        }
        if (array_key_exists('order', $body) && ! is_int($body['order']) && ! is_float($body['order'])) {
            $errors[] = 'order precisa ser numérico';
        }
        if (array_key_exists('active', $body) && ! is_bool($body['active'])) {
            $errors[] = 'active precisa ser booleano';
        }

        return $errors;
    }
}
