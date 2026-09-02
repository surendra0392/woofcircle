@extends('emails.layout')

@section('content')
    <h2>New Message on WoofCircle 💬</h2>

    <p>Dear {{ $recipientName }},</p>
    <p><strong>{{ $senderName }}</strong> sent you a direct message on WoofCircle:</p>

    <div style="background: #f9f9f9; border-left: 4px solid #c4a163; border-radius: 4px; padding: 16px; margin: 20px 0;">
        <p style="white-space: pre-wrap; margin: 0; color: #222;">{{ $messageSnippet }}</p>
    </div>

    <div style="text-align: center;">
        <a href="{{ $conversationUrl }}" class="btn">Reply in Sanctuary Inbox</a>
    </div>
@endsection
