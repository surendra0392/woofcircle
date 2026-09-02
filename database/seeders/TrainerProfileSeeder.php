<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\State;
use App\Models\TrainerProfile;
use App\Models\User;
use Illuminate\Database\Seeder;

class TrainerProfileSeeder extends Seeder
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

        $trainers = [
            [
                'name' => 'Elite K9 Academy',
                'description' => 'Specializing in advanced obedience and protection training.',
                'phone' => '+91 9876543210',
                'email' => 'elitek9@example.com',
                'specialization' => 'Advanced Obedience',
                'experience_years' => 15,
                'address' => '123 Training Grounds, North Sector',
            ],
            [
                'name' => 'Puppy Love School',
                'description' => 'Giving your puppy the best start in life through positive reinforcement.',
                'phone' => '+91 9876543211',
                'email' => 'puppylove@example.com',
                'specialization' => 'Puppy Socialization',
                'experience_years' => 5,
                'address' => '45 Green Park, East Wing',
            ],
            [
                'name' => 'Behavior Expert - Sarah',
                'description' => 'Expert in rehabilitating dogs with severe aggression and anxiety issues.',
                'phone' => '+91 9876543212',
                'email' => 'sarah.trains@example.com',
                'specialization' => 'Aggression Rehabilitation',
                'experience_years' => 12,
                'address' => '78 Quiet Lane, West Side',
            ],
            [
                'name' => 'Urban Dog Solutions',
                'description' => 'Training for the modern city dog. Leash manners and public focus.',
                'phone' => '+91 9876543213',
                'email' => 'urban.dog@example.com',
                'specialization' => 'City Manners',
                'experience_years' => 8,
                'address' => '10 Metro Plaza, Central District',
            ],
            [
                'name' => 'Agility Pros',
                'description' => 'Sport and agility training for active dogs and owners.',
                'phone' => '+91 9876543214',
                'email' => 'agility@example.com',
                'specialization' => 'Agility & Sport',
                'experience_years' => 10,
                'address' => '22 Field View, Sports Hub',
            ],
        ];

        $trainerEmails = [
            'test@example.com',
            'multi1@example.com',
            'multi2@example.com',
            'multi3@example.com',
            'trainer@example.com',
        ];

        foreach ($trainers as $index => $trainerData) {
            $state = $states->random();
            $city = $state->cities()->inRandomOrder()->first() ?? City::inRandomOrder()->first();
            if (! $city) {
                continue;
            }

            $email = $trainerEmails[$index % count($trainerEmails)];
            $user = User::where('email', $email)->first();
            if (! $user) {
                continue;
            }

            // Sync the trainer role (ID 5)
            $user->roles()->syncWithoutDetaching([5]);

            unset($trainerData['specialization']);

            TrainerProfile::updateOrCreate(
                ['user_id' => $user->id],
                array_merge($trainerData, [
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
