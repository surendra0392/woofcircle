@extends('emails.layout')

@section('content')
    <h2>Puppy Ownership / Transfer Request Received! 🐶</h2>

    <p>Dear {{ $breederName }},</p>
    <p>A pet parent has requested ownership transfer / purchase inquiry for a puppy from your litter <strong>{{ $litterTitle }}</strong>.</p>

    <div class="info-box">
        <p><strong>Litter Title:</strong> {{ $litterTitle }}</p>
        <p><strong>Requested By:</strong> {{ $requesterName }}</p>
        <p><strong>Requester Email:</strong> <a href="mailto:{{ $requesterEmail }}">{{ $requesterEmail }}</a></p>
        <p><strong>Date Requested:</strong> {{ now()->setTimezone('Asia/Kolkata')->format('M d, Y h:i A') }}</p>
    </div>

    @if($notes)
    <div style="background: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <h4 style="margin: 0 0 10px 0; color: #1a1a1a;">Buyer Note / Request:</h4>
        <p style="white-space: pre-wrap; margin: 0; color: #333;">{{ $notes }}</p>
    </div>
    @endif

    <p>Please review the request and approve or reject the digital transfer in your breeder dashboard.</p>

    <div style="text-align: center;">
        <a href="{{ route('breeder.litters.index') }}" class="btn">View & Manage Requests</a>
    </div>
@endsection
