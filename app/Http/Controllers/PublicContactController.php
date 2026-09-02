<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicContactController
{
    public function index()
    {
        return Inertia::render('contact');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $message = ContactMessage::create($validated);

        try {
            // Confirmation to user
            \Illuminate\Support\Facades\Mail::to($validated['email'])
                ->send(new \App\Mail\ContactMessageConfirmationMail(
                    $validated['name'],
                    $validated['email'],
                    $validated['subject'],
                    $validated['message']
                ));

            // Alert to staff
            $recipient = config('mail.from.address', 'hello@woofcircle.in');
            \Illuminate\Support\Facades\Mail::to($recipient)
                ->send(new \App\Mail\ContactMessageReceivedMail(
                    $validated['name'],
                    $validated['email'],
                    $validated['subject'],
                    $validated['message']
                ));
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('Failed to send contact emails: ' . $e->getMessage());
        }

        return back()->with('success', 'Thank you for your message. We will get back to you soon.');
    }
}
