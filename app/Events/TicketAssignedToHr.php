<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TicketAssignedToHr implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The ID of the HR admin who received the ticket.
     */
    public int $adminId;

    /**
     * The updated count of assigned tickets for this admin.
     */
    public int $count;

    /**
     * Create a new event instance.
     */
    public function __construct(int $adminId, int $count)
    {
        $this->adminId = $adminId;
        $this->count = $count;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('App.Models.Admin.'.$this->adminId),
        ];
    }
}
