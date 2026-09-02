<?php

use App\Models\Admin;
use App\Models\Article;
use App\Models\ArticleCategory;
use App\Models\ArticleGallery;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');

    // Seed roles
    $this->seed(\Database\Seeders\RoleSeeder::class);

    // Create admin user
    $this->admin = Admin::create([
        'name' => 'Super Admin',
        'email' => 'admin-test@example.com',
        'password' => bcrypt('password'),
        'role' => 'superadmin',
        'is_active' => true,
    ]);

    // Create category
    $this->category = ArticleCategory::create([
        'name' => 'Canine Nutrition',
        'slug' => 'canine-nutrition',
        'is_active' => true,
    ]);

    // Create author user
    $this->author = User::factory()->create([
        'name' => 'Author Jane',
    ]);
});

test('guests are redirected to the admin login page from article routes', function () {
    $this->get(route('admin.articles.index'))->assertRedirect(route('admin.login'));
    $this->get(route('admin.articles.create'))->assertRedirect(route('admin.login'));
});

test('authenticated admin can view articles index', function () {
    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.articles.index'))
        ->assertOk();
});

test('authenticated admin can view article create page', function () {
    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.articles.create'))
        ->assertOk();
});

test('authenticated admin can store a new article', function () {
    $featured = UploadedFile::fake()->image('cover.jpg');
    $gallery1 = UploadedFile::fake()->image('g1.jpg');
    $gallery2 = UploadedFile::fake()->image('g2.jpg');

    $response = $this->actingAs($this->admin, 'admin')
        ->post(route('admin.articles.store'), [
            'title' => 'Puppy Training Basics',
            'excerpt' => 'An article about puppy training.',
            'content' => '<p>Simple step by step instructions.</p>',
            'author_name' => 'Guest Writer',
            'category_id' => $this->category->id,
            'user_id' => $this->author->id,
            'meta_title' => 'SEO Title for Puppy Training',
            'meta_description' => 'SEO description.',
            'is_published' => true,
            'is_featured' => true,
            'featured_image' => $featured,
            'gallery' => [$gallery1, $gallery2],
        ]);

    $response->assertRedirect(route('admin.articles.index'));

    $this->assertDatabaseHas('articles', [
        'title' => 'Puppy Training Basics',
        'excerpt' => 'An article about puppy training.',
        'author_name' => 'Guest Writer',
        'category_id' => $this->category->id,
        'user_id' => $this->author->id,
        'meta_title' => 'SEO Title for Puppy Training',
        'is_published' => true,
        'is_featured' => true,
    ]);

    $article = Article::first();
    expect($article->featured_image)->not->toBeNull();
    Storage::disk('public')->assertExists($article->featured_image);

    expect($article->gallery)->toHaveCount(2);
    foreach ($article->gallery as $item) {
        Storage::disk('public')->assertExists($item->image_path);
    }
});

test('authenticated admin can view article edit page', function () {
    $article = Article::create([
        'title' => 'Puppy Training Basics',
        'slug' => 'puppy-training-basics',
        'content' => '<p>Simple instruction.</p>',
        'category_id' => $this->category->id,
    ]);

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.articles.edit', $article->id))
        ->assertOk();
});

test('authenticated admin can update an article', function () {
    $article = Article::create([
        'title' => 'Puppy Training Basics',
        'slug' => 'puppy-training-basics',
        'content' => '<p>Simple instruction.</p>',
        'category_id' => $this->category->id,
    ]);

    $newFeatured = UploadedFile::fake()->image('new-cover.jpg');
    $gallery = UploadedFile::fake()->image('new-gal.jpg');

    $response = $this->actingAs($this->admin, 'admin')
        ->post(route('admin.articles.update', $article->id), [
            'title' => 'Puppy Training Basics Updated',
            'excerpt' => 'Updated excerpt summary.',
            'content' => '<p>Updated content body details.</p>',
            'author_name' => 'Dr. Jane Smith',
            'category_id' => $this->category->id,
            'user_id' => $this->author->id,
            'meta_title' => 'SEO Title Updated',
            'meta_description' => 'SEO Description Updated',
            'featured_image' => $newFeatured,
            'gallery' => [$gallery],
            'is_published' => true,
            'is_featured' => false,
        ]);

    $response->assertRedirect(route('admin.articles.index'));

    $this->assertDatabaseHas('articles', [
        'id' => $article->id,
        'title' => 'Puppy Training Basics Updated',
        'author_name' => 'Dr. Jane Smith',
        'is_featured' => false,
    ]);

    $article->refresh();
    Storage::disk('public')->assertExists($article->featured_image);
    expect($article->gallery)->toHaveCount(1);
    Storage::disk('public')->assertExists($article->gallery->first()->image_path);
});

test('authenticated admin can toggle article publication and featured status', function () {
    $article = Article::create([
        'title' => 'Puppy Training Basics',
        'slug' => 'puppy-training-basics',
        'content' => '<p>Simple instruction.</p>',
        'category_id' => $this->category->id,
        'is_published' => true,
        'is_featured' => false,
    ]);

    // Toggle publish status
    $response = $this->actingAs($this->admin, 'admin')
        ->patch(route('admin.articles.toggle-publish', $article->id));
    $response->assertRedirect(route('admin.articles.index'));
    $this->assertDatabaseHas('articles', ['id' => $article->id, 'is_published' => false]);

    // Toggle featured status
    $response = $this->actingAs($this->admin, 'admin')
        ->patch(route('admin.articles.toggle-featured', $article->id));
    $response->assertRedirect(route('admin.articles.index'));
    $this->assertDatabaseHas('articles', ['id' => $article->id, 'is_featured' => true]);
});

test('authenticated admin can delete a gallery image from article', function () {
    $article = Article::create([
        'title' => 'Puppy Training Basics',
        'slug' => 'puppy-training-basics',
        'content' => '<p>Simple instruction.</p>',
        'category_id' => $this->category->id,
    ]);

    $imagePath = 'articles/gallery/test.jpg';
    Storage::disk('public')->put($imagePath, 'dummy');

    $galleryImage = $article->gallery()->create([
        'image_path' => $imagePath,
        'sort_order' => 0,
    ]);

    $response = $this->actingAs($this->admin, 'admin')
        ->delete(route('admin.articles.gallery.destroy', $galleryImage->id));

    $response->assertRedirect();
    $this->assertDatabaseMissing('article_galleries', ['id' => $galleryImage->id]);
    Storage::disk('public')->assertMissing($imagePath);
});

test('authenticated admin can permanently delete an article', function () {
    $article = Article::create([
        'title' => 'Puppy Training Basics',
        'slug' => 'puppy-training-basics',
        'content' => '<p>Simple instruction.</p>',
        'category_id' => $this->category->id,
    ]);

    $featuredPath = 'articles/images/cover.jpg';
    $galleryPath = 'articles/gallery/g.jpg';

    Storage::disk('public')->put($featuredPath, 'dummy');
    Storage::disk('public')->put($galleryPath, 'dummy');

    $article->update(['featured_image' => $featuredPath]);
    $galleryItem = $article->gallery()->create(['image_path' => $galleryPath, 'sort_order' => 0]);

    $response = $this->actingAs($this->admin, 'admin')
        ->delete(route('admin.articles.destroy', $article->id));

    $response->assertRedirect(route('admin.articles.index'));
    $this->assertDatabaseMissing('articles', ['id' => $article->id]);
    $this->assertDatabaseMissing('article_galleries', ['id' => $galleryItem->id]);

    Storage::disk('public')->assertMissing($featuredPath);
    Storage::disk('public')->assertMissing($galleryPath);
});
