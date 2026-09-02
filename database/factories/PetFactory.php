<?php

namespace Database\Factories;

use App\Models\Breed;
use App\Models\Pet;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PetFactory extends Factory
{
    protected $model = Pet::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'breed_id' => Breed::factory(),
            'name' => $this->faker->firstName(),
            'gender' => $this->faker->randomElement(['male', 'female']),
            'date_of_birth' => $this->faker->date(),
            'color' => $this->faker->colorName(),
        ];
    }
}
