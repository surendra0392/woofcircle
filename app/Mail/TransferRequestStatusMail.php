<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TransferRequestStatusMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $buyerName,
        public string $breederName,
        public string $petName,
        public string $status
    ) {}

    public function envelope(): Envelope
    {
        $subject = $this->status === 'pending_admin' 
            ? 'Puppy Transfer Approved by Breeder: ' . $this->petName
            : 'Puppy Transfer Request Update: ' . $this->petName;

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.transfer_status',
            with: [
                'buyerName' => $this->buyerName,
                'breederName' => $this->breederName,
                'petName' => $this->petName,
                'status' => $this->status,
            ],
        );
    }
}
