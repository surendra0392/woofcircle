<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class AdminSettingController
{
    /**
     * Display the settings page.
     */
    public function index()
    {
        $settings = Setting::all()->groupBy('group');

        return Inertia::render('admin/settings', [
            'groupedSettings' => $settings,
        ]);
    }

    /**
     * Update settings.
     */
    public function update(Request $request)
    {
        \Log::info('Settings Update Request:', $request->all());
        $settings = Setting::all();

        foreach ($settings as $setting) {
            if ($setting->type === 'image') {
                if ($request->hasFile("settings.{$setting->key}")) {
                    $file = $request->file("settings.{$setting->key}");
                    $path = $file->store('settings', 'public');
                    $setting->update(['value' => '/storage/'.$path]);
                }
            } elseif ($setting->type === 'boolean') {
                if ($request->has("settings.{$setting->key}")) {
                    $setting->update(['value' => $request->boolean("settings.{$setting->key}") ? '1' : '0']);
                }
            } else {
                if ($request->has("settings.{$setting->key}")) {
                    $setting->update(['value' => $request->input("settings.{$setting->key}")]);
                }
            }
        }

        Cache::forget('site_settings');

        return back()->with('success', 'Platform settings updated successfully.');
    }

    public function payments()
    {
        return Inertia::render('admin/settings/payments', [
            'paymentGateway' => Setting::get('payment_gateway', 'stripe'),
        ]);
    }

    public function updatePayments(Request $request)
    {
        $request->validate([
            'payment_gateway' => 'required|in:stripe,razorpay'
        ]);
        
        Setting::set('payment_gateway', $request->payment_gateway, 'string', 'payments');
        Cache::forget('site_settings');

        return back()->with('success', 'Payment gateway updated successfully.');
    }
}
