<?php

namespace Database\Seeders;

use App\Models\State;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class IndiaLocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $states = [];
        $fetchedSuccessfully = false;
        $localPath = database_path('data/india_states_cities.json');

        if (file_exists($localPath)) {
            try {
                $this->command->info('Loading location data from local JSON file...');
                $jsonData = file_get_contents($localPath);
                $states = json_decode($jsonData, true);
                if (is_array($states) && ! empty($states)) {
                    $fetchedSuccessfully = true;
                    $this->command->info('Successfully loaded location data from local JSON file.');
                }
            } catch (\Exception $e) {
                $this->command->warn('Failed to parse local JSON data: '.$e->getMessage());
            }
        }

        if (! $fetchedSuccessfully) {
            try {
                $this->command->info('Fetching combined Location data from dataset (timeout 5s)...');
                $response = Http::timeout(5)->get('https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/json/countries%2Bstates%2Bcities.json');

                if ($response->successful()) {
                    $allCountries = $response->json();
                    $india = null;
                    foreach ($allCountries as $country) {
                        if (($country['iso2'] ?? '') === 'IN') {
                            $india = $country;
                            break;
                        }
                    }

                    if ($india && isset($india['states'])) {
                        $states = $india['states'];
                        $fetchedSuccessfully = true;
                        $this->command->info('Successfully fetched location data from GitHub.');
                    }
                }
            } catch (\Exception $e) {
                $this->command->warn('Network request failed or timed out: '.$e->getMessage());
            }
        }

        if (! $fetchedSuccessfully) {
            $this->command->info('Using robust local fallback data for Indian States and Cities...');
            $states = [
                [
                    'name' => 'Maharashtra',
                    'state_code' => 'MH',
                    'cities' => [
                        ['name' => 'Mumbai', 'latitude' => 19.0760, 'longitude' => 72.8777],
                        ['name' => 'Pune', 'latitude' => 18.5204, 'longitude' => 73.8567],
                        ['name' => 'Nagpur', 'latitude' => 21.1458, 'longitude' => 79.0882],
                        ['name' => 'Thane', 'latitude' => 19.2183, 'longitude' => 72.9781],
                    ],
                ],
                [
                    'name' => 'Karnataka',
                    'state_code' => 'KA',
                    'cities' => [
                        ['name' => 'Bengaluru', 'latitude' => 12.9716, 'longitude' => 77.5946],
                        ['name' => 'Mysore', 'latitude' => 12.2958, 'longitude' => 76.6394],
                        ['name' => 'Mangalore', 'latitude' => 12.9141, 'longitude' => 74.8560],
                        ['name' => 'Hubli', 'latitude' => 15.3647, 'longitude' => 75.1240],
                    ],
                ],
                [
                    'name' => 'Delhi',
                    'state_code' => 'DL',
                    'cities' => [
                        ['name' => 'New Delhi', 'latitude' => 28.6139, 'longitude' => 77.2090],
                        ['name' => 'Dwarka', 'latitude' => 28.5823, 'longitude' => 77.0500],
                        ['name' => 'Rohini', 'latitude' => 28.7073, 'longitude' => 77.1055],
                    ],
                ],
                [
                    'name' => 'Tamil Nadu',
                    'state_code' => 'TN',
                    'cities' => [
                        ['name' => 'Chennai', 'latitude' => 13.0827, 'longitude' => 80.2707],
                        ['name' => 'Coimbatore', 'latitude' => 11.0168, 'longitude' => 76.9558],
                        ['name' => 'Madurai', 'latitude' => 9.9252, 'longitude' => 78.1198],
                    ],
                ],
                [
                    'name' => 'Telangana',
                    'state_code' => 'TG',
                    'cities' => [
                        ['name' => 'Hyderabad', 'latitude' => 17.3850, 'longitude' => 78.4867],
                        ['name' => 'Warangal', 'latitude' => 17.9689, 'longitude' => 79.5941],
                    ],
                ],
                [
                    'name' => 'West Bengal',
                    'state_code' => 'WB',
                    'cities' => [
                        ['name' => 'Kolkata', 'latitude' => 22.5726, 'longitude' => 88.3639],
                        ['name' => 'Howrah', 'latitude' => 22.5779, 'longitude' => 88.3178],
                    ],
                ],
                [
                    'name' => 'Gujarat',
                    'state_code' => 'GJ',
                    'cities' => [
                        ['name' => 'Ahmedabad', 'latitude' => 23.0225, 'longitude' => 72.5714],
                        ['name' => 'Surat', 'latitude' => 21.1702, 'longitude' => 72.8311],
                        ['name' => 'Vadodara', 'latitude' => 22.3072, 'longitude' => 73.1812],
                    ],
                ],
                [
                    'name' => 'Uttar Pradesh',
                    'state_code' => 'UP',
                    'cities' => [
                        ['name' => 'Lucknow', 'latitude' => 26.8467, 'longitude' => 80.9462],
                        ['name' => 'Noida', 'latitude' => 28.5355, 'longitude' => 77.3910],
                        ['name' => 'Kanpur', 'latitude' => 26.4499, 'longitude' => 80.3319],
                    ],
                ],
                [
                    'name' => 'Kerala',
                    'state_code' => 'KL',
                    'cities' => [
                        ['name' => 'Kochi', 'latitude' => 9.9312, 'longitude' => 76.2673],
                        ['name' => 'Thiruvananthapuram', 'latitude' => 8.5241, 'longitude' => 76.9366],
                        ['name' => 'Kozhikode', 'latitude' => 11.2588, 'longitude' => 75.7804],
                    ],
                ],
                [
                    'name' => 'Rajasthan',
                    'state_code' => 'RJ',
                    'cities' => [
                        ['name' => 'Jaipur', 'latitude' => 26.9124, 'longitude' => 75.7873],
                        ['name' => 'Udaipur', 'latitude' => 24.5854, 'longitude' => 73.7125],
                        ['name' => 'Jodhpur', 'latitude' => 26.2389, 'longitude' => 73.0243],
                    ],
                ],
            ];
        }

        $this->command->info('Processing '.count($states).' states for India...');

        DB::transaction(function () use ($states) {
            $citiesToInsert = [];

            // Insert States
            foreach ($states as $stateData) {
                $state = State::updateOrCreate(
                    [
                        'name' => $stateData['name'],
                    ],
                    [
                        'code' => $stateData['state_code'] ?? null,
                        'slug' => Str::slug($stateData['name']),
                    ]
                );

                $cities = $stateData['cities'] ?? [];

                foreach ($cities as $cityData) {
                    $citiesToInsert[] = [
                        'name' => $cityData['name'],
                        'state_id' => $state->id,
                        'latitude' => $cityData['latitude'] ?? null,
                        'longitude' => $cityData['longitude'] ?? null,
                        'slug' => Str::slug($cityData['name']),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }

            $this->command->info('States seeded successfully.');
            $this->command->info('Processing '.count($citiesToInsert).' cities in chunks...');

            // Insert Cities in chunks of 500
            $chunks = array_chunk($citiesToInsert, 500);

            $bar = $this->command->getOutput()->createProgressBar(count($chunks));
            $bar->start();

            foreach ($chunks as $chunk) {
                // Upsert to handle unique constraint (name, state_id) safely
                DB::table('cities')->upsert(
                    $chunk,
                    ['name', 'state_id'], // unique columns
                    ['latitude', 'longitude', 'slug', 'updated_at'] // update if exists
                );

                $bar->advance();
            }

            $bar->finish();
            $this->command->newLine();
            $this->command->info('Cities seeded successfully.');
        });

        $this->command->info('India location seeding completed!');
    }
}
