<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Model;

class AdminUser extends Model
{
    use HasUuid;

    const CREATED_AT = 'createdAt';
    const UPDATED_AT = null;

    protected $fillable = ['email', 'passwordHash', 'name', 'role', 'active'];

    protected $hidden = ['passwordHash'];

    protected $casts = [
        'active' => 'boolean',
    ];
}
