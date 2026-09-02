<?php

namespace Database\Seeders;

use App\Models\VetService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class VetServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            [
                'name' => 'General Checkup',
                'description' => 'Comprehensive physical examination for your pet.',
            ],
            [
                'name' => 'Vaccination',
                'description' => 'Essential immunizations to protect against common diseases.',
            ],
            [
                'name' => 'Emergency Care',
                'description' => '24/7 critical care and emergency surgical services.',
            ],
            [
                'name' => 'Pet Grooming',
                'description' => 'Professional bathing, hair trimming, and nail care.',
            ],
            [
                'name' => 'Pet Spa',
                'description' => 'Luxury wellness treatments and relaxation for pets.',
            ],
            [
                'name' => 'Dental Cleaning',
                'description' => 'Oral hygiene and professional tartar removal.',
            ],
            [
                'name' => 'Laboratory Tests',
                'description' => 'Blood work, urinalysis, and diagnostic pathology.',
            ],
            [
                'name' => 'X-Ray & Ultrasound',
                'description' => 'Advanced internal imaging and diagnostic scanning.',
            ],
            [
                'name' => 'Microchipping',
                'description' => 'Permanent electronic identification for pet safety.',
            ],
            [
                'name' => 'Behavioral Consultation',
                'description' => 'Expert guidance on pet behavior and training issues.',
            ],
            [
                'name' => 'Pharmacy',
                'description' => 'In-house veterinary medications and prescriptions.',
            ],
        ];

        foreach ($services as $service) {
            VetService::updateOrCreate(
                ['slug' => Str::slug($service['name'])],
                [
                    'name' => $service['name'],
                    'description' => $service['description'],
                    'is_active' => true,
                ]
            );
        }
    }
}
