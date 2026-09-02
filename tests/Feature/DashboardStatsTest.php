<?php

use App\Support\DashboardStats;

test('dashboard stats returns all expected keys', function () {
    $result = DashboardStats::all();

    expect($result)->toHaveKey('stats');
    expect($result['stats'])->toHaveKeys([
        'total_users',
        'active_users',
        'total_admins',
        'total_roles',
        'total_breeds',
        'active_breeds',
        'total_breeders',
        'active_breeders',
        'total_vets',
        'active_vets',
        'total_trainers',
        'active_trainers',
        'total_boarding',
        'active_boarding',
        'boarding_only',
        'daycare_only',
        'boarding_both',
        'total_welfare',
        'active_welfare',
        'vet_services',
        'specializations',
        'total_states',
        'total_cities',
        'total_litters',
        'total_studs',
        'total_adoptions',
        'total_pets',
        'total_reviews',
        'pending_reviews',
        'total_contact_messages',
        'unread_contact_messages',
    ]);
});

test('dashboard stats values are integers', function () {
    $result = DashboardStats::all();

    foreach ($result['stats'] as $key => $value) {
        expect($value)->toBeInt("{$key} should be an integer, got " . gettype($value));
    }
});

test('dashboard stats returns zero for empty database', function () {
    $result = DashboardStats::all();

    // With no seed data, all counts should be 0
    expect($result['stats']['total_users'])->toBe(0);
    expect($result['stats']['total_breeders'])->toBe(0);
    expect($result['stats']['total_reviews'])->toBe(0);
});

test('recentActivity returns all expected keys', function () {
    $activity = DashboardStats::recentActivity();

    expect($activity)->toHaveKeys([
        'recent_users',
        'recent_breeders',
        'recent_vets',
        'recent_trainers',
        'recent_boarding',
        'recent_welfare',
        'recent_reviews',
        'recent_logs',
    ]);
});
