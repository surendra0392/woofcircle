<?php

namespace App\Http\Controllers;

use App\Models\Notification;

class NotificationController
{
    public function index()
    {
        return inertia('dashboard/notifications', [
            'notifications' => auth()->user()->notifications()->paginate(20),
        ]);
    }

    public function markAsRead(Notification $notification)
    {
        if ($notification->user_id !== auth()->id()) {
            abort(403);
        }

        $notification->update(['is_read' => true]);

        return back();
    }

    public function markAllAsRead()
    {
        auth()->user()->notifications()->unread()->update(['is_read' => true]);

        return back();
    }

    public function latest()
    {
        return response()->json([
            'notifications' => auth()->user()->notifications()->limit(5)->get(),
            'unreadCount' => auth()->user()->notifications()->unread()->count(),
        ]);
    }
}
