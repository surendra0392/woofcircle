<?php

namespace App\Mail;

use App\Models\CareerPosition;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CareerApplicationConfirmationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $applicantName,
        public CareerPosition $position
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Application Received: ' . $this->position->title . ' at WoofCircle',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.career_confirmation',
            with: [
                'applicantName' => $this->applicantName,
                'positionTitle' => $this->position->title,
                'department' => $this->position->department,
                'location' => $this->position->location,
            ],
        );
    }
}
