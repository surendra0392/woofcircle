<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\PetShopProfile;
use App\Models\State;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PetShopSeeder extends Seeder
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

        $shops = [
            [
                'name' => 'Royal Pet Emporium',
                'description' => '<p>Welcome to <strong>Royal Pet Emporium</strong>, your one-stop destination for premium pet supplies. We specialize in high-quality nutrition, luxury accessories, and professional grooming tools.</p><ul><li>Premium Grain-Free Foods</li><li>Orthopedic Pet Beds</li><li>Interactive Smart Toys</li></ul><p>Visit us today for a personalized shopping experience!</p>',
                'phone' => '9876543210',
                'email' => 'hello@royalpet.com',
                'website' => 'https://royalpetemporium.com',
                'address' => 'Shop No. 45, Crystal Plaza, Main Road',
            ],
            [
                'name' => 'The Barkery & Co',
                'description' => '<p>At <strong>The Barkery & Co</strong>, we believe every pet deserves the best. We offer organic treats, eco-friendly toys, and a wide range of designer collars and leashes.</p><p>Our mission is to provide sustainable products that keep your pets happy and healthy.</p>',
                'phone' => '9123456789',
                'email' => 'info@thebarkery.co',
                'website' => 'https://thebarkery.co',
                'address' => '12/B Heritage Lane, Near Central Park',
            ],
            [
                'name' => 'Aquatic Wonders',
                'description' => '<p>Dive into the world of <strong>Aquatic Wonders</strong>. We are experts in freshwater and marine aquariums, exotic fish, and premium aquatic plants.</p><ul><li>Custom Aquarium Setup</li><li>Rare Marine Species</li><li>Advanced Filtration Systems</li></ul>',
                'phone' => '9988776655',
                'email' => 'sales@aquaticwonders.in',
                'website' => 'https://aquaticwonders.in',
                'address' => 'Lower Ground, Marina Mall',
            ],
            [
                'name' => 'Pawsome Supplies',
                'description' => '<p><strong>Pawsome Supplies</strong> is dedicated to bringing you the best deals on global pet brands. From Royal Canin to Kong, we have it all at unbeatable prices.</p><p>Check out our monthly subscription boxes for exclusive surprises!</p>',
                'phone' => '8877665544',
                'email' => 'contact@pawsome.in',
                'website' => null,
                'address' => 'Plot 78, Industrial Estate Phase II',
            ],
            [
                'name' => 'Feline Fancy Boutique',
                'description' => '<p>A specialized boutique for our feline friends. <strong>Feline Fancy</strong> offers premium cat furniture, high-protein wet foods, and modern litter solutions.</p><p>Because cats deserve a little luxury too.</p>',
                'phone' => '7766554433',
                'email' => 'meow@felinefancy.com',
                'website' => 'https://felinefancy.com',
                'address' => 'First Floor, Uptown Square',
            ],
        ];

        $petShopEmails = [
            'test@example.com',
            'multi1@example.com',
            'multi2@example.com',
            'multi3@example.com',
            'petshop@example.com',
        ];

        foreach ($shops as $index => $shop) {
            $state = $states->random();
            $city = $state->cities()->inRandomOrder()->first() ?? City::inRandomOrder()->first();
            if (! $city) {
                continue;
            }

            $email = $petShopEmails[$index % count($petShopEmails)];
            $user = User::where('email', $email)->first();
            if (! $user) {
                continue;
            }

            // Sync the pet shop role (ID 3)
            $user->roles()->syncWithoutDetaching([3]);

            PetShopProfile::updateOrCreate(
                ['user_id' => $user->id],
                array_merge($shop, [
                    'slug' => Str::slug($shop['name']).'-'.rand(100, 999),
                    'state_id' => $state->id,
                    'city_id' => $city->id,
                    'is_verified' => true,
                    'is_active' => true,
                ])
            );
        }
    }
}
