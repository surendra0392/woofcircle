@extends('emails.layout')

@section('content')
    <h2>Puppy Transfer Update: {{ $petName }}</h2>

    <p>Dear {{ $buyerName }},</p>
    <p>The status of your puppy transfer request has been updated by the breeder:</p>

    <div class="info-box">
        <p><strong>Puppy Name:</strong> {{ $petName }}</p>
        <p><strong>Breeder Name:</strong> {{ $breederName }}</p>
        <p><strong>Updated Status:</strong> 
            @if($status === 'pending_admin')
                <span style="color: #2e7d32; font-weight: bold;">Breeder Approved (Pending Final Admin Clearance)</span>
            @elseif($status === 'rejected')
                <span style="color: #c62828; font-weight: bold;">Request Rejected</span>
            @else
                <span style="font-weight: bold;">{{ ucfirst(str_replace('_', ' ', $status)) }}</span>
            @endif
        </p>
        <p><strong>Updated At:</strong> {{ now()->setTimezone('Asia/Kolkata')->format('M d, Y h:i A') }}</p>
    </div>

    @if($status === 'pending_admin')
        <p>The breeder has verified and approved your transfer. Our administration team is performing final verification before health records and digital ownership pass into your dashboard.</p>
    @elseif($status === 'rejected')
        <p>Unfortunately, the breeder was unable to proceed with this transfer request at this time. You can explore other available litters on the marketplace.</p>
    @endif

    <div style="text-align: center;">
        <a href="{{ route('marketplace.puppies.index') }}" class="btn">View Marketplace</a>
    </div>
@endsection
