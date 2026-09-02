@extends('emails.layout')

@section('content')
    <h2>Support Ticket Created: #{{ $ticket->id }}</h2>

    <p>Dear {{ $userName }},</p>
    <p>Thank you for contacting WoofCircle Support. Your support ticket has been logged with our team.</p>

    <div class="info-box">
        <p><strong>Ticket ID:</strong> #{{ $ticket->id }}</p>
        <p><strong>Subject:</strong> {{ $ticket->subject }}</p>
        <p><strong>Category:</strong> {{ ucfirst($ticket->category) }}</p>
        <p><strong>Priority:</strong> {{ ucfirst($ticket->priority) }}</p>
        <p><strong>Expected Response Time:</strong> Within {{ $ticket->due_at ? $ticket->due_at->diffForHumans() : '24 hours' }}</p>
    </div>

    <div style="background: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <h4 style="margin: 0 0 10px 0; color: #1a1a1a;">Your Message:</h4>
        <p style="white-space: pre-wrap; margin: 0; color: #333;">{{ $ticket->message }}</p>
    </div>

    <div style="text-align: center;">
        <a href="{{ route('dashboard.support.show', $ticket->id) }}" class="btn">Track Your Ticket</a>
    </div>
@endsection
