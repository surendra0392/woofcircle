<?php

namespace App\Mail;

use App\Models\CareerPosition;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class CareerApplicationReceivedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $applicantName,
        public string $email,
        public string $phone,
        public CareerPosition $position,
        public ?string $coverLetter = null,
        public ?int $experienceYears = null,
        public ?string $currentCompany = null,
        public ?string $linkedinUrl = null,
        public ?string $portfolioUrl = null,
        public ?string $resumePath = null
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '[New Application] ' . $this->position->title . ' - ' . $this->applicantName,
            replyTo: [$this->email],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.career_received',
            with: [
                'applicantName' => $this->applicantName,
                'email' => $this->email,
                'phone' => $this->phone,
                'positionTitle' => $this->position->title,
                'department' => $this->position->department,
                'coverLetter' => $this->coverLetter,
                'experienceYears' => $this->experienceYears,
                'currentCompany' => $this->currentCompany,
                'linkedinUrl' => $this->linkedinUrl,
                'portfolioUrl' => $this->portfolioUrl,
            ],
        );
    }

    public function attachments(): array
    {
        $attachments = [];
        if ($this->resumePath && Storage::disk('public')->exists($this->resumePath)) {
            $attachments[] = Attachment::fromStorageDisk('public', $this->resumePath);
        }
        return $attachments;
    }
}
