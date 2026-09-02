<?php

namespace App\Mail;

use App\Models\Adoption;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdoptionCreatedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $userName,
        public Adoption $adoption
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Adoption Listing Created: ' . $this->adoption->title,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.adoption_created',
            with: [
                'userName' => $this->userName,
                'adoption' => $this->adoption,
            ],
        );
    }
}
