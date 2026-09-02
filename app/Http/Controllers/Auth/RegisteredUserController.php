<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register', [
            'roles' => Role::where('is_active', true)
                ->where('slug', '!=', 'admin') // Exclude admin role
                ->get(['id', 'name', 'slug', 'description']),
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'mobile_number' => 'required|digits:10',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'roles' => 'required|array|min:1',
            'roles.*' => 'exists:roles,id',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'mobile_number' => $request->mobile_number,
            'password' => Hash::make($request->password),
        ]);

        // Attach roles
        $user->roles()->sync($request->roles);

        // Set primary role for backward compatibility if needed
        if ($request->roles) {
            $user->update(['role_id' => $request->roles[0]]);
        }

        event(new Registered($user));

        try {
            \Illuminate\Support\Facades\Mail::to($user->email)->send(new \App\Mail\WelcomeUserMail($user));

            // WhatsApp Welcome
            try {
                $whatsAppService = app(\App\Services\WhatsAppService::class);
                if ($whatsAppService->isEnabled() && !empty($user->mobile_number)) {
                    $whatsAppService->sendTextMessage(
                        $user->mobile_number,
                        "🐾 *Welcome to WoofCircle, {$user->name}!*\n\nWe are delighted to welcome you to India's premier canine sanctuary and registry. Manage your dogs, explore verified litters, and connect with certified specialists:\n" . route('dashboard')
                    );
                }
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::warning('WhatsApp welcome message error: ' . $e->getMessage());
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('Failed to send welcome email: ' . $e->getMessage());
        }

        Auth::login($user);

        return to_route('dashboard');
    }
}
