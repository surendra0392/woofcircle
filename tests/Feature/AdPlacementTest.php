<?php

use App\Models\Admin;
use App\Models\AdPlacement;
use App\Models\AdPricing;
use App\Models\ListingTier;
use App\Models\User;
use App\Services\AdInjectionService;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

test('public banner endpoint returns active banner for slot', function () {
    $banner = AdPlacement::create([
        'tier' => 'gold',
        'placement_slot' => 'header_leaderboard',
        'title' => 'Test Leaderboard Banner',
        'subtitle' => 'Exclusive pet care',
        'target_url' => 'https://example.com/partner',
        'cta_text' => 'Shop Now',
        'duration' => '1m',
        'starts_at' => now()->subDay(),
        'ends_at' => now()->addDays(20),
        'status' => 'active',
        'approval_status' => 'approved',
    ]);

    $response = $this->getJson('/api/ads/banner/header_leaderboard');
    $response->assertStatus(200)
        ->assertJson([
            'is_ad_free' => false,
        ])
        ->assertJsonPath('banner.id', $banner->id)
        ->assertJsonPath('banner.title', 'Test Leaderboard Banner');
});

test('paid connoisseur subscribers receive ad free status and no banner', function () {
    $tier = ListingTier::firstOrCreate(['id' => 2], ['name' => 'Connoisseur', 'price' => 499]);
    $user = User::factory()->create(['listing_tier_id' => $tier->id]);

    $banner = AdPlacement::create([
        'tier' => 'platinum',
        'placement_slot' => 'sidebar_square',
        'title' => 'Test Sidebar',
        'target_url' => 'https://example.com',
        'duration' => '1m',
        'starts_at' => now()->subDay(),
        'ends_at' => now()->addDays(20),
        'status' => 'active',
        'approval_status' => 'approved',
    ]);

    $response = $this->actingAs($user)->getJson('/api/ads/banner/sidebar_square');
    $response->assertStatus(200)
        ->assertJson([
            'banner' => null,
            'is_ad_free' => true,
        ]);
});

test('ad impression tracking increments impressions count', function () {
    $ad = AdPlacement::create([
        'tier' => 'gold',
        'placement_slot' => 'header_leaderboard',
        'title' => 'Impression Test',
        'target_url' => 'https://example.com',
        'duration' => '1m',
        'starts_at' => now()->subDay(),
        'ends_at' => now()->addDays(20),
        'status' => 'active',
        'impressions_count' => 5,
    ]);

    $response = $this->postJson("/api/ads/{$ad->id}/impression");
    $response->assertStatus(200)
        ->assertJson(['success' => true]);

    $ad->refresh();
    expect($ad->impressions_count)->toBe(6);
});

test('ad click tracking increments clicks count and redirects to destination', function () {
    $ad = AdPlacement::create([
        'tier' => 'gold',
        'placement_slot' => 'in_article',
        'title' => 'Click Test',
        'target_url' => 'https://example.com/landing',
        'duration' => '1m',
        'starts_at' => now()->subDay(),
        'ends_at' => now()->addDays(20),
        'status' => 'active',
        'clicks_count' => 2,
    ]);

    $response = $this->get("/ads/{$ad->id}/click");
    $response->assertRedirect('https://example.com/landing');

    $ad->refresh();
    expect($ad->clicks_count)->toBe(3);
});

test('ad injection service suppresses ads for paid subscribers', function () {
    $tier = ListingTier::firstOrCreate(['id' => 3], ['name' => 'Sovereign Elite', 'price' => 1499]);
    $user = User::factory()->create(['listing_tier_id' => $tier->id]);

    $request = Request::create('/marketplace/puppies', 'GET');
    $request->setUserResolver(fn () => $user);

    $paginator = new LengthAwarePaginator(collect(), 0, 15, 1);

    $service = new AdInjectionService();
    $result = $service->injectAds($paginator, 'App\Models\Litter', $request);

    expect($service->isUserAdFree($request))->toBeTrue();
    expect($result->getCollection())->toBeEmpty();
});
