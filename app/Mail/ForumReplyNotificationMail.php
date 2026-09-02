<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ForumReplyNotificationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $authorName,
        public string $replierName,
        public string $threadTitle,
        public string $categoryName,
        public string $replySnippet,
        public string $threadUrl
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Reply on: ' . $this->threadTitle . ' - WoofCircle Community',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.forum_reply',
            with: [
                'authorName' => $this->authorName,
                'replierName' => $this->replierName,
                'threadTitle' => $this->threadTitle,
                'categoryName' => $this->categoryName,
                'replySnippet' => $this->replySnippet,
                'threadUrl' => $this->threadUrl,
            ],
        );
    }
}
