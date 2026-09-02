<?php

namespace App\Console\Commands;

use App\Models\Pet;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class GeocodeLostPets extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'pets:geocode-lost';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Geocode existing lost pets that have a location but no coordinates';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $pets = Pet::where('is_lost', true)
            ->whereNotNull('lost_location')
            ->whereNull('lost_lat')
            ->whereNull('lost_lng')
            ->get();

        $this->info("Found {$pets->count()} lost pets to geocode.");

        foreach ($pets as $pet) {
            $this->info("Geocoding pet: {$pet->name} at {$pet->lost_location}");
            
            try {
                $response = Http::withHeaders([
                    'User-Agent' => 'WoofCircle/1.0 (artisan command)'
                ])->get('https://nominatim.openstreetmap.org/search', [
                    'q' => $pet->lost_location,
                    'format' => 'json',
                    'limit' => 1
                ]);

                if ($response->successful() && !empty($response->json())) {
                    $data = $response->json()[0];
                    $pet->update([
                        'lost_lat' => $data['lat'],
                        'lost_lng' => $data['lon'],
                    ]);
                    $this->info("Success: {$data['lat']}, {$data['lon']}");
                } else {
                    $this->warn("No results for: {$pet->lost_location}");
                }
            } catch (\Exception $e) {
                $this->error("Failed to geocode: " . $e->getMessage());
            }

            // Sleep to respect Nominatim usage policy (1 request per second)
            sleep(1);
        }
        
        $this->info('Done geocoding.');
    }
}
