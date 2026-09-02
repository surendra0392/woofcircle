<?php

namespace App\Mail;

use App\Models\SupportTicket;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SupportTicketStaffAlertMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $userName,
        public string $userEmail,
        public SupportTicket $ticket
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '[New Support Ticket #' . $this->ticket->id . '] ' . $this->ticket->subject,
            replyTo: [$this->userEmail],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.ticket_staff_alert',
            with: [
                'userName' => $this->userName,
                'userEmail' => $this->userEmail,
                'ticket' => $this->ticket,
            ],
        );
    }
}
