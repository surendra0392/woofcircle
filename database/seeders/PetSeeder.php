<?php

namespace Database\Seeders;

use App\Models\Breed;
use App\Models\Pet;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $breeds = Breed::all();

        $standardUsers = User::where('role_id', 1)
            ->orWhereHas('roles', function ($q) {
                $q->where('slug', 'user');
            })->get();

        if ($breeds->isEmpty() || $standardUsers->isEmpty()) {
            $this->command->error('Missing dependencies (Breeds or Standard Users). Run other seeders first.');

            return;
        }

        $names = [
            'Bella', 'Lucy', 'Daisy', 'Lola', 'Luna', 'Stella',
            'Cooper', 'Milo', 'Bentley', 'Teddy', 'Bear', 'Oliver',
        ];

        $colors = ['Golden', 'Black', 'White', 'Brown', 'Fawn', 'Bicolor'];

        Storage::disk('public')->makeDirectory('pets/profile');

        foreach (range(1, 12) as $index) {
            $user = $standardUsers->random();
            $breed = $breeds->random();
            $name = $names[$index - 1] ?? 'Pet '.$index;

            // Dynamic image copy from local mock asset
            $sourceImage = 'gallery/TuwI4ftkZUsVtDtB3Nge6xoe1theIIcOw8hWiu7V.jpg';
            $profileImagePath = null;

            if (! Storage::disk('public')->exists($sourceImage)) {
                try {
                    $imgUrl = 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80';
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
                $destFolder = 'pets/profile';
                Storage::disk('public')->makeDirectory($destFolder);
                $targetPath = $destFolder.'/'.$randomName;
                Storage::disk('public')->copy($sourceImage, $targetPath);
                $profileImagePath = $targetPath;
            }

            Pet::create([
                'user_id' => $user->id,
                'breed_id' => $breed->id,
                'name' => $name,
                'gender' => rand(0, 1) ? 'Male' : 'Female',
                'date_of_birth' => now()->subMonths(rand(3, 60))->toDateString(),
                'color' => $colors[array_rand($colors)],
                'microchip_number' => '900115000'.rand(100000, 999999),
                'profile_image_path' => $profileImagePath,
                'is_champion' => (bool) rand(0, 1),
                'awards_count' => rand(0, 3),
                'notes' => 'A very friendly pet. Loyal, obedient, and loves to play fetch.',
            ]);
        }

        $this->command->info('12 Pets seeded successfully!');
    }
}
