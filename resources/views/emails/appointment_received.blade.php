@extends('emails.layout')

@section('content')
    <h2>New Appointment Booking Received! 🗓️</h2>

    <p>Dear {{ $providerName }},</p>
    <p>You have received a new booking request on WoofCircle:</p>

    <div class="info-box">
        <p><strong>Customer Name:</strong> {{ $petParentName }}</p>
        <p><strong>Customer Email:</strong> <a href="mailto:{{ $petParentEmail }}">{{ $petParentEmail }}</a></p>
        <p><strong>Pet Name:</strong> {{ $petName }}</p>
        <p><strong>Service / Session:</strong> {{ $serviceType }}</p>
        <p><strong>Scheduled Date & Time:</strong> {{ $appointmentDate }}</p>
    </div>

    @if($notes)
    <div style="background: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <h4 style="margin: 0 0 10px 0; color: #1a1a1a;">Customer Notes:</h4>
        <p style="white-space: pre-wrap; margin: 0; color: #333;">{{ $notes }}</p>
    </div>
    @endif

    <div style="text-align: center;">
        <a href="{{ route('dashboard.business.bookings') }}" class="btn">Manage Bookings</a>
    </div>
@endsection
