<?php

namespace App\Mail;

use App\Models\Litter;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class LitterCreatedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $breederName,
        public Litter $litter
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Litter Listing Submitted: ' . $this->litter->title,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.litter_created',
            with: [
                'breederName' => $this->breederName,
                'litter' => $this->litter,
            ],
        );
    }
}
