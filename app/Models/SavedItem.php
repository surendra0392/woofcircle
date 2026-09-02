<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class SavedItem extends Model
{
    protected $fillable = [
        'user_id',
        'saved_item_id',
        'saved_item_type',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function savedItem(): MorphTo
    {
        return $this->morphTo('savedItem', 'saved_item_type', 'saved_item_id');
    }
}
