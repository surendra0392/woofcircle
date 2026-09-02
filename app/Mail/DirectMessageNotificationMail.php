<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DirectMessageNotificationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $recipientName,
        public string $senderName,
        public string $messageSnippet,
        public string $conversationUrl
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '💬 New Message from ' . $this->senderName . ' on WoofCircle',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.direct_message',
            with: [
                'recipientName' => $this->recipientName,
                'senderName' => $this->senderName,
                'messageSnippet' => $this->messageSnippet,
                'conversationUrl' => $this->conversationUrl,
            ],
        );
    }
}
