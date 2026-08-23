<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Model;

class Faq extends Model
{
    use HasUuid;

    public $timestamps = false;

    protected $fillable = ['question', 'answer', 'order'];

    protected $casts = [
        'order' => 'integer',
    ];
}
