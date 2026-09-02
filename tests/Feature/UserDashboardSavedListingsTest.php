<?php

use App\Models\BreederProfile;
use App\Models\City;
use App\Models\Event;
use App\Models\EventType;
use App\Models\SavedItem;
use App\Models\State;
use App\Models\User;
use App\Models\VetProfile;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('guests are redirected from dashboard/saved page', function () {
    $this->get('/dashboard/saved')->assertRedirect('/login');
});

test('authenticated users can visit dashboard and saved pages with no saved items', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->get('/dashboard')->assertOk();
    $this->get('/dashboard/saved')->assertOk();
});

test('authenticated users can visit dashboard and saved pages with saved directory items', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    // Create state and city
    $state = State::create(['name' => 'Maharashtra', 'slug' => 'maharashtra']);
    $city = City::create([
        'state_id' => $state->id,
        'name' => 'Mumbai',
        'slug' => 'mumbai',
    ]);

    // Create breeder and vet profiles manually (no factory needed)
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

    // Create event type and event
    $eventType = EventType::create([
        'name' => 'Dog Show',
        'is_active' => true,
    ]);

    $event = Event::create([
        'title' => 'Test Event',
        'description' => 'Test Event Description',
        'event_type_id' => $eventType->id,
        'start_date' => now()->addDays(2),
        'end_date' => now()->addDays(2),
        'start_time' => '10:00:00',
        'state_id' => $state->id,
        'city_id' => $city->id,
        'venue_name' => 'Test Venue',
        'address' => '123 Event St',
        'organizer_name' => 'Organizer',
        'contact_phone' => '1234567890',
        'contact_email' => 'organizer@example.com',
        'is_featured' => false,
        'is_active' => true,
    ]);

    // Save them
    SavedItem::create([
        'user_id' => $user->id,
        'saved_item_type' => BreederProfile::class,
        'saved_item_id' => $breeder->id,
    ]);

    SavedItem::create([
        'user_id' => $user->id,
        'saved_item_type' => VetProfile::class,
        'saved_item_id' => $vet->id,
    ]);

    SavedItem::create([
        'user_id' => $user->id,
        'saved_item_type' => Event::class,
        'saved_item_id' => $event->id,
    ]);

    $response = $this->get('/dashboard');
    $response->assertOk();

    // Verify it doesn't throw BadMethodCallException or RelationNotFoundException
    $savedPageResponse = $this->get('/dashboard/saved');
    $savedPageResponse->assertOk();
});
