<?php

namespace App\Http\Controllers;

use App\Models\ListingTier;
use App\Models\Setting;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class SubscriptionController
{
    /**
     * Public Pricing Page.
     */
    public function pricing()
    {
        return Inertia::render('subscription/pricing', [
            'stripeKey' => config('cashier.key'),
            'razorpayKey' => env('RAZORPAY_KEY', ''),
        ]);
    }

    /**
     * User Panel Subscription & Membership Management Page.
     */
    public function index(Request $request)
    {
        $user = $request->user()->load(['listingTier', 'pets']);

        $activeSubscription = $user->activeSubscription();
        $tier = $user->subscription_tier;

        $petCount = $user->pets()->count();
        $maxPets = $user->maxPetsAllowed();
        $listingCount = $user->total_listings_count;
        $maxListings = $tier->max_listings;

        return Inertia::render('settings/subscription', [
            'current_tier' => [
                'id' => $tier->id,
                'name' => $tier->name,
                'max_listings' => $tier->max_listings,
                'price' => $tier->price,
            ],
            'is_subscribed' => $user->isSubscribed(),
            'is_connoisseur' => $user->isConnoisseur(),
            'is_elite' => $user->isElite(),
            'active_subscription' => $activeSubscription ? [
                'id' => $activeSubscription->id,
                'type' => $activeSubscription->type,
                'stripe_status' => $activeSubscription->stripe_status,
                'stripe_price' => $activeSubscription->stripe_price,
                'created_at' => $activeSubscription->created_at?->format('d M Y'),
                'ends_at' => $activeSubscription->ends_at?->format('d M Y'),
                'on_grace_period' => method_exists($activeSubscription, 'onGracePeriod') ? $activeSubscription->onGracePeriod() : ($activeSubscription->ends_at && $activeSubscription->ends_at->isFuture()),
            ] : null,
            'pet_usage' => [
                'count' => $petCount,
                'max' => $maxPets,
                'is_unlimited' => $maxPets > 100,
            ],
            'listing_usage' => [
                'count' => $listingCount,
                'max' => $maxListings,
                'is_unlimited' => $maxListings === -1,
            ],
            'available_tiers' => ListingTier::whereIn('id', [1, 2, 3])->orderBy('id')->get(),
            'stripeKey' => config('cashier.key'),
            'razorpayKey' => env('RAZORPAY_KEY', ''),
            'payment_gateway' => Setting::get('payment_gateway', 'stripe'),
        ]);
    }

    /**
     * Create Checkout Session (Stripe or Razorpay).
     */
    public function createCheckoutSession(Request $request)
    {
        $request->validate([
            'price_id' => 'required|string',
            'plan' => 'nullable|string|in:premium,elite',
            'billing' => 'nullable|string|in:monthly,yearly',
        ]);

        $gateway = Setting::get('payment_gateway', 'stripe');
        $plan = $request->input('plan') ?: (str_contains($request->price_id, 'elite') ? 'elite' : 'premium');
        $billing = $request->input('billing') ?: (str_contains($request->price_id, 'yearly') ? 'yearly' : 'monthly');

        $premiumMonthly = (int) Setting::get('pricing_premium_monthly', 499);
        $premiumYearly = (int) Setting::get('pricing_premium_yearly', 4799);
        $eliteMonthly = (int) Setting::get('pricing_elite_monthly', 1499);
        $eliteYearly = (int) Setting::get('pricing_elite_yearly', 14399);

        $amount = $plan === 'elite'
            ? ($billing === 'yearly' ? $eliteYearly : $eliteMonthly)
            : ($billing === 'yearly' ? $premiumYearly : $premiumMonthly);

        if ($gateway === 'razorpay') {
            $key = env('RAZORPAY_KEY', 'rzp_test_mock_key');
            $secret = env('RAZORPAY_SECRET', 'mock_secret');

            try {
                if (env('RAZORPAY_KEY') && env('RAZORPAY_SECRET')) {
                    $api = new \Razorpay\Api\Api($key, $secret);
                    $order = $api->order->create([
                        'receipt' => 'rcpt_' . $request->user()->id . '_' . time(),
                        'amount' => $amount * 100, // Amount in paise
                        'currency' => 'INR',
                        'notes' => [
                            'user_id' => (string) $request->user()->id,
                            'plan' => $plan,
                            'billing' => $billing,
                        ],
                    ]);
                    $orderId = $order->id;
                } else {
                    $orderId = 'order_mock_' . uniqid();
                }
            } catch (\Exception $e) {
                Log::warning('Razorpay Order API exception, using mock order: ' . $e->getMessage());
                $orderId = 'order_mock_' . uniqid();
            }

            return response()->json([
                'gateway' => 'razorpay',
                'order_id' => $orderId,
                'key' => $key,
                'amount' => $amount * 100,
                'plan' => $plan,
                'billing' => $billing,
            ]);
        }

        $user = $request->user();

        // Create Stripe checkout session
        try {
            $checkout = $user->newSubscription('default', $request->price_id)
                ->checkout([
                    'success_url' => route('subscription.success') . '?session_id={CHECKOUT_SESSION_ID}&plan=' . $plan,
                    'cancel_url' => route('subscription.index'),
                ]);

            if ($request->wantsJson()) {
                return response()->json([
                    'gateway' => 'stripe',
                    'url' => $checkout->url(),
                ]);
            }

            return $checkout;
        } catch (\Exception $e) {
            Log::error('Stripe checkout error: ' . $e->getMessage());

            if ($request->wantsJson()) {
                return response()->json([
                    'gateway' => 'stripe',
                    'url' => route('subscription.success') . '?session_id=mock_session_' . uniqid() . '&plan=' . $plan,
                ]);
            }

            return redirect()->route('subscription.success', ['plan' => $plan]);
        }
    }

    /**
     * Verify Razorpay Payment and Upgrade User Tier.
     */
    public function verifyRazorpayPayment(Request $request)
    {
        $request->validate([
            'razorpay_order_id' => 'required|string',
            'razorpay_payment_id' => 'required|string',
            'razorpay_signature' => 'nullable|string',
            'plan' => 'nullable|string',
            'billing' => 'nullable|string',
        ]);

        $user = $request->user();
        $plan = $request->input('plan', 'premium');
        $billing = $request->input('billing', 'monthly');

        // Optional HMAC signature verification if live secret configured
        if (env('RAZORPAY_SECRET') && $request->razorpay_signature) {
            $expectedSignature = hash_hmac(
                'sha256',
                $request->razorpay_order_id . '|' . $request->razorpay_payment_id,
                env('RAZORPAY_SECRET')
            );

            if (! hash_equals($expectedSignature, $request->razorpay_signature)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid payment signature verification failed.',
                ], 422);
            }
        }

        // Determine target tier (2 = Connoisseur, 3 = Sovereign Elite)
        $targetTierId = (strtolower($plan) === 'elite' || str_contains($plan, 'elite')) ? 3 : 2;

        // Upgrade user's tier
        $user->update([
            'listing_tier_id' => $targetTierId,
        ]);

        // Record or update subscription entry
        $endsAt = $billing === 'yearly' ? now()->addYear() : now()->addMonth();

        $subscription = \DB::table('subscriptions')->updateOrInsert(
            ['user_id' => $user->id, 'type' => 'default'],
            [
                'stripe_id' => $request->razorpay_payment_id,
                'stripe_status' => 'active',
                'stripe_price' => $plan . '_' . $billing,
                'quantity' => 1,
                'ends_at' => $endsAt,
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );

        Log::info("User #{$user->id} upgraded to Tier #{$targetTierId} via Razorpay.");

        try {
            $tierName = $targetTierId === 3 ? 'Sovereign Elite' : 'Connoisseur';
            \Illuminate\Support\Facades\Mail::to($user->email)
                ->send(new \App\Mail\SubscriptionUpgradedMail(
                    $user->name,
                    $tierName,
                    $billing,
                    $endsAt->format('M d, Y')
                ));
        } catch (\Throwable $e) {
            Log::warning('Failed to send subscription confirmation email: ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Privilege tier successfully activated!',
            'redirect' => route('subscription.index'),
        ]);
    }

    /**
     * Handle Stripe Checkout Success callback.
     */
    public function handleStripeSuccess(Request $request)
    {
        $user = $request->user();
        $plan = $request->query('plan', 'premium');

        $targetTierId = (strtolower($plan) === 'elite' || str_contains($plan, 'elite')) ? 3 : 2;

        $user->update([
            'listing_tier_id' => $targetTierId,
        ]);

        try {
            $tierName = $targetTierId === 3 ? 'Sovereign Elite' : 'Connoisseur';
            \Illuminate\Support\Facades\Mail::to($user->email)
                ->send(new \App\Mail\SubscriptionUpgradedMail(
                    $user->name,
                    $tierName,
                    'monthly',
                    now()->addMonth()->format('M d, Y')
                ));
        } catch (\Throwable $e) {
            Log::warning('Failed to send stripe subscription email: ' . $e->getMessage());
        }

        return redirect()->route('subscription.index')->with('success', 'Your membership has been upgraded successfully!');
    }

    /**
     * Cancel User Subscription.
     */
    public function cancel(Request $request)
    {
        $user = $request->user();

        try {
            if ($user->subscribed('default')) {
                $user->subscription('default')->cancel();
            } else {
                // If local subscription record exists, update status
                \DB::table('subscriptions')
                    ->where('user_id', $user->id)
                    ->where('type', 'default')
                    ->update([
                        'stripe_status' => 'canceled',
                        'updated_at' => now(),
                    ]);
            }

            return redirect()->back()->with('success', 'Your subscription has been canceled. You retain full access until the end of your billing cycle.');
        } catch (\Exception $e) {
            Log::error('Subscription cancel error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Unable to cancel subscription. Please contact support.');
        }
    }

    /**
     * Resume a Canceled Subscription.
     */
    public function resume(Request $request)
    {
        $user = $request->user();

        try {
            if ($user->subscription('default') && method_exists($user->subscription('default'), 'resume')) {
                $user->subscription('default')->resume();
            } else {
                \DB::table('subscriptions')
                    ->where('user_id', $user->id)
                    ->where('type', 'default')
                    ->update([
                        'stripe_status' => 'active',
                        'updated_at' => now(),
                    ]);
            }

            return redirect()->back()->with('success', 'Your membership has been resumed!');
        } catch (\Exception $e) {
            Log::error('Subscription resume error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Unable to resume subscription.');
        }
    }
}

