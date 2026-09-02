<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\ArticleCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SavedArticlesTest extends TestCase
{
    use RefreshDatabase;

    private function createArticle()
    {
        $category = ArticleCategory::create([
            'name' => 'Training',
            'slug' => 'training',
            'is_active' => true,
        ]);

        return Article::create([
            'title' => 'How to Train Your Puppy',
            'slug' => 'how-to-train-your-puppy',
            'content' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            'category_id' => $category->id,
            'is_published' => true,
        ]);
    }

    public function test_guests_cannot_save_articles()
    {
        $article = $this->createArticle();

        $response = $this->post(route('community.articles.save', $article->slug));

        $response->assertRedirect(route('login'));
    }

    public function test_logged_in_users_can_save_and_unsave_articles()
    {
        $user = User::factory()->create();
        $article = $this->createArticle();

        // 1. Save Article
        $response = $this->actingAs($user)->post(route('community.articles.save', $article->slug));

        $response->assertStatus(200);
        $response->assertJson(['saved' => true]);
        $this->assertTrue($user->savedArticles()->where('article_id', $article->id)->exists());

        // 2. Unsave Article
        $response = $this->actingAs($user)->post(route('community.articles.save', $article->slug));

        $response->assertStatus(200);
        $response->assertJson(['saved' => false]);
        $this->assertFalse($user->savedArticles()->where('article_id', $article->id)->exists());
    }

    public function test_saved_articles_appear_in_dashboard()
    {
        $user = User::factory()->create();
        $article = $this->createArticle();

        // Attach article to user's saved articles
        $user->savedArticles()->attach($article->id);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertStatus(200);
        $response->assertSee('saved_listings');
        $response->assertSee('articles');
    }
}
