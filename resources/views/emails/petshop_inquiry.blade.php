@extends('emails.layout')

@section('content')
    <h2>New Customer Inquiry for {{ $shopName }}</h2>

    <p>Hello,</p>
    <p>A customer on WoofCircle has sent an inquiry regarding your shop, <strong>{{ $shopName }}</strong>.</p>

    <div class="info-box">
        <p><strong>Sender Name:</strong> {{ $senderName }}</p>
        <p><strong>Sender Email:</strong> <a href="mailto:{{ $senderEmail }}">{{ $senderEmail }}</a></p>
        <p><strong>Shop Name:</strong> {{ $shopName }}</p>
    </div>

    <div style="background: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <h4 style="margin: 0 0 10px 0; color: #1a1a1a;">Customer Message:</h4>
        <p style="white-space: pre-wrap; margin: 0; color: #333;">{{ $messageText }}</p>
    </div>

    <div style="text-align: center;">
        <a href="{{ route('dashboard.messages.index') }}" class="btn">Reply in Chat Messages</a>
    </div>
@endsection
