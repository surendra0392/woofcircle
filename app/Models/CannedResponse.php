<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CannedResponse extends Model
{
    /** @use HasFactory<\Database\Factories\CannedResponseFactory> */
    use HasFactory;

    protected $fillable = ['title', 'content'];
}
