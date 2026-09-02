<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PetPhoto extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'pet_id',
        'image_path',
        'caption',
        'likes_count',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function pet()
    {
        return $this->belongsTo(Pet::class);
    }

    public function likes()
    {
        return $this->belongsToMany(User::class, 'pet_photo_likes')->withTimestamps();
    }
}
