<?php

namespace App\Http\Controllers;

use App\Models\Pet;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class PetPassportController
{
    /**
     * Build the full pet payload array used across all passport views.
     */
    private function buildPetPayload(Pet $pet): array
    {
        $now = Carbon::now();
        $thirtyDaysFromNow = $now->copy()->addDays(30);

        // Map vaccinations with correct DB column names and expiry status
        $vaccinations = $pet->vaccinations->map(function ($v) use ($now, $thirtyDaysFromNow) {
            $nextDue = $v->next_due_date;
            $expiryStatus = 'valid';
            if ($nextDue) {
                $dueDate = Carbon::parse($nextDue);
                if ($dueDate->lt($now)) {
                    $expiryStatus = 'expired';
                } elseif ($dueDate->lte($thirtyDaysFromNow)) {
                    $expiryStatus = 'expiring_soon';
                }
            }

            return [
                'id' => $v->id,
                'vaccine_name' => $v->vaccine_name,
                'vaccination_date' => $v->vaccination_date ? Carbon::parse($v->vaccination_date)->format('Y-m-d') : null,
                'next_due_date' => $nextDue ? Carbon::parse($nextDue)->format('Y-m-d') : null,
                'vet_name' => $v->vet_name,
                'expiry_status' => $expiryStatus,
                'status' => 'Verified',
            ];
        });

        // Map medical records with correct DB column names
        $medicalRecords = $pet->medicalRecords->map(fn($m) => [
            'id' => $m->id,
            'record_type' => $m->record_type ?? 'Health Clearance',
            'title' => $m->title ?? $m->record_type,
            'description' => $m->description ?? $m->notes,
            'date' => $m->diagnosis_date ? Carbon::parse($m->diagnosis_date)->format('Y-m-d') : null,
            'doctor_name' => $m->doctor_name,
            'clinic_name' => $m->clinic_name,
        ]);

        // Build activity timeline from all available data
        $timeline = collect();

        // Passport creation event
        $timeline->push([
            'type' => 'created',
            'label' => 'Passport Registered',
            'description' => 'Digital passport issued to ' . $pet->name,
            'date' => $pet->created_at?->format('Y-m-d'),
            'icon' => 'shield',
        ]);

        // Vaccination events
        foreach ($pet->vaccinations as $v) {
            if ($v->vaccination_date) {
                $timeline->push([
                    'type' => 'vaccination',
                    'label' => $v->vaccine_name . ' Administered',
                    'description' => 'Administered by ' . ($v->vet_name ?? 'Verified Clinic'),
                    'date' => Carbon::parse($v->vaccination_date)->format('Y-m-d'),
                    'icon' => 'syringe',
                ]);
            }
        }

        // Medical record events
        foreach ($pet->medicalRecords as $m) {
            if ($m->diagnosis_date) {
                $timeline->push([
                    'type' => 'medical',
                    'label' => $m->title ?? 'Clinical Examination',
                    'description' => 'At ' . ($m->clinic_name ?? $m->doctor_name ?? 'Verified Clinic'),
                    'date' => Carbon::parse($m->diagnosis_date)->format('Y-m-d'),
                    'icon' => 'stethoscope',
                ]);
            }
        }

        // Transfer events (synthetic based on count)
        if (($pet->transfer_count ?? 0) > 1) {
            $timeline->push([
                'type' => 'transfer',
                'label' => 'Ownership Transferred',
                'description' => ($pet->transfer_count - 1) . ' ownership change(s) recorded',
                'date' => $pet->updated_at?->format('Y-m-d'),
                'icon' => 'repeat',
            ]);
        }

        // Lost pet event
        if ($pet->is_lost && $pet->lost_at) {
            $timeline->push([
                'type' => 'lost',
                'label' => 'Reported Missing',
                'description' => $pet->lost_location ? 'Last seen near ' . $pet->lost_location : 'Pet reported as missing',
                'date' => Carbon::parse($pet->lost_at)->format('Y-m-d'),
                'icon' => 'alert',
            ]);
        }

        // Sort timeline by date descending (most recent first)
        $timeline = $timeline->sortByDesc('date')->values();

        return [
            'id' => $pet->id,
            'name' => $pet->name,
            'passport_number' => $pet->passport_number,
            'microchip_number' => $pet->microchip_number,
            'gender' => $pet->gender,
            'date_of_birth' => $pet->date_of_birth ? $pet->date_of_birth->format('Y-m-d') : null,
            'color' => $pet->color,
            'is_champion' => $pet->is_champion,
            'transfer_count' => $pet->transfer_count ?? 1,
            'sale_count' => $pet->sale_count ?? 1,
            'adoption_count' => $pet->adoption_count ?? 0,
            'profile_image_url' => $pet->profile_image_url,
            'is_lost' => (bool) $pet->is_lost,
            'lost_at' => $pet->lost_at ? Carbon::parse($pet->lost_at)->format('Y-m-d H:i') : null,
            'lost_description' => $pet->lost_description,
            'lost_location' => $pet->lost_location,
            'emergency_contact' => [
                'name' => $pet->emergency_contact_name,
                'phone' => $pet->emergency_contact_phone,
                'email' => $pet->emergency_contact_email,
            ],
            'vaccination_expiry_status' => $pet->vaccination_expiry_status,
            'breed' => $pet->breed ? [
                'name' => $pet->breed->name,
                'breed_group' => $pet->breed->breed_group,
            ] : null,
            'owner' => [
                'name' => $pet->user ? $pet->user->name : 'Verified Member',
                'email' => $pet->user ? $pet->user->email : null,
            ],
            'vaccinations' => $vaccinations,
            'medical_records' => $medicalRecords,
            'timeline' => $timeline,
        ];
    }

    /**
     * Find a pet by passport number (supports formatted and unformatted input).
     */
    private function findPetByPassport(string $passport): ?Pet
    {
        $cleanPassport = str_replace([' ', '-'], '', $passport);

        $pet = Pet::with(['user', 'breed', 'vaccinations', 'medicalRecords'])
            ->where(function ($query) use ($passport, $cleanPassport) {
                $query->where('passport_number', $passport)
                    ->orWhereRaw("REPLACE(passport_number, ' ', '') = ?", [$cleanPassport]);
            })
            ->first();
            
        // Fallback for UI dummy/sample passports (used in landing page and preview cards)
        if (!$pet && in_array($cleanPassport, ['WCTG861448134954', 'WCTG1578579257985'])) {
            $pet = new Pet([
                'name' => 'Aurelia Duchess of Kent',
                'passport_number' => 'WCTG 8614 4813 4954',
                'microchip_number' => '90011500055190',
                'gender' => 'Female',
                'date_of_birth' => now()->subYears(3),
                'color' => 'Golden',
                'is_champion' => true,
                'awards_count' => 5,
            ]);
            $pet->id = 999999;
            $pet->setRelation('breed', new \App\Models\Breed(['name' => 'Golden Retriever', 'breed_group' => 'Sporting']));
            $pet->setRelation('user', new \App\Models\User(['name' => 'Verified Breeder', 'email' => 'breeder@example.com']));
            $pet->setRelation('vaccinations', collect([]));
            $pet->setRelation('medicalRecords', collect([]));
        }

        return $pet;
    }

    public function index(): Response
    {
        $searchQuery = request('passport');
        $pet = null;
        $notFound = false;

        if ($searchQuery) {
            $foundPet = $this->findPetByPassport($searchQuery);

            if ($foundPet) {
                $pet = $this->buildPetPayload($foundPet);
            } else {
                $notFound = true;
            }
        }

        return Inertia::render('pets/passport-search', [
            'pet' => $pet,
            'search_query' => $searchQuery,
            'not_found' => $notFound,
            'verified_at' => now()->toIso8601String(),
        ]);
    }

    public function show(string $passport): Response
    {
        $foundPet = $this->findPetByPassport($passport);

        if (!$foundPet) {
            abort(404);
        }

        return Inertia::render('pets/passport', [
            'pet' => $this->buildPetPayload($foundPet),
            'verification_status' => 'VERIFIED_GENUINE',
            'verified_at' => now()->toIso8601String(),
        ]);
    }

    public function pdf(string $passport): Response
    {
        $foundPet = $this->findPetByPassport($passport);

        if (!$foundPet) {
            abort(404);
        }

        return Inertia::render('pets/passport-pdf', [
            'pet' => $this->buildPetPayload($foundPet),
            'verification_status' => 'VERIFIED_GENUINE',
            'issued_at' => now()->toIso8601String(),
        ]);
    }
}
