@extends('emails.layout')

@section('content')
    <h2>Security Alert: Admin Login Detected 🛡️</h2>

    <p>Hello {{ $admin->name ?? 'Administrator' }},</p>
    <p>A successful login to the <strong>WoofCircle Administration Portal</strong> was detected for your account.</p>

    <div class="info-box">
        <p><strong>Account Email:</strong> {{ $admin->email }}</p>
        <p><strong>IP Address:</strong> {{ $ip }}</p>
        <p><strong>Login Time:</strong> {{ $time }}</p>
        <p><strong>Browser / Device:</strong> {{ $userAgent }}</p>
    </div>

    <p style="font-size: 13px; color: #666;">
        If this was you, you can safely ignore this notification. If you did not perform this login, please change your password immediately and contact security support.
    </p>

    <div style="text-align: center;">
        <a href="{{ rtrim(config('app.url', 'https://woofcircle.in'), '/') . '/admin/dashboard' }}" class="btn">Admin Control Center</a>
    </div>
@endsection
