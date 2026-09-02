<?php

namespace Tests\Feature;

use App\Models\Breed;
use App\Models\MedicalRecord;
use App\Models\Pet;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MedicalRecordTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Ensure we have a breed for pet creation
        Breed::factory()->create();
    }

    public function test_user_can_view_medical_records_for_their_pet()
    {
        $user = User::factory()->create();
        $pet = Pet::factory()->create(['user_id' => $user->id]);
        $record = MedicalRecord::factory()->create(['pet_id' => $pet->id]);

        $response = $this->actingAs($user)->get(route('pets.medical-records.index', $pet->id));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('dashboard/pets/medical-records/index')
            ->has('records', 1)
        );
    }

    public function test_user_cannot_view_medical_records_for_other_users_pet()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $pet = Pet::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($user)->get(route('pets.medical-records.index', $pet->id));

        $response->assertStatus(403);
    }

    public function test_user_can_add_medical_record_to_their_pet()
    {
        $user = User::factory()->create();
        $pet = Pet::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->post(route('pets.medical-records.store', $pet->id), [
            'record_type' => 'surgery',
            'title' => 'Appendectomy',
            'description' => 'Standard procedure',
            'diagnosis_date' => '2026-05-01',
        ]);

        $response->assertStatus(302);
        $this->assertDatabaseHas('medical_records', [
            'pet_id' => $pet->id,
            'title' => 'Appendectomy',
            'record_type' => 'surgery',
        ]);
    }

    public function test_user_can_update_medical_record_of_their_pet()
    {
        $user = User::factory()->create();
        $pet = Pet::factory()->create(['user_id' => $user->id]);
        $record = MedicalRecord::factory()->create(['pet_id' => $pet->id]);

        $response = $this->actingAs($user)->post(route('pets.medical-records.update', [$pet->id, $record->id]), [
            'record_type' => 'illness',
            'title' => 'Updated Title',
            'diagnosis_date' => '2026-05-02',
        ]);

        $response->assertStatus(302);
        $this->assertDatabaseHas('medical_records', [
            'id' => $record->id,
            'title' => 'Updated Title',
            'record_type' => 'illness',
        ]);
    }

    public function test_user_can_delete_medical_record_of_their_pet()
    {
        $user = User::factory()->create();
        $pet = Pet::factory()->create(['user_id' => $user->id]);
        $record = MedicalRecord::factory()->create(['pet_id' => $pet->id]);

        $response = $this->actingAs($user)->delete(route('pets.medical-records.destroy', [$pet->id, $record->id]));

        $response->assertStatus(302);
        $this->assertDatabaseMissing('medical_records', ['id' => $record->id]);
    }
}
