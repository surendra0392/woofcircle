<?php

namespace Database\Seeders;

use App\Models\TrainerSpecialization;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TrainerSpecializationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $specializations = [
            [
                'name' => 'Obedience Training',
                'description' => 'Teaching fundamental commands and social manners.',
            ],
            [
                'name' => 'Puppy Training',
                'description' => 'Early socialization and house training for young dogs.',
            ],
            [
                'name' => 'Aggression Management',
                'description' => 'Behavior modification for reactive or aggressive dogs.',
            ],
            [
                'name' => 'Agility Training',
                'description' => 'Sport and obstacle course training for active dogs.',
            ],
            [
                'name' => 'Guard Dog Training',
                'description' => 'Specialized protection and alert training.',
            ],
            [
                'name' => 'Service Dog Training',
                'description' => 'Preparing dogs for assistance and support roles.',
            ],
            [
                'name' => 'Search & Rescue',
                'description' => 'Tracking and locating scents in diverse environments.',
            ],
            [
                'name' => 'Trick Training',
                'description' => 'Fun and engaging mental stimulation through tricks.',
            ],
            [
                'name' => 'Behavioral Therapy',
                'description' => 'Rehabilitating dogs with anxiety or trauma.',
            ],
            [
                'name' => 'Show Dog Handling',
                'description' => 'Preparing dogs for professional conformation shows.',
            ],
        ];

        foreach ($specializations as $spec) {
            TrainerSpecialization::updateOrCreate(
                ['slug' => Str::slug($spec['name'])],
                [
                    'name' => $spec['name'],
                    'description' => $spec['description'],
                    'is_active' => true,
                ]
            );
        }
    }
}
