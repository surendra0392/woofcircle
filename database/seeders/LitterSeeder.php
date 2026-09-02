<?php

namespace Database\Seeders;

use App\Models\Breed;
use App\Models\BreederProfile;
use App\Models\City;
use App\Models\Litter;
use App\Models\State;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class LitterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $breeds = Breed::all();
        $states = State::all();

        // Fetch breeders specifically (matching role_id or roles relation)
        $breeders = User::where('role_id', 2)
            ->orWhereHas('roles', function ($q) {
                $q->where('slug', 'breeder');
            })->get();

        if ($breeds->isEmpty() || $states->isEmpty() || $breeders->isEmpty()) {
            $this->command->error('Missing dependencies (Breeds, States, or Breeder Users). Run other seeders first.');

            return;
        }

        $titles = [
            'Adorable Golden Retriever Puppies',
            'Champion Line German Shepherd Litter',
            'Pocket Bully Puppies - KCI Registered',
            'Show Quality Labrador Retriever Puppies',
            'High Quality Rottweiler Puppies',
            'Cute Beagle Puppies for Loving Homes',
            'Majestic Great Dane Puppies',
            'Fluffy Siberian Husky Puppies',
            'Smart Border Collie Puppies',
            'Powerful Doberman Pinscher Puppies',
        ];

        // Ensure target directory exists
        Storage::disk('public')->makeDirectory('litters');

        foreach (range(1, 12) as $index) {
            $user = $breeders->random();
            $state = $states->random();
            $city = $state->cities()->inRandomOrder()->first() ?? City::inRandomOrder()->first();
            $breed = $breeds->random();
            $title = $titles[array_rand($titles)].' '.$index;

            $profile = BreederProfile::where('user_id', $user->id)->first();

            // Dynamic image copy from local mock asset
            $sourceImage = 'litters/1/featured/8to4HEuXnLjasZ72HEODe9hWIq4HPP6htbVnCJQn.jpg';
            $featuredImagePath = null;

            if (! Storage::disk('public')->exists($sourceImage)) {
                try {
                    $imgUrl = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80';
                    $content = @file_get_contents($imgUrl);
                    if ($content !== false) {
                        Storage::disk('public')->makeDirectory(dirname($sourceImage));
                        Storage::disk('public')->put($sourceImage, $content);
                    }
                } catch (\Exception $e) {
                    // Fall back to null if download fails
                }
            }

            if (Storage::disk('public')->exists($sourceImage)) {
                $randomName = Str::random(40).'.jpg';
                $destFolder = 'litters/'.$index.'/featured';
                Storage::disk('public')->makeDirectory($destFolder);
                $targetPath = $destFolder.'/'.$randomName;
                Storage::disk('public')->copy($sourceImage, $targetPath);
                $featuredImagePath = $targetPath;
            }

            Litter::create([
                'user_id' => $user->id,
                'profile_id' => $profile ? $profile->id : null,
                'profile_type' => $profile ? BreederProfile::class : null,
                'breed_id' => $breed->id,
                'title' => $title,
                'slug' => Str::slug($title),
                'description' => 'This is a premium litter of '.$breed->name.' puppies. They are healthy, KCI registered, and raised in a loving environment with top care.',
                'price' => rand(15000, 85000),
                'price_min' => rand(10000, 20000),
                'price_max' => rand(25000, 95000),
                'age' => rand(2, 6).' Months',
                'kci_registered' => (bool) rand(0, 1),
                'sire_name' => 'Champion '.$breed->name.' Sire',
                'dam_name' => 'Elite '.$breed->name.' Dam',
                'state_id' => $state->id,
                'city_id' => $city->id,
                'status' => 'published',
                'is_negotiable' => (bool) rand(0, 1),
                'is_vaccinated' => (bool) rand(0, 1),
                'is_champion' => (bool) rand(0, 1),
                'awards_count' => rand(0, 5),
                'is_available' => true,
                'is_approved' => true,
                'featured_image_path' => $featuredImagePath,
                'is_featured' => (bool) rand(0, 1),
                'featured_until' => rand(0, 1) ? now()->addDays(30) : null,
            ]);
        }

        $this->command->info('12 Breeder puppy litters seeded successfully!');
    }
}
