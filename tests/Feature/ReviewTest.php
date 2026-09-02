<?php

namespace Tests\Feature;

use App\Models\Breed;
use App\Models\BreederProfile;
use App\Models\City;
use App\Models\Litter;
use App\Models\Review;
use App\Models\State;
use App\Models\TrainerProfile;
use App\Models\User;
use App\Models\VetProfile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_post_reviews()
    {
        $response = $this->post(route('reviews.store'), [
            'rating' => 5,
            'comment' => 'Great clinic!',
            'reviewable_id' => 1,
            'reviewable_type' => 'vet',
        ]);

        $response->assertStatus(302);
        $response->assertRedirect(route('login'));
    }

    public function test_logged_in_users_can_post_reviews_for_profiles()
    {
        $user = User::factory()->create();

        $state = State::create(['name' => 'Maharashtra', 'slug' => 'maharashtra']);
        $city = City::create([
            'state_id' => $state->id,
            'name' => 'Mumbai',
            'slug' => 'mumbai',
        ]);

        $vet = VetProfile::create([
            'user_id' => $user->id,
            'clinic_name' => 'Test Vet',
            'email' => 'vet@example.com',
            'phone' => '1234567890',
            'description' => 'Test Vet Description',
            'state_id' => $state->id,
            'city_id' => $city->id,
            'address' => '123 Main St',
            'experience_years' => 5,
            'is_verified' => true,
            'is_active' => true,
        ]);

        $response = $this->actingAs($user)->post(route('reviews.store'), [
            'rating' => 5,
            'comment' => 'Great clinic!',
            'reviewable_id' => $vet->id,
            'reviewable_type' => 'vet',
        ]);

        $response->assertStatus(302);
        $this->assertDatabaseHas('reviews', [
            'user_id' => $user->id,
            'rating' => 5,
            'comment' => 'Great clinic!',
            'reviewable_id' => $vet->id,
            'reviewable_type' => 'vet',
            'status' => 'approved',
        ]);
    }

    public function test_logged_in_users_can_post_reviews_for_litters()
    {
        $user = User::factory()->create();

        $state = State::create(['name' => 'Maharashtra', 'slug' => 'maharashtra']);
        $city = City::create([
            'state_id' => $state->id,
            'name' => 'Mumbai',
            'slug' => 'mumbai',
        ]);

        $breeder = BreederProfile::create([
            'user_id' => $user->id,
            'kennel_name' => 'Test Breeder',
            'email' => 'breeder@example.com',
            'phone' => '1234567890',
            'description' => 'Test Breeder Description',
            'state_id' => $state->id,
            'city_id' => $city->id,
            'address' => '123 Main St',
            'is_verified' => true,
            'is_active' => true,
        ]);

        $breed = Breed::factory()->create([
            'name' => 'Golden Retriever',
            'slug' => 'golden-retriever',
        ]);

        $litter = Litter::create([
            'user_id' => $user->id,
            'profile_id' => $breeder->id,
            'profile_type' => BreederProfile::class,
            'breed_id' => $breed->id,
            'state_id' => $state->id,
            'city_id' => $city->id,
            'title' => 'Golden Retriever Litter',
            'slug' => 'golden-retriever-litter',
            'description' => 'Beautiful golden retrievers.',
            'price' => 25000,
            'is_approved' => true,
            'is_available' => true,
        ]);

        $response = $this->actingAs($user)->post(route('reviews.store'), [
            'rating' => 4,
            'comment' => 'Healthy puppies!',
            'reviewable_id' => $litter->id,
            'reviewable_type' => 'litter',
        ]);

        $response->assertStatus(302);
        $this->assertDatabaseHas('reviews', [
            'user_id' => $user->id,
            'rating' => 4,
            'comment' => 'Healthy puppies!',
            'reviewable_id' => $litter->id,
            'reviewable_type' => 'litter',
            'status' => 'approved',
        ]);
    }

    public function test_user_can_update_their_own_review()
    {
        $user = User::factory()->create();
        $state = State::create(['name' => 'Maharashtra', 'slug' => 'maharashtra']);
        $city = City::create(['state_id' => $state->id, 'name' => 'Mumbai', 'slug' => 'mumbai']);

        $vet = VetProfile::create([
            'user_id' => $user->id,
            'clinic_name' => 'Test Vet',
            'email' => 'vet@example.com',
            'phone' => '1234567890',
            'description' => 'Test Vet Description',
            'state_id' => $state->id,
            'city_id' => $city->id,
            'address' => '123 Main St',
            'experience_years' => 5,
            'is_verified' => true,
            'is_active' => true,
        ]);

        $review = Review::create([
            'user_id' => $user->id,
            'rating' => 3,
            'comment' => 'Okay clinic',
            'reviewable_id' => $vet->id,
            'reviewable_type' => 'vet',
            'status' => 'approved',
        ]);

        $response = $this->actingAs($user)->put(route('reviews.update', $review->id), [
            'rating' => 5,
            'comment' => 'Actually, it is great!',
        ]);

        $response->assertStatus(302);
        $this->assertDatabaseHas('reviews', [
            'id' => $review->id,
            'rating' => 5,
            'comment' => 'Actually, it is great!',
        ]);
    }

    public function test_user_cannot_update_others_review()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $state = State::create(['name' => 'Maharashtra', 'slug' => 'maharashtra']);
        $city = City::create(['state_id' => $state->id, 'name' => 'Mumbai', 'slug' => 'mumbai']);

        $vet = VetProfile::create([
            'user_id' => $user1->id,
            'clinic_name' => 'Test Vet',
            'email' => 'vet@example.com',
            'phone' => '1234567890',
            'description' => 'Test Vet Description',
            'state_id' => $state->id,
            'city_id' => $city->id,
            'address' => '123 Main St',
            'experience_years' => 5,
            'is_verified' => true,
            'is_active' => true,
        ]);

        $review = Review::create([
            'user_id' => $user1->id,
            'rating' => 3,
            'comment' => 'Okay clinic',
            'reviewable_id' => $vet->id,
            'reviewable_type' => 'vet',
            'status' => 'approved',
        ]);

        $response = $this->actingAs($user2)->put(route('reviews.update', $review->id), [
            'rating' => 5,
            'comment' => 'Hacked comment',
        ]);

        $response->assertStatus(403);
        $this->assertDatabaseHas('reviews', [
            'id' => $review->id,
            'rating' => 3,
            'comment' => 'Okay clinic',
        ]);
    }

    public function test_user_can_delete_their_own_review()
    {
        $user = User::factory()->create();
        $state = State::create(['name' => 'Maharashtra', 'slug' => 'maharashtra']);
        $city = City::create(['state_id' => $state->id, 'name' => 'Mumbai', 'slug' => 'mumbai']);

        $vet = VetProfile::create([
            'user_id' => $user->id,
            'clinic_name' => 'Test Vet',
            'email' => 'vet@example.com',
            'phone' => '1234567890',
            'description' => 'Test Vet Description',
            'state_id' => $state->id,
            'city_id' => $city->id,
            'address' => '123 Main St',
            'experience_years' => 5,
            'is_verified' => true,
            'is_active' => true,
        ]);

        $review = Review::create([
            'user_id' => $user->id,
            'rating' => 3,
            'comment' => 'Okay clinic',
            'reviewable_id' => $vet->id,
            'reviewable_type' => 'vet',
            'status' => 'approved',
        ]);

        $response = $this->actingAs($user)->delete(route('reviews.destroy', $review->id));

        $response->assertStatus(302);
        $this->assertDatabaseMissing('reviews', [
            'id' => $review->id,
        ]);
    }

    public function test_user_cannot_delete_others_review()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $state = State::create(['name' => 'Maharashtra', 'slug' => 'maharashtra']);
        $city = City::create(['state_id' => $state->id, 'name' => 'Mumbai', 'slug' => 'mumbai']);

        $vet = VetProfile::create([
            'user_id' => $user1->id,
            'clinic_name' => 'Test Vet',
            'email' => 'vet@example.com',
            'phone' => '1234567890',
            'description' => 'Test Vet Description',
            'state_id' => $state->id,
            'city_id' => $city->id,
            'address' => '123 Main St',
            'experience_years' => 5,
            'is_verified' => true,
            'is_active' => true,
        ]);

        $review = Review::create([
            'user_id' => $user1->id,
            'rating' => 3,
            'comment' => 'Okay clinic',
            'reviewable_id' => $vet->id,
            'reviewable_type' => 'vet',
            'status' => 'approved',
        ]);

        $response = $this->actingAs($user2)->delete(route('reviews.destroy', $review->id));

        $response->assertStatus(403);
        $this->assertDatabaseHas('reviews', [
            'id' => $review->id,
        ]);
    }

    public function test_user_can_view_their_reviews_on_dashboard_reviews_page()
    {
        $user = User::factory()->create();
        $state = State::create(['name' => 'Maharashtra', 'slug' => 'maharashtra']);
        $city = City::create(['state_id' => $state->id, 'name' => 'Mumbai', 'slug' => 'mumbai']);

        $vet = VetProfile::create([
            'user_id' => $user->id,
            'clinic_name' => 'Test Vet',
            'email' => 'vet@example.com',
            'phone' => '1234567890',
            'description' => 'Test Vet Description',
            'state_id' => $state->id,
            'city_id' => $city->id,
            'address' => '123 Main St',
            'experience_years' => 5,
            'is_verified' => true,
            'is_active' => true,
        ]);

        $review = Review::create([
            'user_id' => $user->id,
            'rating' => 3,
            'comment' => 'Okay clinic',
            'reviewable_id' => $vet->id,
            'reviewable_type' => 'vet',
            'status' => 'approved',
        ]);

        $response = $this->actingAs($user)->get(route('dashboard.reviews'));

        $response->assertOk();
        $response->assertSee('Okay clinic');
    }

    public function test_reviews_index_endpoint_paginates_and_returns_breakdown()
    {
        $user = User::factory()->create();
        $state = State::create(['name' => 'Maharashtra', 'slug' => 'maharashtra']);
        $city = City::create(['state_id' => $state->id, 'name' => 'Mumbai', 'slug' => 'mumbai']);

        $vet = VetProfile::create([
            'user_id' => $user->id,
            'clinic_name' => 'Test Vet',
            'email' => 'vet@example.com',
            'phone' => '1234567890',
            'description' => 'Test Vet Description',
            'state_id' => $state->id,
            'city_id' => $city->id,
            'address' => '123 Main St',
            'experience_years' => 5,
            'is_verified' => true,
            'is_active' => true,
        ]);

        // Create 8 reviews: 5 with rating 5, 3 with rating 4
        for ($i = 0; $i < 5; $i++) {
            Review::create([
                'user_id' => $user->id,
                'rating' => 5,
                'comment' => "Review five star $i",
                'reviewable_id' => $vet->id,
                'reviewable_type' => 'vet',
                'status' => 'approved',
            ]);
        }
        for ($i = 0; $i < 3; $i++) {
            Review::create([
                'user_id' => $user->id,
                'rating' => 4,
                'comment' => "Review four star $i",
                'reviewable_id' => $vet->id,
                'reviewable_type' => 'vet',
                'status' => 'approved',
            ]);
        }

        // Call the AJAX endpoint
        $response = $this->getJson("/reviews?reviewable_id={$vet->id}&reviewable_type=vet&page=1");

        $response->assertOk();
        $response->assertJsonStructure([
            'pagination' => [
                'current_page',
                'data',
                'first_page_url',
                'from',
                'last_page',
                'last_page_url',
                'links',
                'next_page_url',
                'path',
                'per_page',
                'prev_page_url',
                'to',
                'total',
            ],
            'breakdown' => [
                '1',
                '2',
                '3',
                '4',
                '5',
            ],
        ]);

        $responseData = $response->json();

        // Assert total count in pagination is 8
        $this->assertEquals(8, $responseData['pagination']['total']);

        // Page 1 should contain 5 reviews
        $this->assertCount(5, $responseData['pagination']['data']);

        // Assert breakdown is correct
        $this->assertEquals(5, $responseData['breakdown']['5']);
        $this->assertEquals(3, $responseData['breakdown']['4']);
        $this->assertEquals(0, $responseData['breakdown']['3']);
        $this->assertEquals(0, $responseData['breakdown']['2']);
        $this->assertEquals(0, $responseData['breakdown']['1']);
    }

    public function test_dashboard_reviews_page_is_paginated_and_filterable()
    {
        $user = User::factory()->create();
        $state = State::create(['name' => 'Maharashtra', 'slug' => 'maharashtra']);
        $city = City::create(['state_id' => $state->id, 'name' => 'Mumbai', 'slug' => 'mumbai']);

        $vet = VetProfile::create([
            'user_id' => $user->id,
            'clinic_name' => 'Test Vet',
            'email' => 'vet@example.com',
            'phone' => '1234567890',
            'description' => 'Test Vet Description',
            'state_id' => $state->id,
            'city_id' => $city->id,
            'address' => '123 Main St',
            'experience_years' => 5,
            'is_verified' => true,
            'is_active' => true,
        ]);

        $trainer = TrainerProfile::create([
            'user_id' => $user->id,
            'name' => 'Test Trainer',
            'email' => 'trainer@example.com',
            'phone' => '1234567891',
            'description' => 'Test Trainer Description',
            'state_id' => $state->id,
            'city_id' => $city->id,
            'address' => '123 Main St 2',
            'experience_years' => 5,
            'is_verified' => true,
            'is_active' => true,
        ]);

        // Create 4 reviews for Vet (rating 5)
        for ($i = 0; $i < 4; $i++) {
            Review::create([
                'user_id' => $user->id,
                'rating' => 5,
                'comment' => "Vet review $i",
                'reviewable_id' => $vet->id,
                'reviewable_type' => 'vet',
                'status' => 'approved',
            ]);
        }

        // Create 3 reviews for Trainer (rating 4)
        for ($i = 0; $i < 3; $i++) {
            Review::create([
                'user_id' => $user->id,
                'rating' => 4,
                'comment' => "Trainer review $i",
                'reviewable_id' => $trainer->id,
                'reviewable_type' => 'trainer',
                'status' => 'approved',
            ]);
        }

        // 1. Assert dashboard reviews is paginated (5 per page, total 7)
        $response = $this->actingAs($user)->get(route('dashboard.reviews'));
        $response->assertOk();

        $inertiaData = $response->original->getData()['page']['props']['reviews'];
        $this->assertEquals(7, $inertiaData['total']);
        $this->assertCount(5, $inertiaData['data']);

        // 2. Assert filtering by rating (rating=5 should return 4 reviews, no pagination since total 4 <= 5)
        $responseRating = $this->actingAs($user)->get(route('dashboard.reviews', ['rating' => 5]));
        $responseRating->assertOk();
        $inertiaRatingData = $responseRating->original->getData()['page']['props']['reviews'];
        $this->assertEquals(4, $inertiaRatingData['total']);
        $this->assertCount(4, $inertiaRatingData['data']);

        // 3. Assert filtering by type (type=trainer should return 3 reviews)
        $responseType = $this->actingAs($user)->get(route('dashboard.reviews', ['type' => 'trainer']));
        $responseType->assertOk();
        $inertiaTypeData = $responseType->original->getData()['page']['props']['reviews'];
        $this->assertEquals(3, $inertiaTypeData['total']);
        $this->assertCount(3, $inertiaTypeData['data']);

        // 4. Assert filtering by both rating and type (rating=4 & type=trainer should return 3 reviews)
        $responseBoth = $this->actingAs($user)->get(route('dashboard.reviews', ['rating' => 4, 'type' => 'trainer']));
        $responseBoth->assertOk();
        $inertiaBothData = $responseBoth->original->getData()['page']['props']['reviews'];
        $this->assertEquals(3, $inertiaBothData['total']);

        // rating=5 & type=trainer should return 0 reviews
        $responseNone = $this->actingAs($user)->get(route('dashboard.reviews', ['rating' => 5, 'type' => 'trainer']));
        $responseNone->assertOk();
        $inertiaNoneData = $responseNone->original->getData()['page']['props']['reviews'];
        $this->assertEquals(0, $inertiaNoneData['total']);
    }
}
