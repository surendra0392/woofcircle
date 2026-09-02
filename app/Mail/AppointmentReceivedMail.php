<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AppointmentReceivedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $providerName,
        public string $petParentName,
        public string $petParentEmail,
        public string $petName,
        public string $serviceType,
        public string $appointmentDate,
        public ?string $notes = null
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Booking Request from ' . $this->petParentName,
            replyTo: [$this->petParentEmail],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.appointment_received',
            with: [
                'providerName' => $this->providerName,
                'petParentName' => $this->petParentName,
                'petParentEmail' => $this->petParentEmail,
                'petName' => $this->petName,
                'serviceType' => $this->serviceType,
                'appointmentDate' => $this->appointmentDate,
                'notes' => $this->notes,
            ],
        );
    }
}
