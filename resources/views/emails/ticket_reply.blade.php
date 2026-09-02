@extends('emails.layout')

@section('content')
    <h2>New Reply on Ticket #{{ $ticket->id }}</h2>

    <p>Dear {{ $userName }},</p>
    <p>Our support team has added a new update to your ticket <strong>#{{ $ticket->id }}: {{ $ticket->subject }}</strong>.</p>

    <div class="info-box">
        <p><strong>Replied By:</strong> {{ $agentName }} (WoofCircle Support)</p>
        <p><strong>Ticket Status:</strong> {{ ucfirst($ticket->status) }}</p>
    </div>

    <div style="background: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <h4 style="margin: 0 0 10px 0; color: #1a1a1a;">Support Agent Message:</h4>
        <p style="white-space: pre-wrap; margin: 0; color: #333;">{{ $replyMessage }}</p>
    </div>

    <div style="text-align: center;">
        <a href="{{ route('dashboard.support.show', $ticket->id) }}" class="btn">View & Reply to Ticket</a>
    </div>
@endsection
