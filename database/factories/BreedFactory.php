<?php

namespace Database\Factories;

use App\Models\Breed;
use Illuminate\Database\Eloquent\Factories\Factory;

class BreedFactory extends Factory
{
    protected $model = Breed::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->words(2, true),
            'slug' => $this->faker->slug(),
            'size' => 'medium',
            'life_span' => '10-12 years',
            'male_height' => '50-60 cm',
            'female_height' => '45-55 cm',
            'male_weight' => '20-30 kg',
            'female_weight' => '18-28 kg',
            'breed_group' => 'Working',
            'coat_type' => 'Double',
            'energy_level' => 'high',
        ];
    }
}
