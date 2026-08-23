<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    use HasUuid;

    public $timestamps = false;

    protected $fillable = ['name', 'order'];

    protected $casts = [
        'order' => 'integer',
    ];
}
