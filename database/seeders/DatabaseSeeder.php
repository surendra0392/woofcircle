<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
            AdminSeeder::class,
            CorporateHierarchySeeder::class,
            IndiaLocationSeeder::class,
            BreedDataSeeder::class,
            BreederProfileSeeder::class,
            VetProfileSeeder::class,
            VetServiceSeeder::class,
            TrainerSpecializationSeeder::class,
            TrainerProfileSeeder::class,

            BoardingProfileSeeder::class,
            WelfareProfileSeeder::class,
            PetShopSeeder::class,
            EventSeeder::class,
            ArticleSeeder::class,
            GallerySeeder::class,
            LitterSeeder::class,
            AdoptionSeeder::class,
            StudServiceSeeder::class,
            PetSeeder::class,
            AppointmentSeeder::class,
            SettingSeeder::class,
            CareerSeeder::class,
            ForumSeeder::class,
            BadgeSeeder::class,
            AdPricingSeeder::class,
        ]);
    }
}
