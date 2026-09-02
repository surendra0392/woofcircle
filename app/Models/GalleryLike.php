<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GalleryLike extends Model
{
    protected $fillable = [
        'gallery_id',
        'user_id',
        'ip_address',
        'session_id',
    ];

    public function gallery()
    {
        return $this->belongsTo(Gallery::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
