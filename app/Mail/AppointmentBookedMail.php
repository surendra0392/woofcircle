<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AppointmentBookedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $petParentName,
        public string $providerName,
        public string $petName,
        public string $serviceType,
        public string $appointmentDate,
        public ?string $notes = null
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Appointment Confirmed: ' . $this->serviceType . ' with ' . $this->providerName,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.appointment_booked',
            with: [
                'petParentName' => $this->petParentName,
                'providerName' => $this->providerName,
                'petName' => $this->petName,
                'serviceType' => $this->serviceType,
                'appointmentDate' => $this->appointmentDate,
                'notes' => $this->notes,
            ],
        );
    }
}
