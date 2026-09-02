<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TransferRequestNotificationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $breederName,
        public string $litterTitle,
        public string $requesterName,
        public string $requesterEmail,
        public ?string $notes = null
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Puppy Transfer Request: ' . $this->litterTitle,
            replyTo: [$this->requesterEmail],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.transfer_request',
            with: [
                'breederName' => $this->breederName,
                'litterTitle' => $this->litterTitle,
                'requesterName' => $this->requesterName,
                'requesterEmail' => $this->requesterEmail,
                'notes' => $this->notes,
            ],
        );
    }
}
