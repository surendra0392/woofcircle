@extends('emails.layout')

@section('content')
    <h2>Your {{ ucfirst($itemType) }} Listing is Approved & Live! 🎉</h2>

    <p>Dear {{ $userName }},</p>
    <p>Great news! Your <strong>{{ $itemTitle }}</strong> has passed verification and is now live on the public <strong>WoofCircle Sanctuary</strong>.</p>

    <div class="info-box">
        <p><strong>Listing Title / Name:</strong> {{ $itemTitle }}</p>
        <p><strong>Category:</strong> {{ ucfirst($itemType) }}</p>
        <p><strong>Status:</strong> <span style="color: #2e7d32; font-weight: bold;">Verified & Published</span></p>
        <p><strong>Approved At:</strong> {{ now()->setTimezone('Asia/Kolkata')->format('M d, Y h:i A') }}</p>
    </div>

    <p>Pet parents and enthusiasts across India can now discover, view, and interact with your listing.</p>

    <div style="text-align: center;">
        <a href="{{ $viewUrl }}" class="btn">View Live Listing</a>
    </div>
@endsection
