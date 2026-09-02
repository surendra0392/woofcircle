<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProfileView extends Model
{
    protected $fillable = [
        'viewable_type',
        'viewable_id',
        'ip_address',
        'interaction_type',
    ];

    public function viewable()
    {
        return $this->morphTo();
    }
}
