<?php

use App\Models\Admin;
use App\Models\Breed;
use App\Models\Pet;
use App\Models\State;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
    
    // Create admin user
    $this->admin = Admin::create([
        'name' => 'Super Admin',
        'email' => 'admin-test@example.com',
        'password' => bcrypt('password'),
        'role' => 'superadmin',
        'is_active' => true,
    ]);

    // Create a breed
    $this->breed = Breed::factory()->create([
        'name' => 'Golden Retriever',
    ]);

    // Create a regular user for ownership test
    $this->user = User::factory()->create();
});

test('guests are redirected to the admin login page from pet routes', function () {
    $this->get(route('admin.pets.index'))->assertRedirect(route('admin.login'));
    $this->get(route('admin.pets.create'))->assertRedirect(route('admin.login'));
});

test('authenticated admin can view pets index', function () {
    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.pets.index'))
        ->assertOk();
});

test('authenticated admin can view pets create page', function () {
    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.pets.create'))
        ->assertOk();
});

test('authenticated admin can register a new pet with profile image', function () {
    $image = uploadedFileImage('avatar.png');

    $response = $this->actingAs($this->admin, 'admin')
        ->post(route('admin.pets.store'), [
            'name' => 'Cooper',
            'breed_id' => $this->breed->id,
            'gender' => 'male',
            'date_of_birth' => '2025-01-01',
            'color' => 'Golden',
            'microchip_number' => '123456789012345',
            'user_id' => $this->user->id,
            'profile_image' => $image,
            'is_champion' => true,
            'awards_count' => 3,
            'notes' => 'Very friendly show dog.',
        ]);

    $response->assertRedirect(route('admin.pets.index'));
    
    $this->assertDatabaseHas('pets', [
        'name' => 'Cooper',
        'breed_id' => $this->breed->id,
        'gender' => 'male',
        'date_of_birth' => '2025-01-01 00:00:00',
        'color' => 'Golden',
        'microchip_number' => '123456789012345',
        'user_id' => $this->user->id,
        'is_champion' => true,
        'awards_count' => 3,
        'notes' => 'Very friendly show dog.',
    ]);

    $pet = Pet::where('name', 'Cooper')->first();
    $this->assertNotNull($pet->profile_image_path);
    Storage::disk('public')->assertExists($pet->profile_image_path);
});

test('authenticated admin can view pet edit page', function () {
    $pet = Pet::create([
        'name' => 'Cooper',
        'breed_id' => $this->breed->id,
        'gender' => 'male',
        'user_id' => $this->user->id,
    ]);

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.pets.edit', $pet->id))
        ->assertOk();
});

test('authenticated admin can update pet details and profile image', function () {
    $pet = Pet::create([
        'name' => 'Cooper',
        'breed_id' => $this->breed->id,
        'gender' => 'male',
        'user_id' => $this->user->id,
    ]);

    $newImage = uploadedFileImage('new_avatar.png');

    $response = $this->actingAs($this->admin, 'admin')
        ->post(route('admin.pets.update', $pet->id), [
            'name' => 'Super Cooper',
            'breed_id' => $this->breed->id,
            'gender' => 'female',
            'date_of_birth' => '2025-02-02',
            'color' => 'Dark Golden',
            'microchip_number' => '999999999999999',
            'user_id' => $this->user->id,
            'profile_image' => $newImage,
            'is_champion' => false,
            'awards_count' => 0,
            'notes' => 'Updated notes.',
        ]);

    $response->assertRedirect(route('admin.pets.index'));

    $this->assertDatabaseHas('pets', [
        'id' => $pet->id,
        'name' => 'Super Cooper',
        'gender' => 'female',
        'date_of_birth' => '2025-02-02 00:00:00',
        'color' => 'Dark Golden',
        'microchip_number' => '999999999999999',
        'is_champion' => false,
        'awards_count' => 0,
        'notes' => 'Updated notes.',
    ]);

    $pet->refresh();
    Storage::disk('public')->assertExists($pet->profile_image_path);
});

test('authenticated admin can delete a pet', function () {
    $pet = Pet::create([
        'name' => 'Cooper',
        'breed_id' => $this->breed->id,
        'gender' => 'male',
        'user_id' => $this->user->id,
        'profile_image_path' => 'pets/profiles/test.png',
    ]);

    Storage::disk('public')->put('pets/profiles/test.png', 'fake profile content');

    $response = $this->actingAs($this->admin, 'admin')
        ->delete(route('admin.pets.destroy', $pet->id));

    $response->assertRedirect();
    $this->assertDatabaseMissing('pets', ['id' => $pet->id]);
    Storage::disk('public')->assertMissing('pets/profiles/test.png');
});

// Helper to create fake upload images — avoids a named class that violates PSR-4
function uploadedFileImage(string $name): \Illuminate\Http\UploadedFile
{
    return UploadedFile::fake()->image($name);
}
