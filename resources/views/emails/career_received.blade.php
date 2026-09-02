@extends('emails.layout')

@section('content')
    <h2>New Candidate Application: {{ $positionTitle }}</h2>

    <p>A new job application has been submitted through the WoofCircle Careers portal:</p>

    <div class="info-box">
        <p><strong>Applicant Name:</strong> {{ $applicantName }}</p>
        <p><strong>Email:</strong> <a href="mailto:{{ $email }}">{{ $email }}</a></p>
        <p><strong>Phone:</strong> {{ $phone }}</p>
        <p><strong>Position:</strong> {{ $positionTitle }} ({{ $department }})</p>
        @if($experienceYears !== null)
        <p><strong>Experience:</strong> {{ $experienceYears }} years</p>
        @endif
        @if($currentCompany)
        <p><strong>Current Company:</strong> {{ $currentCompany }}</p>
        @endif
        @if($linkedinUrl)
        <p><strong>LinkedIn:</strong> <a href="{{ $linkedinUrl }}" target="_blank">{{ $linkedinUrl }}</a></p>
        @endif
        @if($portfolioUrl)
        <p><strong>Portfolio:</strong> <a href="{{ $portfolioUrl }}" target="_blank">{{ $portfolioUrl }}</a></p>
        @endif
    </div>

    @if($coverLetter)
    <div style="background: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <h4 style="margin: 0 0 10px 0; color: #1a1a1a;">Cover Letter / Note:</h4>
        <p style="white-space: pre-wrap; margin: 0; color: #333;">{{ $coverLetter }}</p>
    </div>
    @endif

    <div style="text-align: center;">
        <a href="{{ route('hr.login') }}" class="btn">Review Application in HR Portal</a>
    </div>
@endsection
