<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewsletterWelcomeMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $email,
        public string $unsubscribeUrl
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Welcome to WoofCircle Chronicles 🐾',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.newsletter_welcome',
            with: [
                'email' => $this->email,
                'unsubscribeUrl' => $this->unsubscribeUrl,
            ],
        );
    }
}
