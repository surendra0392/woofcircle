@extends('emails.layout')

@section('content')
    <h2>Application Received: {{ $positionTitle }}</h2>

    <p>Dear {{ $applicantName }},</p>

    <p>Thank you for your interest in joining the <strong>WoofCircle</strong> team! We have successfully received your application for the <strong>{{ $positionTitle }}</strong> position.</p>

    <div class="info-box">
        <p><strong>Position:</strong> {{ $positionTitle }}</p>
        <p><strong>Department / Location:</strong> {{ $department }} ({{ $location }})</p>
        <p><strong>Applicant Name:</strong> {{ $applicantName }}</p>
        <p><strong>Application Status:</strong> Under HR Review</p>
    </div>

    <p>Our talent acquisition team carefully reviews every profile. If your skills and experience align with the requirements of this role, we will reach out to coordinate the next steps in our hiring process.</p>

    <div style="text-align: center;">
        <a href="{{ route('careers') }}" class="btn">View All Openings</a>
    </div>
@endsection
