<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $password = Hash::make('password');

        // Exactly 10 target accounts
        $users = [
            [
                'name' => 'Mega User',
                'email' => 'test@example.com',
                'password' => $password,
                'role_id' => 1,
                'roles' => [1, 2, 3, 4, 5, 6, 7, 8],
            ],
            [
                'name' => 'Standard User',
                'email' => 'user@example.com',
                'password' => $password,
                'role_id' => 1,
                'roles' => [1],
            ],
            [
                'name' => 'Multi Role User 1',
                'email' => 'multi1@example.com',
                'password' => $password,
                'role_id' => 1,
                'roles' => [1, 2, 3, 4, 5, 6],
            ],
            [
                'name' => 'Multi Role User 2',
                'email' => 'multi2@example.com',
                'password' => $password,
                'role_id' => 1,
                'roles' => [1, 2, 3, 5, 6, 7],
            ],
            [
                'name' => 'Multi Role User 3',
                'email' => 'multi3@example.com',
                'password' => $password,
                'role_id' => 1,
                'roles' => [1, 3, 4, 5, 6, 7],
            ],
            [
                'name' => 'Breeder User',
                'email' => 'breeder@example.com',
                'password' => $password,
                'role_id' => 2,
                'roles' => [2],
            ],
            [
                'name' => 'Pet Shop User',
                'email' => 'petshop@example.com',
                'password' => $password,
                'role_id' => 3,
                'roles' => [3],
            ],
            [
                'name' => 'Vet User',
                'email' => 'vet@example.com',
                'password' => $password,
                'role_id' => 4,
                'roles' => [4],
            ],
            [
                'name' => 'Trainer User',
                'email' => 'trainer@example.com',
                'password' => $password,
                'role_id' => 5,
                'roles' => [5],
            ],
            [
                'name' => 'Boarding User',
                'email' => 'boarding@example.com',
                'password' => $password,
                'role_id' => 6,
                'roles' => [6],
            ],
            [
                'name' => 'Welfare User',
                'email' => 'welfare@example.com',
                'password' => $password,
                'role_id' => 7,
                'roles' => [7],
            ],
        ];

        foreach ($users as $data) {
            $user = User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'password' => $data['password'],
                    'role_id' => $data['role_id'],
                    'is_active' => true,
                ]
            );

            // Sync all roles in the role_user pivot table
            $user->roles()->sync($data['roles']);
        }
    }
}
