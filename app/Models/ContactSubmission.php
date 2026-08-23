<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Model;

class ContactSubmission extends Model
{
    use HasUuid;

    const CREATED_AT = 'createdAt';
    const UPDATED_AT = null;

    protected $fillable = ['name', 'email', 'phone', 'city', 'isPatient', 'subject', 'message', 'read'];

    protected $casts = [
        'read' => 'boolean',
    ];
}
