<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\Booking;
use App\Models\ProviderAvailability;

class BookingController extends Controller
{
    public function getAvailableSlots(Request $request)
    {
        $request->validate([
            'provider_type' => 'required|string',
            'provider_id' => 'required|integer',
            'date' => 'required|date',
        ]);

        $date = Carbon::parse($request->date);
        $dayOfWeek = $date->dayOfWeek; // 0 (Sunday) to 6 (Saturday)

        $availabilities = ProviderAvailability::where('provider_type', $request->provider_type)
            ->where('provider_id', $request->provider_id)
            ->where('day_of_week', $dayOfWeek)
            ->get();

        if ($availabilities->isEmpty()) {
            return response()->json(['slots' => []]);
        }

        $existingBookings = Booking::where('provider_type', $request->provider_type)
            ->where('provider_id', $request->provider_id)
            ->whereDate('start_time', $date)
            ->get();

        $slots = [];

        foreach ($availabilities as $availability) {
            $start = Carbon::parse($date->format('Y-m-d') . ' ' . $availability->start_time);
            $end = Carbon::parse($date->format('Y-m-d') . ' ' . $availability->end_time);
            $duration = $availability->slot_duration_minutes;

            while ($start->copy()->addMinutes($duration)->lte($end)) {
                $slotStart = $start->copy();
                $slotEnd = $start->copy()->addMinutes($duration);

                // Check for overlap
                $isBooked = $existingBookings->contains(function ($booking) use ($slotStart, $slotEnd) {
                    return $booking->start_time < $slotEnd && $booking->end_time > $slotStart;
                });

                if (!$isBooked) {
                    $slots[] = [
                        'start_time' => $slotStart->format('H:i'),
                        'end_time' => $slotEnd->format('H:i'),
                    ];
                }

                $start->addMinutes($duration);
            }
        }

        return response()->json(['slots' => $slots]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'provider_type' => 'required|string',
            'provider_id' => 'required|integer',
            'date' => 'required|date',
            'start_time' => 'required|string',
            'end_time' => 'required|string',
        ]);

        $date = Carbon::parse($request->date)->format('Y-m-d');
        
        $start = Carbon::parse($date . ' ' . $request->start_time);
        $end = Carbon::parse($date . ' ' . $request->end_time);

        // Check if already booked
        $overlap = Booking::where('provider_type', $request->provider_type)
            ->where('provider_id', $request->provider_id)
            ->where(function ($query) use ($start, $end) {
                $query->where('start_time', '<', $end)
                      ->where('end_time', '>', $start);
            })
            ->exists();

        if ($overlap) {
            return response()->json(['message' => 'Slot already booked'], 422);
        }

        $booking = Booking::create([
            'provider_type' => $request->provider_type,
            'provider_id' => $request->provider_id,
            'user_id' => auth()->id(),
            'start_time' => $start,
            'end_time' => $end,
            'status' => 'scheduled',
        ]);

        try {
            $user = auth()->user();
            $providerModel = app($request->provider_type)->find($request->provider_id);
            $providerName = $providerModel->name ?? $providerModel->clinic_name ?? $providerModel->shop_name ?? 'Provider';
            $providerEmail = $providerModel->user?->email ?? $providerModel->email ?? null;

            if ($user && $user->email) {
                \Illuminate\Support\Facades\Mail::to($user->email)
                    ->send(new \App\Mail\AppointmentBookedMail(
                        $user->name,
                        $providerName,
                        'Your Pet',
                        'Scheduled Slot Consultation',
                        $start->format('M d, Y h:i A') . ' - ' . $end->format('h:i A')
                    ));
            }

            if ($providerEmail) {
                \Illuminate\Support\Facades\Mail::to($providerEmail)
                    ->send(new \App\Mail\AppointmentReceivedMail(
                        $providerName,
                        $user->name,
                        $user->email,
                        'Pet Parent',
                        'Scheduled Slot Consultation',
                        $start->format('M d, Y h:i A') . ' - ' . $end->format('h:i A')
                    ));
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('Failed to send booking emails: ' . $e->getMessage());
        }

        return response()->json(['message' => 'Booking successful']);
    }
}
