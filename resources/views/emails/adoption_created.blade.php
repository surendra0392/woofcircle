@extends('emails.layout')

@section('content')
    <h2>Adoption Listing Created! 💛</h2>

    <p>Dear {{ $userName }},</p>
    <p>Your adoption listing <strong>{{ $adoption->title }}</strong> has been posted on WoofCircle Sanctuary.</p>

    <div class="info-box">
        <p><strong>Dog Name / Title:</strong> {{ $adoption->title }}</p>
        <p><strong>Breed:</strong> {{ $adoption->breed?->name ?? 'Indie / Mixed' }}</p>
        <p><strong>Location:</strong> {{ $adoption->city?->name }}, {{ $adoption->state?->name }}</p>
        <p><strong>Adoption Fee:</strong> {{ $adoption->adoption_fee > 0 ? '₹' . number_format($adoption->adoption_fee) : 'Free / Rescue' }}</p>
        <p><strong>Status:</strong> Ready for Forever Home</p>
    </div>

    <p>Thank you for helping provide a loving home to dogs in need. Interested adopters will be able to message you directly through WoofCircle.</p>

    <div style="text-align: center;">
        <a href="{{ route('dashboard.adoptions.index') }}" class="btn">Manage Adoptions</a>
    </div>
@endsection
