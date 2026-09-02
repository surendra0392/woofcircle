@extends('emails.layout')

@section('content')
    <h2>Membership Privilege Activated! 👑</h2>

    <p>Dear {{ $userName }},</p>
    <p>Congratulations! Your <strong>{{ $tierName }}</strong> membership on WoofCircle has been successfully activated.</p>

    <div class="info-box">
        <p><strong>Membership Tier:</strong> {{ $tierName }}</p>
        <p><strong>Billing Frequency:</strong> {{ ucfirst($billing) }}</p>
        <p><strong>Valid Until:</strong> {{ $validUntil }}</p>
        <p><strong>Status:</strong> Active Sanctuary Privilege Member</p>
    </div>

    <p>Your unlocked membership privileges include:</p>
    <ul>
        <li><strong>Expanded Listing Allowance:</strong> Create and showcase verified litters, champion studs, and adoptions.</li>
        <li><strong>Priority Sanctuary Placement:</strong> Elevated ranking across discovery searches and category pages.</li>
        <li><strong>Digital Canine Records:</strong> Unlimited pet passports, medical tracking, and vaccination reminders.</li>
    </ul>

    <div style="text-align: center;">
        <a href="{{ route('dashboard') }}" class="btn">Go to Sanctuary Dashboard</a>
    </div>
@endsection
