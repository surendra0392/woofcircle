<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminNotificationController
{
    /**
     * Display a listing of system notifications.
     */
    public function index()
    {
        return Inertia::render('admin/notifications', [
            'notifications' => Notification::where('type', 'system')
                ->latest()
                ->paginate(10),
        ]);
    }

    /**
     * Store a newly created system notification for all users or a specific group.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'target' => 'required|in:all,breeders,vets,trainers,boarding,welfare,vendors,regular',
        ]);

        $query = User::query();

        if ($data['target'] === 'breeders') {
            $query->whereHas('breederProfile');
        } elseif ($data['target'] === 'vets') {
            $query->whereHas('vetProfile');
        } elseif ($data['target'] === 'trainers') {
            $query->whereHas('trainerProfile');
        } elseif ($data['target'] === 'boarding') {
            $query->whereHas('boardingProfile');
        } elseif ($data['target'] === 'welfare') {
            $query->whereHas('welfareProfile');
        } elseif ($data['target'] === 'vendors') {
            $query->whereHas('role', function ($q) {
                $q->where('name', 'Vendor');
            });
        } elseif ($data['target'] === 'regular') {
            $query->whereDoesntHave('breederProfile')
                ->whereDoesntHave('vetProfile')
                ->whereDoesntHave('trainerProfile')
                ->whereDoesntHave('boardingProfile')
                ->whereDoesntHave('welfareProfile')
                ->whereHas('role', function ($q) {
                    $q->where('name', 'User');
                });
        }

        $users = $query->get();

        foreach ($users as $user) {
            Notification::create([
                'user_id' => $user->id,
                'type' => 'system',
                'title' => $data['title'],
                'message' => $data['message'],
                'is_read' => false,
            ]);
        }

        return back()->with('success', 'System announcement sent to '.$users->count().' users.');
    }

    /**
     * Remove the specified notification from storage.
     */
    public function destroy(Notification $notification)
    {
        $notification->delete();

        return back()->with('success', 'Notification deleted successfully.');
    }
}
