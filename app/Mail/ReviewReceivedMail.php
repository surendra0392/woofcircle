<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReviewReceivedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $recipientName,
        public string $reviewerName,
        public string $itemTitle,
        public int $rating,
        public ?string $comment = null
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New ' . $this->rating . '-Star Review Received: ' . $this->itemTitle,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.review_received',
            with: [
                'recipientName' => $this->recipientName,
                'reviewerName' => $this->reviewerName,
                'itemTitle' => $this->itemTitle,
                'rating' => $this->rating,
                'comment' => $this->comment,
            ],
        );
    }
}
