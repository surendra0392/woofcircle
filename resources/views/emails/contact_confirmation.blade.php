@extends('emails.layout')

@section('content')
    <h2>We Received Your Message, {{ $name }}!</h2>

    <p>Thank you for reaching out to <strong>WoofCircle</strong>. Our dedicated concierge team has received your message and will review it promptly.</p>

    <div class="info-box">
        <p><strong>Subject:</strong> {{ $subjectText }}</p>
        <p><strong>Message Summary:</strong></p>
        <p style="white-space: pre-wrap; font-style: italic; color: #555;">{{ $messageText }}</p>
    </div>

    <p>We typically reply within 24 business hours. If your inquiry requires immediate assistance, please visit our <a href="{{ route('help-center') }}" style="color: #c4a163; font-weight: bold;">Help Center</a>.</p>

    <div style="text-align: center;">
        <a href="{{ route('home') }}" class="btn">Return to Sanctuary</a>
    </div>
@endsection
