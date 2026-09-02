<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('roles')->insertOrIgnore([
            ['id' => 1, 'name' => 'User', 'slug' => 'user', 'description' => 'Standard user', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'name' => 'Breeder', 'slug' => 'breeder', 'description' => 'Registered breeder', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'name' => 'Pet Shop', 'slug' => 'pet-shop', 'description' => 'Pet shop provider', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 4, 'name' => 'Veterinarian', 'slug' => 'vet', 'description' => 'Veterinary expert', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 5, 'name' => 'Trainer', 'slug' => 'trainer', 'description' => 'Pet trainer', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 6, 'name' => 'Boarding Provider', 'slug' => 'boarding', 'description' => 'Pet boarding', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 7, 'name' => 'Welfare Organization', 'slug' => 'welfare', 'description' => 'Animal welfare group', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 8, 'name' => 'Stud Service Provider', 'slug' => 'stud-service-provider', 'description' => 'Stud services', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
