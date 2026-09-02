<?php

namespace Database\Seeders;

use App\Models\BoardingProfile;
use App\Models\City;
use App\Models\State;
use App\Models\User;
use Illuminate\Database\Seeder;

class BoardingProfileSeeder extends Seeder
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

        $facilities = [
            [
                'name' => 'Royal Canine Resort',
                'description' => 'Luxury boarding with climate-controlled suites and 24/7 supervision.',
                'phone' => '+91 9998887771',
                'email' => 'royal@boarding.com',
                'service_type' => 'boarding',
                'price_per_day' => 1500.00,
                'capacity' => 20,
                'address' => 'Suite 101, High Ridge Road',
            ],
            [
                'name' => 'City Paws Daycare',
                'description' => 'Perfect for the urban dog. Daily play sessions and basic training.',
                'phone' => '+91 9998887772',
                'email' => 'citypaws@daycare.com',
                'service_type' => 'daycare',
                'price_per_day' => 800.00,
                'capacity' => 40,
                'address' => 'Ground Floor, Metro Plaza',
            ],
            [
                'name' => 'The Pet Hotel & Spa',
                'description' => 'Full service accommodation including grooming and wellness checks.',
                'phone' => '+91 9998887773',
                'email' => 'pethotel@service.com',
                'service_type' => 'both',
                'price_per_day' => 2500.00,
                'capacity' => 15,
                'address' => 'Green Valley, West Sector',
            ],
            [
                'name' => 'Budget Boarding',
                'description' => 'Simple, clean, and affordable care for your furry friends.',
                'phone' => '+91 9998887774',
                'email' => 'budget@care.com',
                'service_type' => 'boarding',
                'price_per_day' => 600.00,
                'capacity' => 50,
                'address' => '12 Old Road, Industrial Estate',
            ],
            [
                'name' => 'Sunshine Daycare',
                'description' => 'Outdoor play areas and socialization experts.',
                'phone' => '+91 9998887775',
                'email' => 'sunshine@daycare.com',
                'service_type' => 'daycare',
                'price_per_day' => 500.00,
                'capacity' => 30,
                'address' => 'Farm House 5, North Outskirts',
            ],
        ];

        $boardingEmails = [
            'test@example.com',
            'multi1@example.com',
            'multi2@example.com',
            'multi3@example.com',
            'boarding@example.com',
        ];

        foreach ($facilities as $index => $data) {
            $state = $states->random();
            $city = $state->cities()->inRandomOrder()->first() ?? City::inRandomOrder()->first();
            if (! $city) {
                continue;
            }

            $email = $boardingEmails[$index % count($boardingEmails)];
            $user = User::where('email', $email)->first();
            if (! $user) {
                continue;
            }

            // Sync the boarding role (ID 6)
            $user->roles()->syncWithoutDetaching([6]);

            BoardingProfile::updateOrCreate(
                ['user_id' => $user->id],
                array_merge($data, [
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
