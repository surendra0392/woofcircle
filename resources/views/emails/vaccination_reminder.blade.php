@extends('emails.layout')

@section('content')
    <h2>Health & Vaccination Reminder for {{ $petName }} 💉</h2>

    <p>Hello,</p>
    <p>This is a friendly reminder that your pet <strong>{{ $petName }}</strong> has an upcoming vaccination scheduled.</p>

    <div class="info-box">
        <p><strong>Pet Name:</strong> {{ $petName }}</p>
        <p><strong>Vaccine:</strong> {{ $vaccineName }}</p>
        <p><strong>Due Date:</strong> <span style="color: #c4a163; font-weight: bold;">{{ $dueDate }}</span></p>
        @if($vetName)
        <p><strong>Veterinarian / Clinic:</strong> {{ $vetName }}</p>
        @endif
    </div>

    <p>Keeping your pet's immunizations up to date is vital for their long-term health and immunity. Please schedule an appointment with your veterinarian.</p>

    <div style="text-align: center;">
        <a href="{{ $dashboardUrl }}" class="btn">View Pet Health Records</a>
    </div>
@endsection
