<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    use HasUuid;

    public $incrementing = false;

    protected $keyType = 'string';

    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';

    protected $fillable = ['title', 'youtubeId', 'thumbnailUrl', 'slug', 'order', 'published'];

    protected $casts = [
        'order' => 'integer',
        'published' => 'boolean',
    ];
}
