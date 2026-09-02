<?php

namespace App\Mail;

use App\Models\Event;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EventRegistrationConfirmationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $userName,
        public Event $event
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '🎪 Registration Confirmed: ' . $this->event->title,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.event_registration',
            with: [
                'userName' => $this->userName,
                'event' => $this->event->load(['city', 'state']),
            ],
        );
    }
}
