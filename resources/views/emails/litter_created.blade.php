@extends('emails.layout')

@section('content')
    <h2>Puppy / Litter Listing Submitted! 🐾</h2>

    <p>Dear {{ $breederName }},</p>
    <p>Your puppy/litter listing <strong>{{ $litter->title }}</strong> has been created and submitted successfully.</p>

    <div class="info-box">
        <p><strong>Listing Title:</strong> {{ $litter->title }}</p>
        <p><strong>Breed:</strong> {{ $litter->breed?->name ?? 'Mixed/Other' }}</p>
        <p><strong>Location:</strong> {{ $litter->city?->name }}, {{ $litter->state?->name }}</p>
        <p><strong>Status:</strong> {{ ucfirst($litter->status) }}</p>
        @if($litter->price)
        <p><strong>Listed Price:</strong> ₹{{ number_format($litter->price) }}</p>
        @endif
        <p><strong>Verification:</strong> Pending Sanctuary Quality Verification</p>
    </div>

    <p>Our verification team reviews all litter submissions to ensure ethical standards, proper certifications (KCI if applicable), and accurate details. Once approved, your listing will be prominently featured on the public marketplace.</p>

    <div style="text-align: center;">
        <a href="{{ route('breeder.litters.index') }}" class="btn">Manage Your Litters</a>
    </div>
@endsection
