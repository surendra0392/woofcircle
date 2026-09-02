<?php

namespace App\Http\Controllers\Hr;

use App\Http\Controllers\Concerns\HasTransferValidation;
use App\Http\Controllers\Controller;
use App\Models\Payout;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class PayoutController extends Controller
{
    use HasTransferValidation;

    /**
     * Role lists are defined in config/roles.php — the single source of truth.
     * Inline config() calls ensure zero drift from CheckHr middleware.
     */

    public function index()
    {
        $payouts = Payout::with(['admin', 'assignedTo'])
            ->orderByRaw("FIELD(status, 'pending') DESC")
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $eligibleTargets = $this->eligibleTargets(config('roles.hr'));

        return Inertia::render('Hr/Payouts/Index', [
            'payouts' => $payouts,
            'eligibleTargets' => $eligibleTargets,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'admin_id' => 'required|exists:admins,id',
            'amount' => 'required|numeric|min:0.01',
            'type' => 'required|string|in:salary,commission,bonus',
            'period_start' => 'required|date',
            'period_end' => 'required|date|after_or_equal:period_start',
        ]);

        Payout::create($validated);

        return redirect()->back()->with('success', 'Payout created successfully.');
    }

    public function update(Request $request, Payout $payout)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pending,paid',
        ]);

        if ($validated['status'] === 'paid' && $payout->status !== 'paid') {
            $validated['paid_at'] = Carbon::now();
        } elseif ($validated['status'] === 'pending') {
            $validated['paid_at'] = null;
        }

        $payout->update($validated);

        return redirect()->back()->with('success', 'Payout updated successfully.');
    }

    public function claim(Payout $payout)
    {
        $payout->update(['assigned_to' => auth('admin')->id()]);
        return redirect()->back()->with('success', 'Payout claimed successfully.');
    }

    public function transfer(Request $request, Payout $payout)
    {
        $request->validate(['assigned_to' => 'required|exists:admins,id']);

        $redirect = $this->validateTransferTarget(
            $request->assigned_to, config('roles.hr'), 'assigned_to', 'payout',
        );
        if ($redirect) {
            return $redirect;
        }

        $payout->update(['assigned_to' => $request->assigned_to]);
        return redirect()->back()->with('success', 'Payout transferred successfully.');
    }
}
