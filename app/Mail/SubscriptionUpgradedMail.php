<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SubscriptionUpgradedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $userName,
        public string $tierName,
        public string $billing,
        public string $validUntil
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '👑 Your ' . $this->tierName . ' Membership is Now Active on WoofCircle',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.subscription_upgraded',
            with: [
                'userName' => $this->userName,
                'tierName' => $this->tierName,
                'billing' => $this->billing,
                'validUntil' => $this->validUntil,
            ],
        );
    }
}
