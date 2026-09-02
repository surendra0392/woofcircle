<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ListingApprovedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $userName,
        public string $itemType,
        public string $itemTitle,
        public string $viewUrl
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '🎉 Approved: Your ' . ucfirst($this->itemType) . ' is Now Live on WoofCircle',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.listing_approved',
            with: [
                'userName' => $this->userName,
                'itemType' => $this->itemType,
                'itemTitle' => $this->itemTitle,
                'viewUrl' => $this->viewUrl,
            ],
        );
    }
}
