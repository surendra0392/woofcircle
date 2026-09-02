<?php

use App\Models\Admin;
use App\Models\Breed;
use App\Models\MedicalRecord;
use App\Models\Pet;
use App\Models\User;

beforeEach(function () {
    // Create admin user
    $this->admin = Admin::create([
        'name' => 'Super Admin',
        'email' => 'admin-record-test@example.com',
        'password' => bcrypt('password'),
        'role' => 'superadmin',
        'is_active' => true,
    ]);

    // Ensure we have a breed for pet creation
    $this->breed = Breed::factory()->create([
        'name' => 'Golden Retriever',
    ]);

    // Create a regular user for ownership
    $this->user = User::factory()->create();

    // Create a pet
    $this->pet = Pet::factory()->create([
        'name' => 'Max',
        'breed_id' => $this->breed->id,
        'user_id' => $this->user->id,
    ]);
});

test('guests are redirected to the admin login page from medical record routes', function () {
    $this->get(route('admin.medical-records.index'))->assertRedirect(route('admin.login'));
    $this->get(route('admin.medical-records.create'))->assertRedirect(route('admin.login'));
});

test('authenticated admin can view medical records index', function () {
    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.medical-records.index'))
        ->assertOk();
});

test('authenticated admin can view medical records create page', function () {
    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.medical-records.create'))
        ->assertOk();
});

test('authenticated admin can store a new medical record', function () {
    $response = $this->actingAs($this->admin, 'admin')
        ->post(route('admin.medical-records.store'), [
            'pet_id' => $this->pet->id,
            'record_type' => 'surgery',
            'title' => 'Fracture Surgery',
            'diagnosis_date' => '2026-05-01',
            'doctor_name' => 'Dr. House',
            'clinic_name' => 'Central Vet Clinic',
            'description' => 'Left leg tibia fracture repair.',
            'prescription' => 'Painkillers for 5 days.',
            'notes' => 'Stitches removal in 10 days.',
        ]);

    $response->assertRedirect(route('admin.medical-records.index'));

    $this->assertDatabaseHas('medical_records', [
        'pet_id' => $this->pet->id,
        'record_type' => 'surgery',
        'title' => 'Fracture Surgery',
        'diagnosis_date' => '2026-05-01 00:00:00',
        'doctor_name' => 'Dr. House',
        'clinic_name' => 'Central Vet Clinic',
        'description' => 'Left leg tibia fracture repair.',
        'prescription' => 'Painkillers for 5 days.',
        'notes' => 'Stitches removal in 10 days.',
    ]);
});

test('authenticated admin can view medical record edit page', function () {
    $record = MedicalRecord::factory()->create([
        'pet_id' => $this->pet->id,
        'record_type' => 'illness',
        'title' => 'Fever',
    ]);

    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.medical-records.edit', $record->id))
        ->assertOk();
});

test('authenticated admin can update a medical record', function () {
    $record = MedicalRecord::factory()->create([
        'pet_id' => $this->pet->id,
        'record_type' => 'illness',
        'title' => 'Fever',
        'diagnosis_date' => '2026-05-01',
    ]);

    $response = $this->actingAs($this->admin, 'admin')
        ->post(route('admin.medical-records.update', $record->id), [
            'pet_id' => $this->pet->id,
            'record_type' => 'treatment',
            'title' => 'Updated Fever Treatment',
            'diagnosis_date' => '2026-05-02',
            'doctor_name' => 'Dr. Wilson',
            'clinic_name' => 'St. Jude Hospital',
            'description' => 'Recovered well.',
            'prescription' => 'None.',
            'notes' => 'No follow-up needed.',
        ]);

    $response->assertRedirect(route('admin.medical-records.index'));

    $this->assertDatabaseHas('medical_records', [
        'id' => $record->id,
        'record_type' => 'treatment',
        'title' => 'Updated Fever Treatment',
        'diagnosis_date' => '2026-05-02 00:00:00',
        'doctor_name' => 'Dr. Wilson',
        'clinic_name' => 'St. Jude Hospital',
        'description' => 'Recovered well.',
        'prescription' => 'None.',
        'notes' => 'No follow-up needed.',
    ]);
});

test('authenticated admin can delete a medical record', function () {
    $record = MedicalRecord::factory()->create([
        'pet_id' => $this->pet->id,
        'title' => 'Allergy check',
    ]);

    $response = $this->actingAs($this->admin, 'admin')
        ->delete(route('admin.medical-records.destroy', $record->id));

    $response->assertRedirect(route('admin.medical-records.index'));
    $this->assertDatabaseMissing('medical_records', ['id' => $record->id]);
});
