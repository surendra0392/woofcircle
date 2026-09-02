<?php

namespace App\Mail;

use App\Models\StudService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class StudServiceCreatedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $ownerName,
        public StudService $studService
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Stud Service Listed: ' . $this->studService->title,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.stud_service_created',
            with: [
                'ownerName' => $this->ownerName,
                'studService' => $this->studService,
            ],
        );
    }
}
