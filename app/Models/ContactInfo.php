<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Model;

class ContactInfo extends Model
{
    use HasUuid;

    const CREATED_AT = null;
    const UPDATED_AT = 'updatedAt';

    protected $table = 'contact_infos';

    protected $fillable = ['phone', 'whatsapp', 'email', 'address', 'hours'];
}
