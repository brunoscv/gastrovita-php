<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Model;

class Insurance extends Model
{
    use HasUuid;

    public $timestamps = false;

    protected $fillable = ['name', 'logoUrl', 'order'];

    protected $casts = [
        'order' => 'integer',
    ];
}
