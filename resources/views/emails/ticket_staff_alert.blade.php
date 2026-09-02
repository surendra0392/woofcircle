@extends('emails.layout')

@section('content')
    <h2>New Support Ticket Alert: #{{ $ticket->id }}</h2>

    <p>A new support ticket has been submitted by a member and is awaiting assignment:</p>

    <div class="info-box">
        <p><strong>Ticket ID:</strong> #{{ $ticket->id }}</p>
        <p><strong>Requester Name:</strong> {{ $userName }}</p>
        <p><strong>Requester Email:</strong> <a href="mailto:{{ $userEmail }}">{{ $userEmail }}</a></p>
        <p><strong>Subject:</strong> {{ $ticket->subject }}</p>
        <p><strong>Priority:</strong> <span style="color: {{ $ticket->priority === 'critical' ? '#d9534f' : '#333' }}; font-weight: bold;">{{ strtoupper($ticket->priority) }}</span></p>
        <p><strong>SLA Target:</strong> {{ $ticket->due_at ? $ticket->due_at->setTimezone('Asia/Kolkata')->format('M d, Y h:i A') : 'N/A' }}</p>
    </div>

    <div style="background: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <h4 style="margin: 0 0 10px 0; color: #1a1a1a;">Ticket Message:</h4>
        <p style="white-space: pre-wrap; margin: 0; color: #333;">{{ $ticket->message }}</p>
    </div>

    <div style="text-align: center;">
        <a href="{{ route('support.login') }}" class="btn">Open Support Desk Queue</a>
    </div>
@endsection
