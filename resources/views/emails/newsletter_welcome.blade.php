@extends('emails.layout')

@section('content')
    <h2>You Are Subscribed to Canine Chronicles! 💌</h2>

    <p>Hello,</p>
    <p>Thank you for subscribing to the <strong>WoofCircle Newsletter</strong>. You are now part of our inner circle of passionate dog enthusiasts across India.</p>

    <div class="info-box">
        <p><strong>Subscribed Email:</strong> {{ $email }}</p>
        <p><strong>What to Expect:</strong> Weekly veterinary wellness tips, training masterclasses, upcoming championship trials, and featured rescues.</p>
    </div>

    <p>Stay tuned for our next curated journal edition delivered straight to your inbox.</p>

    <div style="text-align: center; margin-bottom: 25px;">
        <a href="{{ route('community.articles.index') }}" class="btn">Read Our Journal</a>
    </div>

    <p style="font-size: 11px; color: #888; text-align: center; margin-top: 20px;">
        If you ever wish to unsubscribe, you can do so at any time by clicking <a href="{{ $unsubscribeUrl }}" style="color: #c4a163;">here to unsubscribe</a>.
    </p>
@endsection
