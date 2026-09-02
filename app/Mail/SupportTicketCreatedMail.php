<?php

namespace App\Mail;

use App\Models\SupportTicket;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SupportTicketCreatedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $userName,
        public SupportTicket $ticket
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Support Ticket Received: #' . $this->ticket->id . ' - ' . $this->ticket->subject,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.ticket_created',
            with: [
                'userName' => $this->userName,
                'ticket' => $this->ticket,
            ],
        );
    }
}
