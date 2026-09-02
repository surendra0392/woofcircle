<?php

namespace Database\Seeders;

use App\Models\Breed;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class BreedDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $breedsData = [];
        $loadedSuccessfully = false;
        $localPath = database_path('data/dog_breeds.json');

        if (file_exists($localPath)) {
            try {
                $this->command->info('Loading dog breeds data from local JSON file...');
                $jsonData = file_get_contents($localPath);
                $breedsData = json_decode($jsonData, true);
                if (is_array($breedsData) && ! empty($breedsData)) {
                    $loadedSuccessfully = true;
                    $this->command->info('Successfully loaded dog breeds data from local JSON file.');
                }
            } catch (\Exception $e) {
                $this->command->warn('Failed to parse local breeds JSON: '.$e->getMessage());
            }
        }

        if (! $loadedSuccessfully) {
            $this->command->info('Fetching Dog Breeds data from external dataset...');
            try {
                // Using an open static JSON dump of The Dog API to prevent 403 API Key errors
                $response = Http::timeout(30)->get('https://raw.githubusercontent.com/DevTides/DogsApi/master/dogs.json');

                if ($response->successful()) {
                    $breedsData = $response->json();
                    if (is_array($breedsData) && ! empty($breedsData)) {
                        $loadedSuccessfully = true;
                    }
                } else {
                    $this->command->error('Failed to fetch data. Status: '.$response->status());
                }
            } catch (\Exception $e) {
                $this->command->error('Failed to fetch dog breeds from network: '.$e->getMessage());
            }
        }

        if (! $loadedSuccessfully || empty($breedsData)) {
            $this->command->error('Invalid or empty dataset received. Seeding aborted.');

            return;
        }

        $this->command->info('Processing '.count($breedsData).' breeds...');

        DB::transaction(function () use ($breedsData) {
            $bar = $this->command->getOutput()->createProgressBar(count($breedsData));
            $bar->start();

            foreach ($breedsData as $breed) {
                // Extract and normalize data
                $name = $breed['name'] ?? null;
                if (! $name) {
                    continue;
                }

                $temperament = $breed['temperament'] ?? null;
                $origin = $breed['origin'] ?? null;
                $lifeSpan = $breed['life_span'] ?? null;
                $breedGroup = $breed['breed_group'] ?? null;
                $bredFor = $breed['bred_for'] ?? null;
                $imageUrl = $breed['url'] ?? null;

                // Handle metrics
                $weightMetric = $breed['weight']['metric'] ?? null;
                $heightMetric = $breed['height']['metric'] ?? null;

                // Determine Size
                $size = 'medium'; // default
                if ($weightMetric) {
                    $weights = explode('-', $weightMetric);
                    $avgWeight = 0;
                    if (count($weights) == 2) {
                        $avgWeight = ((int) trim($weights[0]) + (int) trim($weights[1])) / 2;
                    } else {
                        $avgWeight = (int) trim($weights[0]);
                    }

                    if ($avgWeight < 10) {
                        $size = 'small';
                    } elseif ($avgWeight > 25) {
                        $size = 'large';
                    }
                }

                // Descriptions
                $descTemperament = $temperament ? strtolower($temperament) : 'its unique characteristics';
                $descUse = $bredFor ? strtolower($bredFor) : 'various activities';
                $description = "{$name} is a dog breed known for {$descTemperament}. It is commonly used for {$descUse}.";

                // We use the image URL directly. If needed locally, we could download it here.
                // For performance, we'll store the URL as the user requested: "Store breed image URL if available"

                Breed::updateOrCreate(
                    [
                        'slug' => Str::slug($name),
                    ],
                    [
                        'name' => $name,
                        'description' => $description,
                        'history' => null,
                        'other_names' => $bredFor,
                        'naming' => "Commonly referred to as {$name}",
                        'variants' => null,
                        'appearance' => "Average height of {$heightMetric} cm and weight of {$weightMetric} kg.",
                        'health' => null,
                        'temperament' => $temperament,
                        'behavior' => $temperament,
                        'intelligence' => 'Standard canine intelligence expected for a '.($breedGroup ?? 'dog').' group.',
                        'use' => $bredFor,
                        'origin' => $origin,
                        'life_span' => $lifeSpan,
                        'male_height' => $heightMetric ? "{$heightMetric} cm" : null,
                        'female_height' => $heightMetric ? "{$heightMetric} cm" : null,
                        'male_weight' => $weightMetric ? "{$weightMetric} kg" : null,
                        'female_weight' => $weightMetric ? "{$weightMetric} kg" : null,
                        'size' => $size,
                        'breed_group' => $breedGroup,
                        'coat_type' => null,
                        'colors' => null,
                        'energy_level' => null,
                        'is_indian' => false,
                        'image' => $imageUrl,
                        'is_active' => true,
                    ]
                );

                $bar->advance();
            }

            $bar->finish();
            $this->command->newLine();
            $this->command->info('Breed seeding completed successfully.');
        });
    }
}
