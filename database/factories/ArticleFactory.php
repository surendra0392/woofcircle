<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\ArticleCategory;

class ArticleFactory extends Factory
{
    public function definition(): array
    {
        $title = $this->faker->sentence;
        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'excerpt' => $this->faker->paragraph,
            'content' => $this->faker->paragraphs(3, true),
            'author_name' => $this->faker->name,
            'category_id' => ArticleCategory::inRandomOrder()->first()?->id ?? ArticleCategory::factory(),
            'is_published' => true,
            'published_at' => now(),
            'meta_title' => $this->faker->sentence,
            'meta_description' => $this->faker->sentence,
        ];
    }
}
