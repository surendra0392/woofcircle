<?php

namespace Database\Factories;

use App\Models\Pet;
use App\Models\Vaccination;
use Illuminate\Database\Eloquent\Factories\Factory;

class VaccinationFactory extends Factory
{
    protected $model = Vaccination::class;

    public function definition(): array
    {
        return [
            'pet_id' => Pet::factory(),
            'vaccine_name' => $this->faker->word(),
            'vaccination_date' => $this->faker->date(),
            'next_due_date' => $this->faker->dateTimeBetween('now', '+1 year')->format('Y-m-d'),
        ];
    }
}
