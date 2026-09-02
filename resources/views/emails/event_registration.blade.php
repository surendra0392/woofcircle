@extends('emails.layout')

@section('content')
    <h2>Event Registration Confirmed! 🎪</h2>

    <p>Dear {{ $userName }},</p>
    <p>You have successfully registered for <strong>{{ $event->title }}</strong> on WoofCircle.</p>

    <div class="info-box">
        <p><strong>Event:</strong> {{ $event->title }}</p>
        <p><strong>Date & Time:</strong> {{ $event->start_date ? \Carbon\Carbon::parse($event->start_date)->format('M d, Y') : 'TBA' }} {{ $event->start_time ? 'at ' . $event->start_time : '' }}</p>
        <p><strong>Venue / Location:</strong> {{ $event->location ?? ($event->city?->name . ', ' . $event->state?->name) }}</p>
        <p><strong>Registration Status:</strong> <span style="color: #2e7d32; font-weight: bold;">Confirmed</span></p>
    </div>

    @if($event->description)
    <div style="background: #fdfdfd; border: 1px solid #eee; border-radius: 8px; padding: 14px; margin: 20px 0;">
        <h4 style="margin: 0 0 6px 0; color: #1a1a1a;">About the Event:</h4>
        <p style="color: #444; margin: 0; font-size: 14px;">{{ \Illuminate\Support\Str::limit(strip_tags($event->description), 200) }}</p>
    </div>
    @endif

    <div style="text-align: center;">
        <a href="{{ route('community.events.show', $event->slug) }}" class="btn">View Event Details</a>
    </div>
@endsection
