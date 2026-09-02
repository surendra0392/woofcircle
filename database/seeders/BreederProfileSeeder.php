<?php

namespace Database\Seeders;

use App\Models\BreederProfile;
use App\Models\City;
use App\Models\State;
use App\Models\User;
use Illuminate\Database\Seeder;

class BreederProfileSeeder extends Seeder
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

        $kennelNames = [
            'Golden Valley Kennels',
            'Blue Ribbon Breeders',
            'Summit K9 Club',
            'Lakeside Labradors',
            'Emerald City Shepherds',
        ];

        $breederEmails = [
            'test@example.com',
            'multi1@example.com',
            'multi2@example.com',
            'breeder@example.com',
        ];

        foreach ($breederEmails as $index => $email) {
            $user = User::where('email', $email)->first();
            if (! $user) {
                continue;
            }

            $name = $kennelNames[$index % count($kennelNames)];

            $state = $states->random();
            $city = $state->cities()->inRandomOrder()->first() ?? City::inRandomOrder()->first();

            if (! $city) {
                continue;
            }

            BreederProfile::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'name' => $name,
                    'description' => "Welcome to {$name}. We have been breeding high-quality dogs for over 10 years, focusing on health, temperament, and beauty. Our facility is state-of-the-art and our dogs are part of our family.",
                    'phone' => '+1 (555) '.rand(100, 999).'-'.rand(1000, 9999),
                    'email' => $email,
                    'state_id' => $state->id,
                    'city_id' => $city->id,
                    'address' => rand(100, 999).' Main Street, '.$city->name,
                    'is_verified' => (bool) rand(0, 1),
                    'is_active' => true,
                ]
            );
        }
    }
}
