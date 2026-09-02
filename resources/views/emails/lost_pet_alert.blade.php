@extends('emails.layout')

@section('content')
    <h2 style="color: #d32f2f;">🚨 URGENT: Lost Dog Alert in Your Area</h2>

    <p>Dear {{ $recipientName }},</p>
    <p>A dog has been reported missing near your locality. Please check the details below and keep an eye out.</p>

    <div class="info-box" style="border-left-color: #d32f2f;">
        <p><strong>Pet Name:</strong> {{ $pet->name }}</p>
        <p><strong>Breed:</strong> {{ $pet->breed?->name ?? 'Mixed/Other' }}</p>
        <p><strong>Gender / Color:</strong> {{ ucfirst($pet->gender) }} {{ $pet->color ? '• ' . $pet->color : '' }}</p>
        <p><strong>Last Seen Location:</strong> {{ $pet->lost_location }}</p>
        @if($pet->lost_description)
        <p><strong>Description / Notes:</strong> {{ $pet->lost_description }}</p>
        @endif
        @if($pet->passport_number)
        <p><strong>Digital Passport / Microchip:</strong> {{ $pet->passport_number }}</p>
        @endif
    </div>

    @if($owner)
    <div style="background: #fff8e1; border: 1px solid #ffe082; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <h4 style="margin: 0 0 8px 0; color: #795548;">Owner Contact Info:</h4>
        <p style="margin: 4px 0;"><strong>Name:</strong> {{ $owner->name }}</p>
        @if($owner->mobile_number)
        <p style="margin: 4px 0;"><strong>Phone:</strong> <a href="tel:{{ $owner->mobile_number }}">{{ $owner->mobile_number }}</a></p>
        @endif
        <p style="margin: 4px 0;"><strong>Email:</strong> <a href="mailto:{{ $owner->email }}">{{ $owner->email }}</a></p>
    </div>
    @endif

    <div style="text-align: center;">
        <a href="{{ route('lost-pets.index') }}" class="btn" style="background-color: #d32f2f; color: white !important;">View Live Lost Pet Radar</a>
    </div>
@endsection
