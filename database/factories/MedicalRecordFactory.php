<?php

namespace Database\Factories;

use App\Models\MedicalRecord;
use App\Models\Pet;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MedicalRecord>
 */
class MedicalRecordFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'pet_id' => Pet::factory(),
            'record_type' => $this->faker->randomElement(['injury', 'surgery', 'illness', 'allergy', 'treatment', 'general']),
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph,
            'diagnosis_date' => $this->faker->date(),
            'doctor_name' => $this->faker->name,
            'clinic_name' => $this->faker->company.' Veterinary Clinic',
            'prescription' => $this->faker->text(100),
            'notes' => $this->faker->text(200),
        ];
    }
}
