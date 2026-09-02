<?php

use App\Models\Admin;
use App\Models\Breed;
use App\Models\Pet;
use App\Models\User;
use App\Models\Vaccination;

beforeEach(function () {
    // Create admin user
    $this->admin = Admin::create([
        'name' => 'Super Admin',
        'email' => 'admin-test@example.com',
        'password' => bcrypt('password'),
        'role' => 'superadmin',
        'is_active' => true,
    ]);

    // Ensure we have a breed for pet creation
    $this->breed = Breed::factory()->create([
        'name' => 'Labrador Retriever',
    ]);

    // Create a regular user for ownership
    $this->user = User::factory()->create();

    // Create a pet
    $this->pet = Pet::factory()->create([
        'name' => 'Buddy',
        'breed_id' => $this->breed->id,
        'user_id' => $this->user->id,
    ]);
});

test('guests are redirected to the admin login page from vaccination routes', function () {
    $this->get(route('admin.vaccinations.index'))->assertRedirect(route('admin.login'));
    $this->get(route('admin.vaccinations.create'))->assertRedirect(route('admin.login'));
});

test('authenticated admin can view vaccinations index', function () {
    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.vaccinations.index'))
        ->assertOk();
});

test('authenticated admin can view vaccinations create page', function () {
    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.vaccinations.create'))
        ->assertOk();
});

test('authenticated admin can store a new vaccination record', function () {
    $response = $this->actingAs($this->admin, 'admin')
        ->post(route('admin.vaccinations.store'), [
            'pet_id' => $this->pet->id,
            'vaccine_name' => 'Rabies',
            'vaccination_date' => '2026-05-01',
            'next_due_date' => '2027-05-01',
            'vet_name' => 'Dr. Smith clinic',
            'notes' => 'Boosters standard timeline.',
        ]);

    $response->assertRedirect(route('admin.vaccinations.index'));

    $this->assertDatabaseHas('vaccinations', [
        'pet_id' => $this->pet->id,
        'vaccine_name' => 'Rabies',
        'vaccination_date' => '2026-05-01 00:00:00',
        'next_due_date' => '2027-05-01 00:00:00',
        'vet_name' => 'Dr. Smith clinic',
        'notes' => 'Boosters standard timeline.',
    ]);
});

test('authenticated admin can view vaccination edit page', function () {
    $vaccination = Vaccination::factory()->create([
        'pet_id' => $this->pet->id,
        'vaccine_name' => 'Rabies',
        'vaccination_date' => '2026-05-01',
    ]);

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.vaccinations.edit', $vaccination->id))
        ->assertOk();
});

test('authenticated admin can update a vaccination record', function () {
    $vaccination = Vaccination::factory()->create([
        'pet_id' => $this->pet->id,
        'vaccine_name' => 'Rabies',
        'vaccination_date' => '2026-05-01',
    ]);

    $response = $this->actingAs($this->admin, 'admin')
        ->post(route('admin.vaccinations.update', $vaccination->id), [
            'pet_id' => $this->pet->id,
            'vaccine_name' => 'DHPP',
            'vaccination_date' => '2026-06-01',
            'next_due_date' => '2027-06-01',
            'vet_name' => 'Dr. Adams Clinic',
            'notes' => 'Switched brand name.',
        ]);

    $response->assertRedirect(route('admin.vaccinations.index'));

    $this->assertDatabaseHas('vaccinations', [
        'id' => $vaccination->id,
        'vaccine_name' => 'DHPP',
        'vaccination_date' => '2026-06-01 00:00:00',
        'next_due_date' => '2027-06-01 00:00:00',
        'vet_name' => 'Dr. Adams Clinic',
        'notes' => 'Switched brand name.',
    ]);
});

test('authenticated admin can delete a vaccination record', function () {
    $vaccination = Vaccination::factory()->create([
        'pet_id' => $this->pet->id,
        'vaccine_name' => 'Rabies',
    ]);

    $response = $this->actingAs($this->admin, 'admin')
        ->delete(route('admin.vaccinations.destroy', $vaccination->id));

    $response->assertRedirect(route('admin.vaccinations.index'));
    $this->assertDatabaseMissing('vaccinations', ['id' => $vaccination->id]);
});
