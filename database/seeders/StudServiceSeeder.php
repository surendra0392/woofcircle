<?php

namespace Database\Seeders;

use App\Models\Breed;
use App\Models\BreederProfile;
use App\Models\City;
use App\Models\State;
use App\Models\StudService;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class StudServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $breeds = Breed::all();
        $states = State::all();
        $users = User::all();

        if ($breeds->isEmpty() || $states->isEmpty() || $users->isEmpty()) {
            $this->command->error('Missing dependencies (Breeds, States, or Users). Run other seeders first.');

            return;
        }

        $titles = [
            'Proven KCI Registered Stud Dog',
            'Champion Line Stud Service Available',
            'Beautiful Show Quality Male for Stud',
            'Healthy and Active Stud Dog Service',
            'Import Line Proven Stud Dog',
            'Stunning Champion Bred Sire for Stud',
        ];

        $dogNames = [
            'Rocky', 'Max', 'Buddy', 'Charlie', 'Buster', 'Duke',
            'Zeus', 'Bruno', 'Rex', 'Oscar', 'Leo', 'Toby',
        ];

        Storage::disk('public')->makeDirectory('stud-services');

        foreach (range(1, 12) as $index) {
            $user = $users->random();
            $state = $states->random();
            $city = $state->cities()->inRandomOrder()->first() ?? City::inRandomOrder()->first();
            $breed = $breeds->random();

            // Link to BreederProfile if the user has one
            $profile = BreederProfile::where('user_id', $user->id)->first();

            $title = $titles[array_rand($titles)].' - '.$breed->name;
            $slug = Str::slug($title).'-'.$index;

            // Dynamic image copy from local mock asset
            $sourceImage = 'breeds/hUWsV8XbCZg7Ab56G42OSQvKykUico4AoQIdRu34.jpg';
            $featuredImagePath = null;

            if (! Storage::disk('public')->exists($sourceImage)) {
                try {
                    $imgUrl = 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80';
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
                $destFolder = 'stud-services/'.$index.'/featured';
                Storage::disk('public')->makeDirectory($destFolder);
                $targetPath = $destFolder.'/'.$randomName;
                Storage::disk('public')->copy($sourceImage, $targetPath);
                $featuredImagePath = $targetPath;
            }

            StudService::create([
                'user_id' => $user->id,
                'profile_id' => $profile ? $profile->id : null,
                'profile_type' => $profile ? BreederProfile::class : null,
                'breed_id' => $breed->id,
                'stud_dog_name' => $dogNames[$index - 1] ?? 'Dog '.$index,
                'title' => $title,
                'slug' => $slug,
                'description' => 'Excellent stud dog service with a healthy, active, and fully vaccinated male. The dog is KCI registered, possesses great temperament, and has a proven track record of healthy litters.',
                'price' => rand(5000, 25000),
                'age' => rand(2, 6).' Years',
                'is_champion' => (bool) rand(0, 1),
                'awards_count' => rand(0, 4),
                'kci_registered' => (bool) rand(0, 1),
                'sire_name' => 'Champion '.$breed->name.' Sire',
                'dam_name' => 'Elite '.$breed->name.' Dam',
                'state_id' => $state->id,
                'city_id' => $city->id,
                'status' => 'Active',
                'is_negotiable' => (bool) rand(0, 1),
                'is_vaccinated' => true,
                'is_available' => true,
                'is_approved' => true,
                'featured_image_path' => $featuredImagePath,
                'is_featured' => (bool) rand(0, 1),
                'featured_position' => $index,
                'featured_until' => rand(0, 1) ? now()->addDays(30) : null,
            ]);
        }

        $this->command->info('12 Stud services seeded successfully!');
    }
}
