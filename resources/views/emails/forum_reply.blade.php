@extends('emails.layout')

@section('content')
    <h2>New Reply on Your Discussion Thread 🐾</h2>

    <p>Dear {{ $authorName }},</p>
    <p><strong>{{ $replierName }}</strong> just replied to your discussion thread: <strong>{{ $threadTitle }}</strong>.</p>

    <div class="info-box">
        <p><strong>Thread:</strong> {{ $threadTitle }}</p>
        <p><strong>Category:</strong> {{ $categoryName }}</p>
        <p><strong>Replied By:</strong> {{ $replierName }}</p>
    </div>

    <div style="background: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <h4 style="margin: 0 0 10px 0; color: #1a1a1a;">Reply Snippet:</h4>
        <p style="white-space: pre-wrap; margin: 0; color: #333;">{{ $replySnippet }}</p>
    </div>

    <div style="text-align: center;">
        <a href="{{ $threadUrl }}" class="btn">View & Join Discussion</a>
    </div>
@endsection
