<?php

namespace App\Mail;

use App\Models\Pet;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PetAddedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $ownerName,
        public Pet $pet
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '🐾 ' . $this->pet->name . '\'s Digital Canine Passport is Ready!',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.pet_added',
            with: [
                'ownerName' => $this->ownerName,
                'pet' => $this->pet->load('breed'),
            ],
        );
    }
}
