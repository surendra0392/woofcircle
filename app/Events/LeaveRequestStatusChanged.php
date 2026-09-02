<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class LeaveRequestStatusChanged implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets;

    /**
     * The admin who owns the leave request (the employee).
     */
    public int $employeeId;

    /**
     * The leave request ID.
     */
    public int $leaveId;

    /**
     * The new status: approved or rejected.
     */
    public string $status;

    /**
     * The leave type (sick, vacation, unpaid).
     */
    public string $leaveType;

    /**
     * Create a new event instance.
     */
    public function __construct(int $employeeId, int $leaveId, string $status, string $leaveType)
    {
        $this->employeeId = $employeeId;
        $this->leaveId = $leaveId;
        $this->status = $status;
        $this->leaveType = $leaveType;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('App.Models.Admin.'.$this->employeeId),
        ];
    }
}
