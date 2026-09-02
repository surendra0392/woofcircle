<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\State;
use App\Models\User;
use App\Models\VetProfile;
use Illuminate\Database\Seeder;

class VetProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $states = State::all();
        if ($states->isEmpty()) {
            return;
        }

        $vets = [
            [
                'name' => 'City Pet Hospital',
                'description' => 'Comprehensive veterinary care including surgery and emergency services.',
                'phone' => '+1 555-0101',
                'experience_years' => 15,
                'address' => '123 Medical Plaza',
            ],
            [
                'name' => 'Healthy Paws Clinic',
                'description' => 'Specialized in preventative care and vaccinations for all domestic animals.',
                'phone' => '+1 555-0202',
                'experience_years' => 8,
                'address' => '456 Wellness Way',
            ],
            [
                'name' => 'Advanced Vet Specialists',
                'description' => 'Leading experts in orthopedic surgery and advanced diagnostic imaging.',
                'phone' => '+1 555-0303',
                'experience_years' => 20,
                'address' => '789 Specialist Drive',
            ],
            [
                'name' => 'Green Valley Animal Care',
                'description' => 'Friendly neighborhood vet providing holistic and traditional treatments.',
                'phone' => '+1 555-0404',
                'experience_years' => 12,
                'address' => '321 Nature Lane',
            ],
            [
                'name' => 'Emergency Pet Center 24/7',
                'description' => 'Open round the clock for all critical pet emergencies and intensive care.',
                'phone' => '+1 555-0505',
                'experience_years' => 25,
                'address' => '101 Urgent Ave',
            ],
        ];

        $vetEmails = [
            'test@example.com',
            'multi1@example.com',
            'multi3@example.com',
            'vet@example.com',
        ];
        foreach ($vets as $index => $vet) {
            $state = $states->random();
            $city = $state->cities()->inRandomOrder()->first() ?? City::inRandomOrder()->first();
            if (! $city) {
                continue;
            }

            $email = $vetEmails[$index % count($vetEmails)];
            $user = User::where('email', $email)->first();
            if (! $user) {
                continue;
            }

            // Sync the vet role (ID 4)
            $user->roles()->syncWithoutDetaching([4]);

            VetProfile::updateOrCreate(
                ['user_id' => $user->id],
                array_merge($vet, [
                    'email' => $email,
                    'state_id' => $state->id,
                    'city_id' => $city->id,
                    'is_verified' => true,
                    'is_active' => true,
                ])
            );
        }
    }
}
