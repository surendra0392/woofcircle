@extends('emails.layout')

@section('content')
    <h2>New Contact Inquiry Received</h2>

    <p>A new visitor inquiry has been submitted through the public contact form:</p>

    <div class="info-box">
        <p><strong>Sender Name:</strong> {{ $name }}</p>
        <p><strong>Email Address:</strong> <a href="mailto:{{ $email }}">{{ $email }}</a></p>
        <p><strong>Subject:</strong> {{ $subjectText }}</p>
        <p><strong>Date/Time:</strong> {{ now()->setTimezone('Asia/Kolkata')->format('M d, Y h:i A') }}</p>
    </div>

    <div style="background: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <h4 style="margin: 0 0 10px 0; color: #1a1a1a;">Message Content:</h4>
        <p style="white-space: pre-wrap; margin: 0; color: #333;">{{ $messageText }}</p>
    </div>

    <div style="text-align: center;">
        <a href="mailto:{{ $email }}?subject=Re: {{ rawurlencode($subjectText) }}" class="btn">Reply Directly to Sender</a>
    </div>
@endsection
