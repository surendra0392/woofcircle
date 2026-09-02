<x-mail::message>
# Support Ticket Handoff Report

@if ($totalStalled === 0)
All support ticket handoffs are flowing normally. No tickets currently need attention.

<x-mail::button :url="config('app.url').'/support/queue?filter=needs_attention'">
Open Support Queue
</x-mail::button>
@else
<x-mail::panel>
**{{ $totalStalled }} ticket(s)** are currently stalled and need a support manager's attention.
</x-mail::panel>

<x-mail::button :url="config('app.url').'/support/queue?filter=needs_attention'">
View Stalled Tickets
</x-mail::button>

@if ($stalledInHr->isNotEmpty())
### 🔮 Stalled in HR ({{ $stalledInHr->count() }})
Escalated to HR but never returned.

@foreach ($stalledInHr as $ticket)
- **#{{ $ticket->id }}** — {{ $ticket->subject }} ({{ $ticket->requester_name }})
@endforeach
@endif

@if ($stalledAfterReturn->isNotEmpty())
### ⏳ Stalled After Return ({{ $stalledAfterReturn->count() }})
Returned to queue but unclaimed for 24+ hours.

@foreach ($stalledAfterReturn as $ticket)
- **#{{ $ticket->id }}** — {{ $ticket->subject }} ({{ $ticket->requester_name }})
@endforeach
@endif

@if ($chronicHandoffs->isNotEmpty())
### 🔄 Chronic Handoffs ({{ $chronicHandoffs->count() }})
Transferred or escalated 7+ days ago, still unresolved.

@foreach ($chronicHandoffs as $ticket)
- **#{{ $ticket->id }}** — {{ $ticket->subject }} ({{ $ticket->requester_name }})
@endforeach
@endif

---

*This is an automated daily report from {{ config('app.name') }}. To stop receiving these notifications, contact a system administrator.*
@endif
</x-mail::message>
