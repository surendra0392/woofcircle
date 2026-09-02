@extends('emails.layout')

@section('content')
    <h2>Welcome to WoofCircle, {{ $user->name }}! 🐾</h2>

    <p>We are delighted to welcome you to <strong>WoofCircle</strong>, India's premier community dedicated to dogs, ethical breeding, certified trainers, trusted veterinary clinics, and loving pet parents.</p>

    <div class="info-box">
        <p><strong>Registered Email:</strong> {{ $user->email }}</p>
        <p><strong>Mobile Number:</strong> {{ $user->mobile_number ?? 'Not specified' }}</p>
        <p><strong>Account Status:</strong> Active Sanctuary Member</p>
    </div>

    <p>Here is what you can do right now on WoofCircle:</p>
    <ul>
        <li><strong>Register your Dogs:</strong> Manage digital pet passports, vaccination schedules, and health records.</li>
        <li><strong>Explore Verified Marketplace:</strong> Browse ethical litters, champion studs, and rescues looking for loving homes.</li>
        <li><strong>Find Verified Professionals:</strong> Connect with nearby clinics, trainers, and luxury boarding facilities.</li>
    </ul>

    <div style="text-align: center;">
        <a href="{{ route('dashboard') }}" class="btn">Access Your Dashboard</a>
    </div>
@endsection
