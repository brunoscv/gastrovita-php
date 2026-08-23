<?php

namespace App\Http\Controllers;

use App\Models\ContactInfo;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    private const FIELDS = ['phone', 'whatsapp', 'email', 'address', 'hours'];

    public function show()
    {
        $info = ContactInfo::query()->first();

        // response()->json(null) do Laravel serializa como "{}", não "null" —
        // aqui replicamos o res.json(null) do Node (corpo "null" literal) pra
        // manter o contrato idêntico quando ainda não existe registro.
        if ($info === null) {
            return response('null', 200, ['Content-Type' => 'application/json']);
        }

        return response()->json($info);
    }

    public function update(Request $request)
    {
        $body = $request->json()->all();
        $errors = [];

        foreach (self::FIELDS as $field) {
            if (array_key_exists($field, $body) && $body[$field] !== null && ! is_string($body[$field])) {
                $errors[] = "{$field} precisa ser texto ou null";
            }
        }
        if ($errors) {
            return $this->validationError($errors);
        }

        $data = [];
        foreach (self::FIELDS as $field) {
            if (array_key_exists($field, $body)) {
                $data[$field] = $body[$field];
            }
        }

        $existing = ContactInfo::query()->first();
        $info = $existing
            ? tap($existing)->update($data)
            : ContactInfo::create($data);

        return response()->json($info);
    }
}
