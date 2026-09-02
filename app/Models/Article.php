<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Article extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'featured_image',
        'author_name',
        'category_id',
        'user_id',
        'meta_title',
        'meta_description',
        'is_published',
        'is_featured',
        'published_at',
    ];

    protected $appends = [
        'featured_image_url',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
        'published_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($article) {
            if (empty($article->slug)) {
                $article->slug = Str::slug($article->title);
                $original = $article->slug;
                $count = 1;
                while (static::where('slug', $article->slug)->exists()) {
                    $article->slug = $original.'-'.$count++;
                }
            }

            if ($article->is_published && empty($article->published_at)) {
                $article->published_at = now();
            }
        });

        static::updating(function ($article) {
            if ($article->isDirty('is_published')) {
                if ($article->is_published && empty($article->published_at)) {
                    $article->published_at = now();
                }
            }
        });
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ArticleCategory::class, 'category_id');
    }

    public function gallery(): HasMany
    {
        return $this->hasMany(ArticleGallery::class)->orderBy('sort_order');
    }

    public function getFeaturedImageUrlAttribute(): ?string
    {
        if (! $this->featured_image) {
            return null;
        }

        if (str_starts_with($this->featured_image, 'http://') || str_starts_with($this->featured_image, 'https://')) {
            return $this->featured_image;
        }

        return Storage::url($this->featured_image);
    }

    /**
     * Get the users who saved this article.
     */
    public function savedByUsers()
    {
        return $this->belongsToMany(User::class, 'saved_articles')->withTimestamps();
    }

    /**
     * Get the user author of the article.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
