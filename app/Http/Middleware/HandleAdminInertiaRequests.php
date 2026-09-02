<?php

namespace App\Http\Middleware;

use App\Models\ContactMessage;
use App\Models\InternalTicket;
use App\Models\Review;
use App\Models\Setting;
use App\Models\SupportTicket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

class HandleAdminInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Share admin-specific data with all admin Inertia pages.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $admin = Auth::guard('admin')->user();
        
        return array_merge(parent::share($request), [
            'name' => config('app.name'),
            'auth' => [
                'admin' => $admin ? array_merge($admin->toArray(), [
                    'unread_contact_messages' => ContactMessage::where('status', 'new')->count(),
                    'unread_support_tickets' => SupportTicket::where('status', 'open')->count(),
                    'pending_reviews' => Review::where('status', 'pending')->count(),
                    'has_subordinates' => $admin->subordinates()->exists(),
                    'unassigned_tickets_count' => SupportTicket::whereNull('assigned_to')->where('status', 'open')->count(),
                    'unassigned_internal_tickets_count' => InternalTicket::whereNull('assigned_to')->where('status', 'open')->count(),
                    'hr_assigned_tickets' => in_array($admin->role, ['hr_director', 'hr_manager', 'hr_executive'])
                        ? SupportTicket::where('assigned_to', $admin->id)
                            ->whereIn('status', ['open', 'in_progress'])
                            ->count()
                        : 0,
                ]) : null,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
            'settings' => \Cache::rememberForever('site_settings', function () {
                return Setting::all()->pluck('value', 'key')->toArray();
            }),
        ]);
    }
}
