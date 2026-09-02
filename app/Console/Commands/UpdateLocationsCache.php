<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class UpdateLocationsCache extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'woof:update-locations';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Download and update the local Indian states and cities database cache from GitHub';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting Indian locations cache update...');
        $url = 'https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/json/countries%2Bstates%2Bcities.json';

        $this->info('Downloading combined countries, states, and cities dataset from GitHub...');
        $this->info('URL: '.$url);

        try {
            // High timeout because the dataset is ~46MB
            $response = Http::timeout(180)->get($url);

            if (! $response->successful()) {
                $this->error('Failed to download the dataset. Status: '.$response->status());

                return self::FAILURE;
            }

            $this->info('Dataset downloaded successfully. Processing JSON...');
            $allCountries = $response->json();

            if (! is_array($allCountries)) {
                $this->error('Downloaded content is not a valid JSON array.');

                return self::FAILURE;
            }

            $india = null;
            foreach ($allCountries as $country) {
                if (($country['iso2'] ?? '') === 'IN') {
                    $india = $country;
                    break;
                }
            }

            if (! $india || ! isset($india['states'])) {
                $this->error('Indian country data (ISO: IN) or states array not found in the dataset.');

                return self::FAILURE;
            }

            $states = $india['states'];
            $this->info('Found '.count($states).' states for India. Filtering and formatting...');

            $formattedStates = [];
            foreach ($states as $state) {
                $formattedCities = [];
                $cities = $state['cities'] ?? [];

                foreach ($cities as $city) {
                    $formattedCities[] = [
                        'name' => $city['name'],
                        'latitude' => $city['latitude'] ?? null,
                        'longitude' => $city['longitude'] ?? null,
                    ];
                }

                $formattedStates[] = [
                    'name' => $state['name'],
                    'state_code' => $state['state_code'] ?? $state['iso2'] ?? null,
                    'cities' => $formattedCities,
                ];
            }

            $localPath = database_path('data/india_states_cities.json');

            // Ensure the parent directory exists
            $dir = dirname($localPath);
            if (! is_dir($dir)) {
                mkdir($dir, 0755, true);
            }

            $this->info('Saving formatted data to: '.$localPath);
            $jsonData = json_encode($formattedStates, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

            if (file_put_contents($localPath, $jsonData) === false) {
                $this->error('Failed to write JSON data to '.$localPath);

                return self::FAILURE;
            }

            $this->info('Locations cache updated successfully!');
            $this->info('File size: '.round(filesize($localPath) / 1024, 2).' KB');

            return self::SUCCESS;
        } catch (\Exception $e) {
            $this->error('An error occurred: '.$e->getMessage());

            return self::FAILURE;
        }
    }
}
