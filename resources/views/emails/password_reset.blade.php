@extends('emails.layout')

@section('content')
    <h2>Reset Your Password</h2>

    <p>Hello {{ $name }},</p>
    <p>You are receiving this email because we received a password reset request for your <strong>WoofCircle</strong> account.</p>

    <div class="info-box">
        <p><strong>Account Email:</strong> {{ $email }}</p>
        <p><strong>Request Time:</strong> {{ now()->setTimezone('Asia/Kolkata')->format('M d, Y h:i A') }}</p>
        <p><strong>Link Expiry:</strong> This password reset link will expire in 60 minutes.</p>
    </div>

    <div style="text-align: center; margin: 25px 0;">
        <a href="{{ $resetUrl }}" class="btn">Reset Password</a>
    </div>

    <p style="font-size: 13px; color: #666;">
        If you did not request a password reset, no further action is required. Your account remains secure.
    </p>

    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">

    <p style="font-size: 11px; color: #888; word-break: break-all;">
        If you're having trouble clicking the button, copy and paste the URL below into your web browser:<br>
        <a href="{{ $resetUrl }}" style="color: #c4a163;">{{ $resetUrl }}</a>
    </p>
@endsection
