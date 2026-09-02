@extends('emails.layout')

@section('content')
    <h2>Digital Canine Passport Generated! 🐶</h2>

    <p>Dear {{ $ownerName }},</p>
    <p>Congratulations! <strong>{{ $pet->name }}</strong> has been officially registered in the <strong>WoofCircle Sanctuary</strong>.</p>

    <div class="info-box">
        <p><strong>Pet Name:</strong> {{ $pet->name }}</p>
        <p><strong>Breed:</strong> {{ $pet->breed?->name ?? 'Mixed/Other' }}</p>
        <p><strong>Gender:</strong> {{ ucfirst($pet->gender) }}</p>
        <p><strong>Digital Passport Number:</strong> <span style="font-family: monospace; font-weight: bold; color: #c4a163;">{{ $pet->passport_number }}</span></p>
        @if($pet->microchip_number)
        <p><strong>Microchip / Tag:</strong> {{ $pet->microchip_number }}</p>
        @endif
        <p><strong>Registration Date:</strong> {{ now()->setTimezone('Asia/Kolkata')->format('M d, Y') }}</p>
    </div>

    <p>With {{ $pet->name }}'s digital passport, you can now:</p>
    <ul>
        <li>Log and track all vaccination histories with automated due-date reminders.</li>
        <li>Securely store clinical records, diagnostic files, and vet reports.</li>
        <li>Generate and download an official verified Canine Passport PDF.</li>
    </ul>

    <div style="text-align: center;">
        <a href="{{ route('pets.passport.show', $pet->passport_number) }}" class="btn">View Digital Passport</a>
    </div>
@endsection
