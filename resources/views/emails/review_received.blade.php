@extends('emails.layout')

@section('content')
    <h2>New Review Received! ⭐</h2>

    <p>Dear {{ $recipientName }},</p>
    <p>You have received a new <strong>{{ $rating }} Star</strong> review on WoofCircle for <strong>{{ $itemTitle }}</strong>.</p>

    <div class="info-box">
        <p><strong>Reviewer:</strong> {{ $reviewerName }}</p>
        <p><strong>Rating:</strong> 
            <span style="color: #c4a163; font-size: 16px;">
                @for($i = 0; $i < $rating; $i++) ★ @endfor
                @for($i = $rating; $i < 5; $i++) ☆ @endfor
            </span> ({{ $rating }}/5)
        </p>
        <p><strong>Date:</strong> {{ now()->setTimezone('Asia/Kolkata')->format('M d, Y h:i A') }}</p>
    </div>

    @if($comment)
    <div style="background: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <h4 style="margin: 0 0 10px 0; color: #1a1a1a;">Review Comment:</h4>
        <p style="white-space: pre-wrap; margin: 0; color: #333; font-style: italic;">"{{ $comment }}"</p>
    </div>
    @endif

    <div style="text-align: center;">
        <a href="{{ route('dashboard.reviews') }}" class="btn">View All Reviews</a>
    </div>
@endsection
