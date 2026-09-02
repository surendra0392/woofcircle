<?php

namespace App\Mail;

use App\Models\SupportTicket;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SupportTicketReplyMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $userName,
        public string $agentName,
        public SupportTicket $ticket,
        public string $replyMessage
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Update on Ticket #' . $this->ticket->id . ': ' . $this->ticket->subject,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.ticket_reply',
            with: [
                'userName' => $this->userName,
                'agentName' => $this->agentName,
                'ticket' => $this->ticket,
                'replyMessage' => $this->replyMessage,
            ],
        );
    }
}
