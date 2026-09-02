<?php

namespace Tests\Feature;

use App\Models\Gallery;
use App\Models\GalleryCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GalleryEngagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_gallery_page_renders_with_engagement_stats()
    {
        // Seed some basic states and cities so the controller/views run fine
        \DB::table('states')->insertOrIgnore(['id' => 1, 'name' => 'Maharashtra', 'code' => 'MH']);
        \DB::table('cities')->insertOrIgnore(['id' => 1, 'name' => 'Mumbai', 'state_id' => 1]);

        $category = GalleryCategory::create([
            'name' => 'Puppies',
            'slug' => 'puppies',
            'is_active' => true,
        ]);

        $gallery = Gallery::create([
            'title' => 'Test Puppy Gallery',
            'description' => 'Beautiful puppies playing around.',
            'category_id' => $category->id,
            'is_active' => true,
        ]);

        $response = $this->get(route('community.gallery.index'));
        $response->assertStatus(200);
    }

    public function test_gallery_show_page_renders()
    {
        \DB::table('states')->insertOrIgnore(['id' => 1, 'name' => 'Maharashtra', 'code' => 'MH']);
        \DB::table('cities')->insertOrIgnore(['id' => 1, 'name' => 'Mumbai', 'state_id' => 1]);

        $category = GalleryCategory::create([
            'name' => 'Puppies',
            'slug' => 'puppies',
            'is_active' => true,
        ]);

        $gallery = Gallery::create([
            'title' => 'Test Puppy Gallery',
            'description' => 'Beautiful puppies playing around.',
            'category_id' => $category->id,
            'is_active' => true,
        ]);

        $response = $this->get(route('community.gallery.show', $gallery->slug));
        $response->assertStatus(200);
    }

    public function test_user_can_like_gallery()
    {
        $category = GalleryCategory::create([
            'name' => 'Puppies',
            'slug' => 'puppies',
            'is_active' => true,
        ]);

        $gallery = Gallery::create([
            'title' => 'Test Puppy Gallery',
            'description' => 'Beautiful puppies playing around.',
            'category_id' => $category->id,
            'is_active' => true,
        ]);

        // Post to like route
        $response = $this->post(route('community.gallery.like', $gallery->slug));
        $response->assertStatus(200);
        $response->assertJson(['liked' => true]);

        $this->assertEquals(1, $gallery->likes()->count());

        // Toggle like (unlike)
        $response = $this->post(route('community.gallery.like', $gallery->slug));
        $response->assertStatus(200);
        $response->assertJson(['liked' => false]);

        $this->assertEquals(0, $gallery->likes()->count());
    }

    public function test_user_can_share_gallery()
    {
        $category = GalleryCategory::create([
            'name' => 'Puppies',
            'slug' => 'puppies',
            'is_active' => true,
        ]);

        $gallery = Gallery::create([
            'title' => 'Test Puppy Gallery',
            'description' => 'Beautiful puppies playing around.',
            'category_id' => $category->id,
            'is_active' => true,
        ]);

        $response = $this->post(route('community.gallery.share', $gallery->slug));
        $response->assertStatus(200);

        $gallery->refresh();
        $this->assertEquals(1, $gallery->shares_count);
    }

    public function test_user_can_export_gallery()
    {
        $category = GalleryCategory::create([
            'name' => 'Puppies',
            'slug' => 'puppies',
            'is_active' => true,
        ]);

        $gallery = Gallery::create([
            'title' => 'Test Puppy Gallery',
            'description' => 'Beautiful puppies playing around.',
            'category_id' => $category->id,
            'is_active' => true,
        ]);

        $response = $this->post(route('community.gallery.export', $gallery->slug));
        $response->assertStatus(200);

        $gallery->refresh();
        $this->assertEquals(1, $gallery->exports_count);
    }

    public function test_user_can_download_gallery_zip()
    {
        $category = GalleryCategory::create([
            'name' => 'Puppies',
            'slug' => 'puppies',
            'is_active' => true,
        ]);

        $gallery = Gallery::create([
            'title' => 'Test Puppy Gallery',
            'description' => 'Beautiful puppies playing around.',
            'category_id' => $category->id,
            'is_active' => true,
        ]);

        $response = $this->get(route('community.gallery.download', $gallery->slug));
        $response->assertStatus(200);
        $response->assertHeader('content-type', 'application/zip');

        $gallery->refresh();
        $this->assertEquals(1, $gallery->exports_count);
    }

    public function test_user_can_download_gallery_via_api_export_zip()
    {
        $category = GalleryCategory::create([
            'name' => 'Puppies',
            'slug' => 'puppies',
            'is_active' => true,
        ]);

        $gallery = Gallery::create([
            'title' => 'Test Puppy Gallery',
            'description' => 'Beautiful puppies playing around.',
            'category_id' => $category->id,
            'is_active' => true,
        ]);

        $response = $this->get('/api/export-zip?type=gallery&slug='.$gallery->slug);
        $response->assertStatus(200);
        $response->assertHeader('content-type', 'application/zip');
    }
}
