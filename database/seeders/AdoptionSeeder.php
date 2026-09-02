<?php

namespace Database\Seeders;

use App\Models\Adoption;
use App\Models\Breed;
use App\Models\City;
use App\Models\State;
use App\Models\User;
use App\Models\WelfareProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdoptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $breeds = Breed::all();
        $states = State::all();

        $welfareUsers = User::where('role_id', 7)
            ->orWhereHas('roles', function ($q) {
                $q->where('slug', 'welfare');
            })->get();

        if ($breeds->isEmpty() || $states->isEmpty() || $welfareUsers->isEmpty()) {
            $this->command->error('Missing dependencies (Breeds, States, or Welfare Users). Run other seeders first.');

            return;
        }

        $titles = [
            'Friendly Stray Dog Looking for a Home',
            'Rescued Puppy Eager to Join a Family',
            'Loving Senior Dog Seeking Quiet House',
            'Playful Young Dog Ready for Adoption',
            'Sweet Abandoned Dog Needs Second Chance',
            'Calm and Loyal Companion for Adoption',
            'Energetic Rescued Dog for Active Family',
            'Gentle Soul Rescued from Street Life',
        ];

        Storage::disk('public')->makeDirectory('adoptions');

        $dogImages = [
            'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1537151608828-ea2b117b62e4?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=600&q=80',
        ];

        foreach (range(1, 12) as $index) {
            $user = $welfareUsers->random();
            $state = $states->random();
            $city = $state->cities()->inRandomOrder()->first() ?? City::inRandomOrder()->first();
            $breed = $breeds->random();
            $title = $titles[($index - 1) % count($titles)].' #'.$index;

            $profile = WelfareProfile::where('user_id', $user->id)->first();

            $featuredImagePath = $dogImages[($index - 1) % count($dogImages)];

            Adoption::updateOrCreate(
                ['slug' => Str::slug($title)],
                [
                    'user_id' => $user->id,
                    'profile_id' => $profile ? $profile->id : null,
                    'profile_type' => $profile ? WelfareProfile::class : null,
                    'breed_id' => $breed->id,
                    'gender' => rand(0, 1) ? 'Male' : 'Female',
                    'title' => $title,
                    'slug' => Str::slug($title),
                    'description' => 'This wonderful companion was rescued and is lovingly nurtured, looking for a forever home. Extremely friendly, vaccinated, and well-socialized.',
                    'price' => rand(0, 1) ? 0.00 : rand(500, 2500),
                    'age' => rand(1, 7).' Years',
                    'is_champion' => false,
                    'awards_count' => 0,
                    'state_id' => $state->id,
                    'city_id' => $city->id,
                    'status' => 'Available',
                    'is_negotiable' => (bool) rand(0, 1),
                    'is_vaccinated' => true,
                    'is_available' => true,
                    'is_approved' => true,
                    'featured_image_path' => $featuredImagePath,
                    'is_featured' => (bool) rand(0, 1),
                    'featured_until' => rand(0, 1) ? now()->addDays(30) : null,
                ]
            );
        }

        $this->command->info('12 Welfare adoption postings seeded successfully!');
    }
}
