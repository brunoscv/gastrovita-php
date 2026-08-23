<?php

namespace App\Models\Concerns;

use Illuminate\Support\Str;

trait HasUuid
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected static function bootHasUuid()
    {
        static::creating(function ($model) {
            if (! $model->getKey()) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }
}
