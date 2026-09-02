<?php

namespace App\Console\Commands;

use App\Models\Appointment;
use App\Models\Notification;
use App\Models\Vaccination;
use Illuminate\Console\Command;

class CheckReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reminders:check';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for upcoming vaccinations and appointments and create notifications';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->checkVaccinations();
        $this->checkAppointments();

        $this->info('Reminders checked and notifications created.');
    }

    protected function checkVaccinations()
    {
        $upcomingDate = now()->addDays(7)->toDateString();

        $vaccinations = Vaccination::with('pet.user')
            ->whereDate('next_due_date', '=', $upcomingDate)
            ->get();

        foreach ($vaccinations as $vaccination) {
            $user = $vaccination->pet->user;
            if (! $user) {
                continue;
            }

            Notification::firstOrCreate([
                'user_id' => $user->id,
                'type' => 'vaccination_due',
                'title' => 'Vaccination Due Soon',
                'message' => "Your pet {$vaccination->pet->name} has a vaccination ({$vaccination->vaccine_name}) due on {$vaccination->next_due_date->format('M d, Y')}.",
                'is_read' => false,
            ]);
        }
    }

    protected function checkAppointments()
    {
        $upcomingDate = now()->addDays(3)->toDateString();

        $appointments = Appointment::with('pet.user')
            ->whereDate('appointment_date', '=', $upcomingDate)
            ->get();

        foreach ($appointments as $appointment) {
            $user = $appointment->pet->user;
            if (! $user) {
                continue;
            }

            Notification::firstOrCreate([
                'user_id' => $user->id,
                'type' => 'appointment_upcoming',
                'title' => 'Upcoming Appointment',
                'message' => "Your pet {$appointment->pet->name} has an appointment ({$appointment->appointment_type}) on {$appointment->appointment_date->format('M d, Y at H:i')}.",
                'is_read' => false,
            ]);
        }
    }
}
