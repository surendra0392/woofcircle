<?php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NewsletterController extends Controller
{
    /**
     * Subscribe a user to the newsletter.
     */
    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'name'  => ['nullable', 'string', 'max:255'],
        ]);

        $subscriber = NewsletterSubscriber::firstOrNew(['email' => $validated['email']]);
        
        if (!$subscriber->exists) {
            $subscriber->name = $validated['name'] ?? null;
            $subscriber->subscribed_at = now();
            $subscriber->unsubscribed_at = null;
            $subscriber->save();
            
            return back()->with('success', 'Thanks for subscribing to our newsletter!');
        }
        
        // If they already exist, just ensure they are active
        if ($subscriber->unsubscribed_at !== null) {
            $subscriber->unsubscribed_at = null;
            $subscriber->save();
            return back()->with('success', 'Welcome back! You have been re-subscribed.');
        }

        return back()->with('success', 'You are already subscribed to our newsletter.');
    }

    /**
     * Unsubscribe a user via token.
     */
    public function unsubscribe($token)
    {
        $subscriber = NewsletterSubscriber::where('token', $token)->first();

        if (!$subscriber) {
            abort(404, 'Invalid unsubscribe link.');
        }

        if ($subscriber->unsubscribed_at === null) {
            $subscriber->unsubscribed_at = now();
            $subscriber->save();
        }

        return Inertia::render('newsletter/unsubscribed', [
            'email' => $subscriber->email
        ]);
    }
}
