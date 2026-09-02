<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Pet extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'breed_id',
        'name',
        'gender',
        'date_of_birth',
        'color',
        'microchip_number',
        'passport_number',
        'profile_image_path',
        'is_champion',
        'awards_count',
        'transfer_count',
        'sale_count',
        'adoption_count',
        'is_lost',
        'lost_at',
        'lost_description',
        'lost_location',
        'emergency_contact_name',
        'emergency_contact_phone',
        'emergency_contact_email',
        'notes',
        'sire_id',
        'dam_id',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($pet) {
            if (empty($pet->passport_number)) {
                $digits = str_pad((string) mt_rand(100000000000, 999999999999), 12, '0', STR_PAD_LEFT);
                $pet->passport_number = 'WCTG ' . substr($digits, 0, 4) . ' ' . substr($digits, 4, 4) . ' ' . substr($digits, 8, 4);
            }
        });
    }

    protected $casts = [
        'date_of_birth' => 'date',
        'is_champion' => 'boolean',
        'awards_count' => 'integer',
        'transfer_count' => 'integer',
        'sale_count' => 'integer',
        'adoption_count' => 'integer',
        'is_lost' => 'boolean',
        'lost_at' => 'datetime',
    ];

    protected $appends = ['profile_image_url', 'badges'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function breed(): BelongsTo
    {
        return $this->belongsTo(Breed::class);
    }

    public function vaccinations(): HasMany
    {
        return $this->hasMany(Vaccination::class);
    }

    public function medicalRecords(): HasMany
    {
        return $this->hasMany(MedicalRecord::class);
    }

    public function trainingSessions(): HasMany
    {
        return $this->hasMany(TrainingSession::class);
    }

    public function boardingReservations(): HasMany
    {
        return $this->hasMany(BoardingReservation::class);
    }

    /**
     * The vet profiles associated with this pet.
     */
    public function vets()
    {
        return $this->belongsToMany(VetProfile::class, 'pet_vet_profile', 'pet_id', 'vet_profile_id')
                    ->withTimestamps();
    }

    public function followers()
    {
        return $this->belongsToMany(User::class, 'pet_followers')->withTimestamps();
    }

    public function photos()
    {
        return $this->hasMany(PetPhoto::class);
    }

    public function sire(): BelongsTo
    {
        return $this->belongsTo(Pet::class, 'sire_id');
    }

    public function dam(): BelongsTo
    {
        return $this->belongsTo(Pet::class, 'dam_id');
    }

    public function offspringAsSire(): HasMany
    {
        return $this->hasMany(Pet::class, 'sire_id');
    }

    public function offspringAsDam(): HasMany
    {
        return $this->hasMany(Pet::class, 'dam_id');
    }

    public function getProfileImageUrlAttribute(): ?string
    {
        return $this->profile_image_path ? Storage::url($this->profile_image_path) : null;
    }

    public function getBadgesAttribute(): array
    {
        $badges = [];

        // Badge 1: Fully Profiled
        if ($this->name && $this->breed_id && $this->date_of_birth && $this->color && $this->profile_image_path) {
            $badges[] = [
                'name' => 'Fully Profiled',
                'description' => '100% Complete Profile',
                'icon' => 'Star',
                'color' => 'text-emerald-500'
            ];
        }

        // Badge 2: Health Champion
        $vaccinationCount = $this->vaccinations()->count();
        $overdueCount = $this->vaccinations()->where('next_due_date', '<', now())->count();
        
        if ($vaccinationCount >= 3 && $overdueCount === 0) {
            $badges[] = [
                'name' => 'Health Champion',
                'description' => 'Up to date on vaccinations',
                'icon' => 'ShieldCheck',
                'color' => 'text-woof-gold'
            ];
        }

        // Badge 3: Record Keeper
        if ($this->medicalRecords()->count() >= 3) {
            $badges[] = [
                'name' => 'Record Keeper',
                'description' => 'Meticulous health records',
                'icon' => 'BookOpen',
                'color' => 'text-indigo-500'
            ];
        }

        return $badges;
    }

    /**
     * Get the vaccination expiry status based on next_due_date of vaccinations.
     * Returns 'expired', 'expiring_soon', or 'valid'.
     */
    public function getVaccinationExpiryStatusAttribute(): string
    {
        $vaccinations = $this->vaccinations;
        if ($vaccinations->isEmpty()) {
            return 'valid';
        }

        $now = now();
        $thirtyDaysFromNow = now()->addDays(30);

        $hasExpired = $vaccinations->contains(fn($v) =>
            $v->next_due_date && $v->next_due_date < $now
        );

        if ($hasExpired) {
            return 'expired';
        }

        $hasExpiringSoon = $vaccinations->contains(fn($v) =>
            $v->next_due_date && $v->next_due_date >= $now && $v->next_due_date <= $thirtyDaysFromNow
        );

        return $hasExpiringSoon ? 'expiring_soon' : 'valid';
    }

    public function adPlacements(): \Illuminate\Database\Eloquent\Relations\MorphMany
    {
        return $this->morphMany(AdPlacement::class, 'promotable');
    }
}
