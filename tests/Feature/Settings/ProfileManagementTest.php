<?php

use App\Models\City;
use App\Models\Role;
use App\Models\State;
use App\Models\User;
use App\Models\VetProfile;
use App\Models\BoardingProfile;
use App\Models\WelfareProfile;
use App\Models\BreederProfile;

beforeEach(function () {
    $this->state = State::create(['name' => 'Maharashtra', 'code' => 'MH']);
    $this->city = City::create(['name' => 'Mumbai', 'state_id' => $this->state->id, 'slug' => 'mumbai']);
});

test('vet profile edit page is displayed for authorized user', function () {
    $user = User::factory()->create();
    $role = Role::create(['name' => 'Veterinarian', 'slug' => 'vet']);
    $user->roles()->attach($role);

    $response = $this
        ->actingAs($user)
        ->get('/vet/profile');

    $response->assertOk();
});

test('vet profile edit page redirects unauthorized user', function () {
    $user = User::factory()->create();
    // No vet role

    $response = $this
        ->actingAs($user)
        ->get('/vet/profile');

    $response->assertRedirect('/dashboard');
});

test('vet profile information can be updated/created', function () {
    $user = User::factory()->create();
    $role = Role::firstOrCreate(['slug' => 'vet'], ['name' => 'Veterinarian']);
    $user->roles()->attach($role);

    $response = $this
        ->actingAs($user)
        ->post('/vet/profile', [
            'clinic_name' => 'Mumbai Vet Clinic',
            'description' => 'A great clinic',
            'phone' => '1234567890',
            'email' => 'vet@example.com',
            'experience_years' => 5,
            'state_id' => $this->state->id,
            'city_id' => $this->city->id,
            'address' => '123 Street, Mumbai',
        ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    $profile = VetProfile::where('user_id', $user->id)->first();
    expect($profile)->not->toBeNull();
    expect($profile->clinic_name)->toBe('Mumbai Vet Clinic');
    expect($profile->phone)->toBe('1234567890');
});

test('boarding profile edit page is displayed for authorized user', function () {
    $user = User::factory()->create();
    $role = Role::create(['name' => 'Boarding Provider', 'slug' => 'boarding']);
    $user->roles()->attach($role);

    $response = $this
        ->actingAs($user)
        ->get('/boarding/profile');

    $response->assertOk();
});

test('boarding profile edit page redirects unauthorized user', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get('/boarding/profile');

    $response->assertRedirect('/dashboard');
});

test('boarding profile information can be updated/created', function () {
    $user = User::factory()->create();
    $role = Role::firstOrCreate(['slug' => 'boarding'], ['name' => 'Boarding Provider']);
    $user->roles()->attach($role);

    $response = $this
        ->actingAs($user)
        ->post('/boarding/profile', [
            'name' => 'Mumbai Boarding',
            'description' => 'A great boarding house',
            'phone' => '1234567890',
            'email' => 'boarding@example.com',
            'service_type' => 'boarding',
            'price_per_day' => 450,
            'capacity' => 10,
            'state_id' => $this->state->id,
            'city_id' => $this->city->id,
            'address' => '123 Street, Mumbai',
        ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    $profile = BoardingProfile::where('user_id', $user->id)->first();
    expect($profile)->not->toBeNull();
    expect($profile->name)->toBe('Mumbai Boarding');
    expect($profile->price_per_day)->toEqual(450);
});

test('welfare profile edit page is displayed for authorized user', function () {
    $user = User::factory()->create();
    $role = Role::create(['name' => 'Welfare Organization', 'slug' => 'welfare']);
    $user->roles()->attach($role);

    $response = $this
        ->actingAs($user)
        ->get('/welfare/profile');

    $response->assertOk();
});

test('welfare profile edit page redirects unauthorized user', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get('/welfare/profile');

    $response->assertRedirect('/dashboard');
});

test('welfare profile information can be updated/created', function () {
    $user = User::factory()->create();
    $role = Role::firstOrCreate(['slug' => 'welfare'], ['name' => 'Welfare Organization']);
    $user->roles()->attach($role);

    $response = $this
        ->actingAs($user)
        ->post('/welfare/profile', [
            'organization_name' => 'Save Stray Dogs Mumbai',
            'description' => 'Rescue and shelter',
            'phone' => '1234567890',
            'email' => 'welfare@example.com',
            'website' => 'https://savestraydogs.org',
            'state_id' => $this->state->id,
            'city_id' => $this->city->id,
            'address' => '123 Street, Mumbai',
        ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    $profile = WelfareProfile::where('user_id', $user->id)->first();
    expect($profile)->not->toBeNull();
    expect($profile->organization_name)->toBe('Save Stray Dogs Mumbai');
    expect($profile->website)->toBe('https://savestraydogs.org');
});

test('breeder profile edit page is displayed for authorized user', function () {
    $user = User::factory()->create();
    $role = Role::firstOrCreate(['slug' => 'breeder'], ['name' => 'Breeder']);
    $user->roles()->attach($role);

    $response = $this
        ->actingAs($user)
        ->get('/breeder/profile');

    $response->assertOk();
});

test('breeder profile edit page redirects unauthorized user', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get('/breeder/profile');

    $response->assertRedirect('/dashboard');
});

test('breeder profile information can be updated/created', function () {
    $user = User::factory()->create();
    $role = Role::firstOrCreate(['slug' => 'breeder'], ['name' => 'Breeder']);
    $user->roles()->attach($role);

    $response = $this
        ->actingAs($user)
        ->post('/breeder/profile', [
            'kennel_name' => 'Mumbai Breeders',
            'description' => 'Top quality puppies',
            'phone' => '1234567890',
            'email' => 'breeder@example.com',
            'state_id' => $this->state->id,
            'city_id' => $this->city->id,
            'address' => '123 Street, Mumbai',
        ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    $profile = BreederProfile::where('user_id', $user->id)->first();
    expect($profile)->not->toBeNull();
    expect($profile->kennel_name)->toBe('Mumbai Breeders');
});
