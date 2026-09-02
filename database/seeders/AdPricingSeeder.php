<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdPricingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tiers = ['platinum', 'gold', 'silver', 'bronze', 'featured'];
        $durations = ['7d', '15d', '1m', '3m', '6m', '1y'];
        
        $basePrices = [
            'platinum' => 5000,
            'gold' => 3000,
            'silver' => 1500,
            'bronze' => 500,
            'featured' => 10000,
        ];
        
        $durationMultipliers = [
            '7d' => 1,
            '15d' => 2,
            '1m' => 4,
            '3m' => 11,
            '6m' => 20,
            '1y' => 35,
        ];

        foreach ($tiers as $tier) {
            foreach ($durations as $duration) {
                \App\Models\AdPricing::updateOrCreate(
                    ['tier' => $tier, 'duration' => $duration],
                    ['price' => $basePrices[$tier] * $durationMultipliers[$duration]]
                );
            }
        }
    }
}
