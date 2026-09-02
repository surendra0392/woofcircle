<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TicketReturnedFromHr implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The support agent who originally transferred/escalated the ticket.
     */
    public int $originalAgentId;

    /**
     * The ticket that was returned.
     */
    public int $ticketId;

    /**
     * The ticket subject (for display in the notification).
     */
    public string $ticketSubject;

    /**
     * Create a new event instance.
     */
    public function __construct(int $originalAgentId, int $ticketId, string $ticketSubject)
    {
        $this->originalAgentId = $originalAgentId;
        $this->ticketId = $ticketId;
        $this->ticketSubject = $ticketSubject;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('App.Models.Admin.'.$this->originalAgentId),
        ];
    }
}
