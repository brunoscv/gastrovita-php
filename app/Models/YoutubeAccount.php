<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Model;

class YoutubeAccount extends Model
{
    use HasUuid;

    public $incrementing = false;

    protected $keyType = 'string';

    public $timestamps = false;

    protected $table = 'youtube_accounts';

    protected $fillable = ['channelId', 'channelTitle', 'refreshToken'];

    protected $hidden = ['refreshToken'];
}
