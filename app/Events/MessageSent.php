<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;

    public function __construct(Message $message)
    {
        $this->message = $message->load('sender', 'attachments', 'conversation.users');
    }

    public function broadcastOn(): array
    {
        $channels = [
            new PrivateChannel('chat.'.$this->message->conversation_id),
        ];

        // Broadcast to each user in the conversation (for global notifications), except the sender
        foreach ($this->message->conversation->users as $user) {
            if ($user->id !== $this->message->user_id) {
                $channels[] = new PrivateChannel('App.Models.User.'.$user->id);
            }
        }

        return $channels;
    }
}
