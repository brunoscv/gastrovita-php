<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    use HasUuid;

    public $incrementing = false;

    protected $keyType = 'string';

    const CREATED_AT = 'createdAt';
    const UPDATED_AT = null;

    protected $fillable = ['authorName', 'type', 'youtubeId', 'imageUrl', 'text', 'rating', 'order'];

    protected $casts = [
        'order' => 'integer',
        'rating' => 'integer',
    ];
}
