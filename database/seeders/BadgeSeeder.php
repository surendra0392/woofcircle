<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BadgeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $badges = [
            [
                'name' => 'Profile Pioneer',
                'description' => 'Awarded for completing your user profile.',
                'icon_path' => 'FaUserCheck', // Could use font awesome or lucide icon names
                'criteria' => 'completed_profile',
            ],
            [
                'name' => 'Pet Parent',
                'description' => 'Awarded for adding your first pet.',
                'icon_path' => 'FaPaw',
                'criteria' => 'added_pet',
            ],
            [
                'name' => 'Community Guardian',
                'description' => 'Awarded for reporting a lost pet to the community.',
                'icon_path' => 'FaSearch',
                'criteria' => 'reported_lost_pet',
            ],
        ];

        foreach ($badges as $badge) {
            \App\Models\Badge::updateOrCreate(['criteria' => $badge['criteria']], $badge);
        }
    }
}
