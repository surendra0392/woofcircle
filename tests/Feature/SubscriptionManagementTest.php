<?php

use App\Models\ListingTier;
use App\Models\Pet;
use App\Models\User;

test('guests are redirected from subscription settings page', function () {
    $response = $this->get('/settings/subscription');
    $response->assertRedirect('/login');
});

test('authenticated users can access subscription settings page', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/settings/subscription');
    $response->assertStatus(200);
});

test('user tier helpers return expected defaults for free tier', function () {
    $user = User::factory()->create(['listing_tier_id' => 1]);

    expect($user->isSubscribed())->toBeFalse();
    expect($user->isConnoisseur())->toBeFalse();
    expect($user->isElite())->toBeFalse();
    expect($user->maxPetsAllowed())->toBe(2);
    expect($user->canAccess5GenPedigree())->toBeFalse();
});

test('user tier helpers return expected values for connoisseur tier', function () {
    $tier = ListingTier::firstOrCreate(['id' => 2], ['name' => 'Connoisseur', 'max_listings' => 10, 'price' => 499]);
    $user = User::factory()->create(['listing_tier_id' => $tier->id]);

    expect($user->isSubscribed())->toBeTrue();
    expect($user->isConnoisseur())->toBeTrue();
    expect($user->maxPetsAllowed())->toBeGreaterThan(100);
    expect($user->canAccess5GenPedigree())->toBeTrue();
});

test('user tier helpers return expected values for elite tier', function () {
    $tier = ListingTier::firstOrCreate(['id' => 3], ['name' => 'Sovereign Elite', 'max_listings' => -1, 'price' => 1499]);
    $user = User::factory()->create(['listing_tier_id' => $tier->id]);

    expect($user->isSubscribed())->toBeTrue();
    expect($user->isElite())->toBeTrue();
    expect($user->hasVerifiedShield())->toBeTrue();
});

test('razorpay verification upgrades user tier and creates subscription', function () {
    $user = User::factory()->create(['listing_tier_id' => 1]);

    $response = $this->actingAs($user)->postJson('/subscription/verify-razorpay', [
        'razorpay_order_id' => 'order_test_123',
        'razorpay_payment_id' => 'pay_test_456',
        'plan' => 'premium',
        'billing' => 'monthly',
    ]);

    $response->assertStatus(200)
        ->assertJson([
            'success' => true,
        ]);

    $user->refresh();
    expect($user->listing_tier_id)->toBe(2);
});

test('user can cancel active subscription', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/subscription/cancel');
    $response->assertRedirect();
});
