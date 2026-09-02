<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminContactController
{
    /**
     * Display a listing of the contact messages.
     */
    public function index(Request $request)
    {
        $query = ContactMessage::query();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%'.$request->search.'%')
                    ->orWhere('email', 'like', '%'.$request->search.'%')
                    ->orWhere('subject', 'like', '%'.$request->search.'%')
                    ->orWhere('message', 'like', '%'.$request->search.'%');
            });
        }

        $messages = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('admin/contact-messages/index', [
            'messages' => $messages,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    /**
     * Display the specified contact message.
     */
    public function show(ContactMessage $message)
    {
        // Mark as read if it was new
        if ($message->status === 'new') {
            $message->update(['status' => 'read']);
        }

        return Inertia::render('admin/contact-messages/show', [
            'message' => $message,
        ]);
    }

    /**
     * Update the status of the contact message.
     */
    public function updateStatus(Request $request, ContactMessage $message)
    {
        $request->validate([
            'status' => 'required|in:new,read,replied,archived',
        ]);

        $message->update(['status' => $request->status]);

        return back()->with('success', 'Message status updated successfully.');
    }

    /**
     * Remove the specified contact message from storage.
     */
    public function destroy(ContactMessage $message)
    {
        $message->delete();

        return redirect()->route('admin.contact-messages.index')->with('success', 'Message deleted successfully.');
    }
}
