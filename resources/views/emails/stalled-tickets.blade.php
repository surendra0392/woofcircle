@extends('emails.layout')

@section('content')
    <h2>Support Desk: Daily Handoff & Stalled Ticket Report 📊</h2>

    <p>Hello Support Manager,</p>

    @if ($totalStalled === 0)
        <div class="info-box" style="border-left-color: #2e7d32;">
            <p><strong>Status:</strong> <span style="color: #2e7d32; font-weight: bold;">All Support Queues Operating Within SLA</span></p>
            <p>No tickets currently require escalation or emergency intervention.</p>
        </div>
    @else
        <div class="info-box" style="border-left-color: #d32f2f;">
            <p><strong>Stalled Tickets Requiring Attention:</strong> <span style="color: #d32f2f; font-weight: bold;">{{ $totalStalled }} Ticket(s)</span></p>
            <p>Please review and unblock the escalated tickets below.</p>
        </div>

        @if ($stalledInHr->isNotEmpty())
            <h3 style="font-size: 15px; color: #141414; margin-top: 20px;">🔮 Stalled in HR ({{ $stalledInHr->count() }})</h3>
            <ul>
                @foreach ($stalledInHr as $ticket)
                    <li><strong>#{{ $ticket->id }}</strong> — {{ $ticket->subject }} ({{ $ticket->requester_name }})</li>
                @endforeach
            </ul>
        @endif

        @if ($stalledAfterReturn->isNotEmpty())
            <h3 style="font-size: 15px; color: #141414; margin-top: 20px;">⏳ Stalled After Return ({{ $stalledAfterReturn->count() }})</h3>
            <ul>
                @foreach ($stalledAfterReturn as $ticket)
                    <li><strong>#{{ $ticket->id }}</strong> — {{ $ticket->subject }} ({{ $ticket->requester_name }})</li>
                @endforeach
            </ul>
        @endif

        @if ($chronicHandoffs->isNotEmpty())
            <h3 style="font-size: 15px; color: #141414; margin-top: 20px;">🔄 Chronic Handoffs 7+ Days ({{ $chronicHandoffs->count() }})</h3>
            <ul>
                @foreach ($chronicHandoffs as $ticket)
                    <li><strong>#{{ $ticket->id }}</strong> — {{ $ticket->subject }} ({{ $ticket->requester_name }})</li>
                @endforeach
            </ul>
        @endif
    @endif

    <div style="text-align: center;">
        <a href="{{ rtrim(config('app.url', 'https://woofcircle.in'), '/') . '/support/queue?filter=needs_attention' }}" class="btn">Open Support Queue</a>
    </div>
@endsection
