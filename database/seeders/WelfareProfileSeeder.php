<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\State;
use App\Models\User;
use App\Models\WelfareProfile;
use Illuminate\Database\Seeder;

class WelfareProfileSeeder extends Seeder
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

        $organizations = [
            [
                'name' => 'Paws of Hope Foundation',
                'description' => 'Dedicated to rescuing abandoned and stray dogs across urban India. Runs a 24/7 helpline and mobile rescue units.',
                'phone' => '+91 9876543201',
                'email' => 'info@pawsofhope.org',
                'website' => 'https://www.pawsofhope.org',
                'address' => '14, Green Park Colony, Near Bus Stand',
            ],
            [
                'name' => 'Street Dogs India Trust',
                'description' => 'Non-profit focused on sterilization drives, vaccination camps, and community awareness programs for stray welfare.',
                'phone' => '+91 9876543202',
                'email' => 'help@streetdogsindia.org',
                'website' => 'https://www.streetdogsindia.org',
                'address' => 'Plot 7, Sector 22, Industrial Area',
            ],
            [
                'name' => 'Happy Tails Rescue Center',
                'description' => 'Shelter and rehabilitation center for injured, abused, and abandoned dogs. Facilitates adoption drives monthly.',
                'phone' => '+91 9876543203',
                'email' => 'adopt@happytails.in',
                'website' => null,
                'address' => 'Farm No. 3, Outer Ring Road',
            ],
            [
                'name' => 'Canine Welfare Society',
                'description' => 'Government-registered animal welfare body providing free medical treatment and emergency rescue services.',
                'phone' => '+91 9876543204',
                'email' => 'contact@caninewelfare.org',
                'website' => 'https://www.caninewelfare.org',
                'address' => '56, Civil Lines, Main Road',
            ],
            [
                'name' => 'Furry Angels NGO',
                'description' => 'Volunteer-driven organization running foster programs, feeding drives, and awareness campaigns in schools and colleges.',
                'phone' => '+91 9876543205',
                'email' => null,
                'website' => null,
                'address' => 'House 12, Gandhi Nagar Extension',
            ],
        ];

        $welfareEmails = [
            'test@example.com',
            'multi2@example.com',
            'multi3@example.com',
            'welfare@example.com',
        ];

        foreach ($organizations as $index => $data) {
            $state = $states->random();
            $city = $state->cities()->inRandomOrder()->first() ?? City::inRandomOrder()->first();
            if (! $city) {
                continue;
            }

            $email = $welfareEmails[$index % count($welfareEmails)];
            $user = User::where('email', $email)->first();
            if (! $user) {
                continue;
            }

            // Sync the welfare role (ID 7)
            $user->roles()->syncWithoutDetaching([7]);

            WelfareProfile::updateOrCreate(
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
