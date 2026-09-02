<?php

namespace App\Console\Commands;

use App\Mail\VaccinationReminderMail;
use App\Models\Vaccination;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendVaccinationReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'woof:send-vaccination-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sends email reminders for upcoming vaccinations';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting vaccination reminder check...');

        // Find vaccinations due in the next 30 days that haven't had a reminder sent yet
        $vaccinations = Vaccination::with(['pet.owner', 'vet'])
            ->whereNotNull('next_due_date')
            ->where('next_due_date', '<=', now()->addDays(30))
            ->whereNull('reminder_sent_at')
            ->get();

        $count = 0;

        foreach ($vaccinations as $vaccination) {
            $owner = $vaccination->pet->owner;

            if ($owner) {
                try {
                    Mail::to($owner->email)->send(new VaccinationReminderMail($vaccination));
                    
                    // WhatsApp & Push Reminder
                    try {
                        $whatsAppService = app(\App\Services\WhatsAppService::class);
                        if ($whatsAppService->isEnabled() && !empty($owner->mobile_number)) {
                            $dueDateStr = $vaccination->next_due_date ? \Illuminate\Support\Carbon::parse($vaccination->next_due_date)->format('M d, Y') : 'Soon';
                            $whatsAppService->sendTextMessage(
                                $owner->mobile_number,
                                "💉 *WoofCircle Health Alert*\n\nFriendly reminder: Your pet *{$vaccination->pet->name}* has a vaccination (*{$vaccination->vaccine_name}*) scheduled on *{$dueDateStr}*.\n\nView records: " . route('dashboard')
                            );
                        }
                        $pushService = app(\App\Services\PushNotificationService::class);
                        if ($pushService->isEnabled()) {
                            $dueDateStr = $vaccination->next_due_date ? \Illuminate\Support\Carbon::parse($vaccination->next_due_date)->format('M d, Y') : 'Soon';
                            $pushService->sendToUser(
                                $owner->id,
                                "Vaccination Reminder 💉",
                                "{$vaccination->pet->name} is due for {$vaccination->vaccine_name} on {$dueDateStr}.",
                                route('dashboard')
                            );
                        }
                    } catch (\Throwable $e) {
                        \Illuminate\Support\Facades\Log::warning('WhatsApp/Push vaccination reminder error: ' . $e->getMessage());
                    }

                    $vaccination->update(['reminder_sent_at' => now()]);
                    $count++;
                    
                    $this->line("Sent reminder for {$vaccination->pet->name}'s {$vaccination->vaccine_name} to {$owner->email}");
                } catch (\Exception $e) {
                    $this->error("Failed to send reminder to {$owner->email}: " . $e->getMessage());
                }
            }
        }

        $this->info("Completed sending {$count} reminders.");
    }
}
