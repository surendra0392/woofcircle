<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ProfileCreatedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $userName,
        public string $profileType,
        public string $profileName
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your ' . ucfirst($this->profileType) . ' Profile on WoofCircle is Live!',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.profile_created',
            with: [
                'userName' => $this->userName,
                'profileType' => $this->profileType,
                'profileName' => $this->profileName,
            ],
        );
    }
}
