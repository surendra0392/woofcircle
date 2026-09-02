<?php

namespace App\Traits;

use App\Models\Review;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait Reviewable
{
    /**
     * Get all of the reviews for the model.
     */
    public function reviews(): MorphMany
    {
        return $this->morphMany(Review::class, 'reviewable');
    }

    /**
     * Get the average rating for the model.
     */
    public function averageRating()
    {
        return $this->reviews()->where('status', 'approved')->avg('rating') ?: 0;
    }

    /**
     * Get the count of approved reviews.
     */
    public function reviewsCount()
    {
        return $this->reviews()->where('status', 'approved')->count();
    }
}
