<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Pet;
use App\Models\VetProfile;
use Illuminate\Database\Seeder;

class AppointmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pets = Pet::all();
        $vets = VetProfile::with('user')->get();

        if ($pets->isEmpty() || $vets->isEmpty()) {
            $this->command->error('Missing dependencies (Pets or Vet Profiles). Run other seeders first.');

            return;
        }

        $appointmentTypes = ['vaccination', 'checkup', 'surgery', 'grooming', 'training', 'other'];

        $pastNotes = [
            'Regular vaccination completed successfully. No side effects reported.',
            'Routine checkup done. Pet is healthy and active. Advised diet plan.',
            'Minor dental cleaning surgery completed. Prescribed pain relief medication.',
            'Grooming completed. Pet coat was clean and well-trimmed.',
            'Training session finished. Good progress shown in obedience commands.',
        ];

        $futureNotes = [
            'Scheduled for annual rabies and booster vaccinations.',
            'Routine general checkup appointment.',
            'Scheduled surgery for spaying/neutering.',
            'Full grooming and nail clipping session.',
            'Behavioral training session.',
        ];

        // Seed 15 appointments
        foreach (range(1, 15) as $index) {
            $pet = $pets->random();
            $vet = $vets->random();
            $type = $appointmentTypes[array_rand($appointmentTypes)];

            // Determine if past or future (roughly 50/50)
            $isPast = (bool) rand(0, 1);

            if ($isPast) {
                $daysAgo = rand(1, 90);
                $date = now()->subDays($daysAgo)->setTime(rand(9, 17), 0, 0);
                // Past appointments: 80% completed, 20% cancelled
                $status = rand(0, 4) < 4 ? 'completed' : 'cancelled';
                $note = $pastNotes[array_rand($pastNotes)];
            } else {
                $daysInFuture = rand(1, 90);
                $date = now()->addDays($daysInFuture)->setTime(rand(9, 17), 0, 0);
                // Future appointments: 90% scheduled, 10% cancelled
                $status = rand(0, 9) < 9 ? 'scheduled' : 'cancelled';
                $note = $futureNotes[array_rand($futureNotes)];
            }

            Appointment::create([
                'pet_id' => $pet->id,
                'appointment_type' => $type,
                'appointment_date' => $date,
                'vet_profile_id' => $vet->id,
                'doctor_name' => $vet->user ? $vet->user->name : 'Dr. Vet',
                'clinic_name' => $vet->clinic_name ?? 'Pet Clinic',
                'notes' => $note,
                'status' => $status,
            ]);
        }

        $this->command->info('15 Appointments seeded successfully with past and future dates!');
    }
}
