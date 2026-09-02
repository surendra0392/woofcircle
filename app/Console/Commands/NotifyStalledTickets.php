<?php

namespace App\Console\Commands;

use App\Mail\StalledTicketsNotification;
use App\Models\Admin;
use App\Models\SupportTicket;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class NotifyStalledTickets extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tickets:notify-stalled';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Query stalled support tickets and email support managers with a daily handoff report';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $tickets = SupportTicket::with('user')
            ->needsAttention()
            ->latest('created_at')
            ->get()
            ->map(function ($ticket) {
                return (object) [
                    'id' => $ticket->id,
                    'subject' => $ticket->subject,
                    'requester_name' => $ticket->user->name ?? 'Unknown',
                    'attention_category' => $ticket->attentionCategory(),
                ];
            });

        $count = $tickets->count();

        // Skip if nothing to report — don't send 50+ "all clear" emails daily.
        if ($count === 0) {
            $this->info('No stalled tickets found. Skipping notification.');
            return;
        }

        // Send to management-level support roles only — not all agents.
        // Role list defined in config/roles.php (support_management) to keep
        // all role lookups in a single source of truth.
        $recipients = Admin::whereIn('role', config('roles.support_management'))
            ->where('is_active', true)
            ->get();

        if ($recipients->isEmpty()) {
            $this->warn('No support managers found to notify.');
            return;
        }

        foreach ($recipients as $admin) {
            if (! $admin->email) {
                continue;
            }

            Mail::to($admin->email)->send(
                new StalledTicketsNotification($tickets),
            );
        }

        $this->info("Stalled-ticket report sent to {$recipients->count()} support manager(s). Found {$count} stalled ticket(s).");
    }
}
