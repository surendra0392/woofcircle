<?php

namespace App\Mail;

use App\Models\Vaccination;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VaccinationReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    public $vaccination;

    /**
     * Create a new message instance.
     */
    public function __construct(Vaccination $vaccination)
    {
        $this->vaccination = $vaccination;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Upcoming Vaccination Reminder: ' . $this->vaccination->pet->name,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.vaccination_reminder',
            with: [
                'petName' => $this->vaccination->pet->name,
                'vaccineName' => $this->vaccination->vaccine_name,
                'dueDate' => $this->vaccination->next_due_date->format('F j, Y'),
                'vetName' => $this->vaccination->vet ? $this->vaccination->vet->business_name : $this->vaccination->vet_name,
                'dashboardUrl' => route('dashboard'),
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
