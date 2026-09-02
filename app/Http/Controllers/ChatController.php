<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Admin;
use App\Models\Adoption;
use App\Models\Conversation;
use App\Models\StudService;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ChatController
{
    /**
     * Determine if the request user is an admin.
     */
    private function isAdmin(Request $request): bool
    {
        $user = $request->user();

        return $user instanceof Admin || (method_exists($user, 'hasRole') && $user->hasRole('admin'));
    }

    /**
     * Authorize that the user can access the conversation.
     */
    private function authorizeConversationAccess(Request $request, Conversation $conversation): void
    {
        if (! $this->isAdmin($request) && ! $conversation->users->contains($request->user()->id)) {
            abort(403);
        }
    }

    /**
     * Mark messages as read for the current user in the conversation.
     */
    private function markMessagesAsRead(Conversation $conversation, Request $request): void
    {
        if ($conversation->users->contains($request->user()->id)) {
            $conversation->messages()
                ->where('user_id', '!=', $request->user()->id)
                ->whereNull('read_at')
                ->update(['read_at' => now()]);
        }
    }

    /**
     * Find existing conversation between two users, or create a new one.
     */
    private function findOrCreateConversation(int $userId1, int $userId2): Conversation
    {
        $conversation = Conversation::whereHas('users', function ($q) use ($userId1) {
            $q->where('users.id', $userId1);
        })->whereHas('users', function ($q) use ($userId2) {
            $q->where('users.id', $userId2);
        })->first();

        if (! $conversation) {
            $conversation = Conversation::create();
            $conversation->users()->attach([$userId1, $userId2]);
        }

        return $conversation;
    }

    /**
     * Build the user conversations query (shared between index and show).
     */
    private function buildUserConversationsQuery(Request $request, ?string $search = null, ?bool $unread = null)
    {
        $user = $request->user();

        $query = $user->conversations()
            ->with(['users' => function ($q) use ($user) {
                $q->where('users.id', '!=', $user->id);
            }, 'messages' => function ($q) {
                $q->latest()->limit(1);
            }])
            ->withCount(['messages as unread_count' => function ($q) use ($user) {
                $q->where('user_id', '!=', $user->id)->whereNull('read_at');
            }]);

        if ($search) {
            $query->whereHas('users', function ($q) use ($search, $user) {
                $q->where('users.id', '!=', $user->id)
                  ->where(function ($sq) use ($search) {
                      $sq->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        if ($unread) {
            $query->having('unread_count', '>', 0);
        }

        return $query->latest('updated_at')->paginate(15)->withQueryString();
    }

    /**
     * Create a pre-formatted message body for interest/consultation with a listing.
     */
    private function createListingMessage(Conversation $conversation, int $userId, ?string $body): \App\Models\Message
    {
        $message = $conversation->messages()->create([
            'user_id' => $userId,
            'body' => $body,
        ]);

        broadcast(new MessageSent($message->load('sender', 'attachments')))->toOthers();

        try {
            $sender = \App\Models\User::find($userId);
            $recipient = $conversation->users()->where('users.id', '!=', $userId)->first();
            if ($sender && $recipient && $recipient->email) {
                \Illuminate\Support\Facades\Mail::to($recipient->email)
                    ->send(new \App\Mail\DirectMessageNotificationMail(
                        $recipient->name,
                        $sender->name,
                        \Illuminate\Support\Str::limit(strip_tags($body ?? ''), 160),
                        route('dashboard.messages.show', $conversation->id)
                    ));
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('Failed to send direct message email: ' . $e->getMessage());
        }

        return $message;
    }

    /**
     * Build the admin conversations query (shared between index and show).
     */
    private function buildAdminConversationsQuery(Request $request, ?string $search = null, ?bool $unread = null)
    {
        $query = Conversation::with(['users', 'messages' => function ($q) {
            $q->latest()->limit(1);
        }])
        ->withCount(['messages as unread_count' => function ($q) {
            $q->whereNull('read_at');
        }]);

        if ($search) {
            $query->whereHas('users', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($unread) {
            $query->having('unread_count', '>', 0);
        }

        return $query->latest('updated_at')->paginate(15)->withQueryString();
    }

    /**
     * Start or resume a conversation with a target user, handling common checks.
     * Returns the Conversation, or a redirect response on error.
     */
    private function startOrResumeConversation(Request $request, ?int $targetUserId, string $selfError, ?string $missingError = null): Conversation|\Illuminate\Http\RedirectResponse
    {
        $currentUserId = $request->user()->id;

        if ($missingError !== null && ! $targetUserId) {
            return redirect()->back()->with('error', $missingError);
        }

        if ($currentUserId === $targetUserId) {
            return redirect()->back()->with('error', $selfError);
        }

        return $this->findOrCreateConversation($currentUserId, $targetUserId);
    }

    /**
     * Create a listing-initiation message and redirect to the conversation.
     */
    private function sendListingMessageAndRedirect(Conversation $conversation, int $userId, string $body, string $successMessage): \Illuminate\Http\RedirectResponse
    {
        $this->createListingMessage($conversation, $userId, $body);

        return redirect()->route('dashboard.messages.show', $conversation->id)
            ->with('success', $successMessage);
    }

    public function index(Request $request)
    {
        $search = $request->input('search');
        $unread = $request->boolean('unread');

        if ($this->isAdmin($request)) {
            $conversations = $this->buildAdminConversationsQuery($request, $search, $unread);

            return Inertia::render('admin/messages/index', [
                'conversations' => $conversations,
                'filters' => $request->only('search', 'unread'),
            ]);
        }

        $conversations = $this->buildUserConversationsQuery($request, $search, $unread);

        return Inertia::render('dashboard/messages/index', [
            'conversations' => $conversations,
            'filters' => $request->only('search', 'unread'),
        ]);
    }

    public function initiate(Request $request, User $user)
    {
        $result = $this->startOrResumeConversation($request, $user->id, 'You cannot chat with yourself.');
        if ($result instanceof \Illuminate\Http\RedirectResponse) {
            return $result;
        }

        return redirect()->route('dashboard.messages.show', $result->id);
    }

    public function expressInterestAdoption(Request $request, Adoption $adoption)
    {
        $result = $this->startOrResumeConversation(
            $request, $adoption->user_id,
            'You cannot express interest in your own listing.',
            'This adoption listing does not have a linked user.',
        );
        if ($result instanceof \Illuminate\Http\RedirectResponse) {
            return $result;
        }

        $body = "**Adoption Interest: {$adoption->title}**\n\n"
              . 'I am interested in this adoption listing and would like to learn more about the adoption process.';

        return $this->sendListingMessageAndRedirect($result, $request->user()->id, $body, 'Your interest has been sent!');
    }

    public function bookConsultationStud(Request $request, StudService $stud)
    {
        $result = $this->startOrResumeConversation(
            $request, $stud->user_id,
            'You cannot book a consultation for your own stud service.',
            'This stud service does not have a linked user.',
        );
        if ($result instanceof \Illuminate\Http\RedirectResponse) {
            return $result;
        }

        $request->validate([
            'preferred_date' => 'nullable|string',
            'contact_number' => 'nullable|string',
            'message' => 'required|string',
        ]);

        $body = "**Book Consultation: {$stud->title}**\n\n";
        if ($request->preferred_date) {
            $body .= "**Preferred Date:** {$request->preferred_date}\n";
        }
        if ($request->contact_number) {
            $body .= "**Contact Number:** {$request->contact_number}\n";
        }
        $body .= "\n{$request->message}";

        return $this->sendListingMessageAndRedirect($result, $request->user()->id, $body, 'Your consultation request has been sent!');
    }

    public function show(Conversation $conversation, Request $request)
    {
        $this->authorizeConversationAccess($request, $conversation);
        $this->markMessagesAsRead($conversation, $request);

        $messages = $conversation->messages()->with('sender', 'attachments')->oldest()->get();

        if ($this->isAdmin($request)) {
            return Inertia::render('admin/messages/show', [
                'conversation' => $conversation->load('users'),
                'messages' => $messages,
            ]);
        }

        $conversations = $this->buildUserConversationsQuery(
            $request,
            $request->input('search'),
            $request->boolean('unread')
        );

        return Inertia::render('dashboard/messages/index', [
            'conversations' => $conversations,
            'activeConversation' => $conversation->load('users'),
            'messages' => $messages,
            'filters' => $request->only('search', 'unread'),
        ]);
    }

    public function store(Request $request, Conversation $conversation)
    {
        $this->authorizeConversationAccess($request, $conversation);

        if ($request->user() instanceof Admin) {
            return back()->with('error', 'Admins are in read-only mode for user conversations.');
        }

        $request->validate([
            'body' => 'nullable|string',
            'attachments.*' => 'nullable|file|mimes:jpg,jpeg,png,webp,pdf,doc,docx|max:10240',
        ]);

        if (! $request->filled('body') && ! $request->hasFile('attachments')) {
            return back();
        }

        $message = $conversation->messages()->create([
            'user_id' => $request->user()->id,
            'body' => $request->body,
        ]);

        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('attachments', 'public');
                $message->attachments()->create([
                    'file_path' => $path,
                    'file_name' => $file->getClientOriginalName(),
                    'mime_type' => $file->getMimeType(),
                    'size' => $file->getSize(),
                ]);
            }
        }

        $message->load('sender', 'attachments');

        broadcast(new MessageSent($message))->toOthers();

        try {
            $sender = $request->user();
            $recipient = $conversation->users()->where('users.id', '!=', $sender->id)->first();
            if ($sender && $recipient && $recipient->email) {
                \Illuminate\Support\Facades\Mail::to($recipient->email)
                    ->send(new \App\Mail\DirectMessageNotificationMail(
                        $recipient->name,
                        $sender->name,
                        \Illuminate\Support\Str::limit(strip_tags($request->body ?? 'Shared an attachment'), 160),
                        route('dashboard.messages.show', $conversation->id)
                    ));
            }

            // Web/Mobile Push notification
            try {
                $pushService = app(\App\Services\PushNotificationService::class);
                if ($pushService->isEnabled() && $recipient) {
                    $pushService->sendToUser(
                        $recipient->id,
                        "New message from {$sender->name} 💬",
                        \Illuminate\Support\Str::limit(strip_tags($request->body ?? 'Shared an attachment'), 80),
                        route('dashboard.messages.show', $conversation->id)
                    );
                }
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::warning('Push chat notification error: ' . $e->getMessage());
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('Failed to send direct message email: ' . $e->getMessage());
        }

        if ($request->wantsJson()) {
            return response()->json($message);
        }

        return redirect()->back();
    }

    public function markAsRead(Conversation $conversation, Request $request)
    {
        $this->authorizeConversationAccess($request, $conversation);
        $this->markMessagesAsRead($conversation, $request);

        return response()->json(['success' => true]);
    }

    public function destroy(Conversation $conversation, Request $request)
    {
        $this->authorizeConversationAccess($request, $conversation);

        // Delete attachment files from storage
        $conversation->messages()->with('attachments')->get()->each(function ($message) {
            $message->attachments->each(function ($attachment) {
                if (Storage::disk('public')->exists($attachment->file_path)) {
                    Storage::disk('public')->delete($attachment->file_path);
                }
            });
        });

        $conversation->delete();

        $redirectRoute = $this->isAdmin($request) ? 'admin.messages.index' : 'dashboard.messages.index';

        return redirect()->route($redirectRoute)->with('success', 'Conversation deleted.');
    }
}
