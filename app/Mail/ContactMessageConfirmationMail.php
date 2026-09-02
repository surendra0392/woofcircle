<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactMessageConfirmationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $name,
        public string $email,
        public string $subjectText,
        public string $messageText
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'We have received your message: ' . $this->subjectText,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.contact_confirmation',
            with: [
                'name' => $this->name,
                'email' => $this->email,
                'subjectText' => $this->subjectText,
                'messageText' => $this->messageText,
            ],
        );
    }
}
