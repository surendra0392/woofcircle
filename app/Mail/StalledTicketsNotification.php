<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;

class StalledTicketsNotification extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * The stalled tickets grouped by category.
     */
    public Collection $stalledInHr;

    public Collection $stalledAfterReturn;

    public Collection $chronicHandoffs;

    public int $totalStalled;

    /**
     * Create a new message instance.
     */
    public function __construct(Collection $tickets)
    {
        $this->stalledInHr = $tickets->where('attention_category', 'stalled_in_hr')->values();
        $this->stalledAfterReturn = $tickets->where('attention_category', 'stalled_after_return')->values();
        $this->chronicHandoffs = $tickets->where('attention_category', 'chronic_handoff')->values();
        $this->totalStalled = $tickets->count();
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = $this->totalStalled === 0
            ? '✅ No stalled tickets — all handoffs flowing normally'
            : "⚠️ {$this->totalStalled} stalled ticket(s) need attention";

        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.stalled-tickets',
        );
    }
}
