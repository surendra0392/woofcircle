@extends('emails.layout')

@section('content')
    <h2>Professional Profile Updated! 🌟</h2>

    <p>Dear {{ $userName }},</p>
    <p>Your professional <strong>{{ ucfirst($profileType) }}</strong> profile on WoofCircle has been saved and updated successfully.</p>

    <div class="info-box">
        <p><strong>Professional Name / Facility:</strong> {{ $profileName }}</p>
        <p><strong>Profile Category:</strong> {{ ucfirst($profileType) }}</p>
        <p><strong>Status:</strong> Active Sanctuary Directory Listing</p>
    </div>

    <p>Your profile is now discoverable by thousands of pet parents looking for trusted canine professionals across India.</p>

    <div style="text-align: center;">
        <a href="{{ route('dashboard') }}" class="btn">View & Manage Profile</a>
    </div>
@endsection
