@extends('emails.layout')

@section('content')
    <h2>Stud Service Listing Created! 🐕</h2>

    <p>Dear {{ $ownerName }},</p>
    <p>Your stud service listing <strong>{{ $studService->title }}</strong> has been submitted to the WoofCircle stud registry.</p>

    <div class="info-box">
        <p><strong>Dog Name / Title:</strong> {{ $studService->title }}</p>
        <p><strong>Breed:</strong> {{ $studService->breed?->name ?? 'N/A' }}</p>
        <p><strong>Location:</strong> {{ $studService->city?->name }}, {{ $studService->state?->name }}</p>
        @if($studService->stud_fee)
        <p><strong>Stud Fee:</strong> ₹{{ number_format($studService->stud_fee) }}</p>
        @endif
        <p><strong>Availability:</strong> {{ $studService->is_available ? 'Available' : 'Currently Unavailable' }}</p>
    </div>

    <p>Pet parents and fellow breeders can now discover your stud dog and request consultations.</p>

    <div style="text-align: center;">
        <a href="{{ route('dashboard.stud-services.index') }}" class="btn">Manage Stud Listings</a>
    </div>
@endsection
