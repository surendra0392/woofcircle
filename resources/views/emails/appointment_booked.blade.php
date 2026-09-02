@extends('emails.layout')

@section('content')
    <h2>Appointment Confirmed! 📅</h2>

    <p>Dear {{ $petParentName }},</p>
    <p>Your appointment request for <strong>{{ $petName }}</strong> has been scheduled successfully.</p>

    <div class="info-box">
        <p><strong>Service / Type:</strong> {{ $serviceType }}</p>
        <p><strong>Provider / Facility:</strong> {{ $providerName }}</p>
        <p><strong>Pet Name:</strong> {{ $petName }}</p>
        <p><strong>Appointment Date & Time:</strong> {{ $appointmentDate }}</p>
        <p><strong>Status:</strong> Confirmed</p>
    </div>

    @if($notes)
    <div style="background: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <h4 style="margin: 0 0 10px 0; color: #1a1a1a;">Appointment Notes:</h4>
        <p style="white-space: pre-wrap; margin: 0; color: #333;">{{ $notes }}</p>
    </div>
    @endif

    <p>Please arrive 10 minutes prior to your scheduled time. If you need to reschedule or cancel, you can manage your appointments in your pet dashboard.</p>

    <div style="text-align: center;">
        <a href="{{ route('dashboard') }}" class="btn">View Appointments</a>
    </div>
@endsection
