<?php

use App\Models\Role;

test('registration screen can be rendered', function () {
    $response = $this->get('/register');

    $response->assertStatus(200);
});

test('new users can register', function () {
    $role = Role::first() ?? Role::create([
        'name' => 'User',
        'slug' => 'user',
        'is_active' => true,
    ]);

    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'mobile_number' => '1234567890',
        'password' => 'password',
        'password_confirmation' => 'password',
        'roles' => [$role->id],
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});
