<?php

use App\Models\Admin;
use App\Models\Breed;
use App\Models\Appointment;
use App\Models\Pet;
use App\Models\User;

beforeEach(function () {
    // Create admin user
    $this->admin = Admin::create([
        'name' => 'Super Admin',
        'email' => 'admin-appointment-test@example.com',
        'password' => bcrypt('password'),
        'role' => 'superadmin',
        'is_active' => true,
    ]);

    // Ensure we have a breed for pet creation
    $this->breed = Breed::factory()->create([
        'name' => 'Bulldog',
    ]);

    // Create a regular user for ownership
    $this->user = User::factory()->create();

    // Create a pet
    $this->pet = Pet::factory()->create([
        'name' => 'Rocky',
        'breed_id' => $this->breed->id,
        'user_id' => $this->user->id,
    ]);
});

test('guests are redirected to the admin login page from appointment routes', function () {
    $this->get(route('admin.appointments.index'))->assertRedirect(route('admin.login'));
    $this->get(route('admin.appointments.create'))->assertRedirect(route('admin.login'));
});

test('authenticated admin can view appointments index', function () {
    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.appointments.index'))
        ->assertOk();
});

test('authenticated admin can view appointments create page', function () {
    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.appointments.create'))
        ->assertOk();
});

test('authenticated admin can store a new appointment record', function () {
    $response = $this->actingAs($this->admin, 'admin')
        ->post(route('admin.appointments.store'), [
            'pet_id' => $this->pet->id,
            'appointment_type' => 'checkup',
            'appointment_date' => '2026-06-15 10:00:00',
            'status' => 'scheduled',
            'doctor_name' => 'Dr. Gregory',
            'clinic_name' => 'Plaza Animal Hospital',
            'notes' => 'Routine clinical checkup.',
        ]);

    $response->assertRedirect(route('admin.appointments.index'));

    $this->assertDatabaseHas('appointments', [
        'pet_id' => $this->pet->id,
        'appointment_type' => 'checkup',
        'appointment_date' => '2026-06-15 10:00:00',
        'status' => 'scheduled',
        'doctor_name' => 'Dr. Gregory',
        'clinic_name' => 'Plaza Animal Hospital',
        'notes' => 'Routine clinical checkup.',
    ]);
});

test('authenticated admin can view appointment edit page', function () {
    $appointment = Appointment::create([
        'pet_id' => $this->pet->id,
        'appointment_type' => 'vaccination',
        'status' => 'scheduled',
        'appointment_date' => '2026-06-15 10:00:00',
    ]);

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.appointments.edit', $appointment->id))
        ->assertOk();
});

test('authenticated admin can update an appointment record', function () {
    $appointment = Appointment::create([
        'pet_id' => $this->pet->id,
        'appointment_type' => 'vaccination',
        'status' => 'scheduled',
        'appointment_date' => '2026-06-15 10:00:00',
    ]);

    $response = $this->actingAs($this->admin, 'admin')
        ->post(route('admin.appointments.update', $appointment->id), [
            'pet_id' => $this->pet->id,
            'appointment_type' => 'surgery',
            'status' => 'completed',
            'appointment_date' => '2026-06-16 11:30:00',
            'doctor_name' => 'Dr. Lisa',
            'clinic_name' => 'Bay Vet Center',
            'notes' => 'Surgery completed successfully.',
        ]);

    $response->assertRedirect(route('admin.appointments.index'));

    $this->assertDatabaseHas('appointments', [
        'id' => $appointment->id,
        'appointment_type' => 'surgery',
        'status' => 'completed',
        'appointment_date' => '2026-06-16 11:30:00',
        'doctor_name' => 'Dr. Lisa',
        'clinic_name' => 'Bay Vet Center',
        'notes' => 'Surgery completed successfully.',
    ]);
});

test('authenticated admin can delete an appointment record', function () {
    $appointment = Appointment::create([
        'pet_id' => $this->pet->id,
        'appointment_type' => 'grooming',
        'status' => 'scheduled',
        'appointment_date' => '2026-06-15 10:00:00',
    ]);

    $response = $this->actingAs($this->admin, 'admin')
        ->delete(route('admin.appointments.destroy', $appointment->id));

    $response->assertRedirect(route('admin.appointments.index'));
    $this->assertDatabaseMissing('appointments', ['id' => $appointment->id]);
});
