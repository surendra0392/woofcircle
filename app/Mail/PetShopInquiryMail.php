<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PetShopInquiryMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $shopName,
        public string $senderName,
        public string $senderEmail,
        public string $messageText
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Inquiry for ' . $this->shopName . ' on WoofCircle',
            replyTo: [$this->senderEmail],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.petshop_inquiry',
            with: [
                'shopName' => $this->shopName,
                'senderName' => $this->senderName,
                'senderEmail' => $this->senderEmail,
                'messageText' => $this->messageText,
            ],
        );
    }
}
