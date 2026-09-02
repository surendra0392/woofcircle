<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use NotificationChannels\WebPush\HasPushSubscriptions;
use Laravel\Cashier\Billable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasPushSubscriptions, Billable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'mobile_number',
        'password',
        'role_id',
        'is_active',
        'avatar',
        'suspended_until',
        'state_id',
        'city_id',
        'latitude',
        'longitude',
        'karma_points',
        'listing_tier_id',
    ];

    /**
     * The attributes that should be appended to the model's array form.
     *
     * @var list<string>
     */
    protected $appends = [
        'avatar_url',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }

    /**
     * Get the primary role associated with the user.
     */
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Check if the user has a specific role by slug.
     */
    public function hasRole(string $role): bool
    {
        return $this->roles->contains('slug', $role);
    }

    /**
     * Get the breeder profile associated with the user.
     */
    public function breederProfile()
    {
        return $this->hasOne(BreederProfile::class);
    }

    /**
     * Get the vet profile associated with the user.
     */
    public function vetProfile()
    {
        return $this->hasOne(VetProfile::class);
    }

    /**
     * Get the pet shop profile associated with the user.
     */
    public function petShopProfile()
    {
        return $this->hasOne(PetShopProfile::class);
    }

    /**
     * Get the trainer profile associated with the user.
     */
    public function trainerProfile()
    {
        return $this->hasOne(TrainerProfile::class);
    }

    /**
     * Get the boarding profile associated with the user.
     */
    public function boardingProfile()
    {
        return $this->hasOne(BoardingProfile::class);
    }

    /**
     * Get the welfare profile associated with the user.
     */
    public function welfareProfile()
    {
        return $this->hasOne(WelfareProfile::class);
    }

    /**
     * Get the notifications for the user.
     */
    public function notifications()
    {
        return $this->hasMany(Notification::class)->latest();
    }

    /**
     * Get the pets associated with the user.
     */
    public function pets()
    {
        return $this->hasMany(Pet::class);
    }

    /**
     * Get the settings associated with the user.
     */
    public function settings()
    {
        return $this->hasMany(Setting::class);
    }

    public function forumThreads()
    {
        return $this->hasMany(ForumThread::class);
    }

    public function forumReplies()
    {
        return $this->hasMany(ForumReply::class);
    }

    /**
     * Get the litters associated with the user.
     */
    public function litters()
    {
        return $this->hasMany(Litter::class);
    }

    public function buyerTransferRequests()
    {
        return $this->hasMany(TransferRequest::class, 'buyer_id');
    }

    public function breederTransferRequests()
    {
        return $this->hasMany(TransferRequest::class, 'breeder_id');
    }

    /**
     * Get the stud services associated with the user.
     */
    public function studServices()
    {
        return $this->hasMany(StudService::class);
    }

    /**
     * Get the appointments associated with the user.
     */
    public function appointments()
    {
        return $this->hasManyThrough(Appointment::class, Pet::class);
    }

    /**
     * Get the vaccinations associated with the user.
     */
    public function vaccinations()
    {
        return $this->hasManyThrough(Vaccination::class, Pet::class);
    }

    /**
     * Get the medical records associated with the user.
     */
    public function medicalRecords()
    {
        return $this->hasManyThrough(MedicalRecord::class, Pet::class);
    }

    /**
     * Get the adoptions associated with the user.
     */
    public function adoptions()
    {
        return $this->hasMany(Adoption::class);
    }

    /**
     * Get the galleries associated with the user.
     */
    public function galleries()
    {
        return $this->hasMany(Gallery::class);
    }

    /**
     * Get the saved articles for the user.
     */
    public function savedArticles()
    {
        return $this->belongsToMany(Article::class, 'saved_articles')->withTimestamps();
    }

    // Removed missing savedMarketplaceListings relation

    /**
     * Get the galleries liked by the user.
     */
    public function likedGalleries()
    {
        return $this->belongsToMany(Gallery::class, 'gallery_likes')->withTimestamps();
    }

    public function followedPets()
    {
        return $this->belongsToMany(Pet::class, 'pet_followers')->withTimestamps();
    }

    public function petPhotos()
    {
        return $this->hasMany(PetPhoto::class);
    }

    public function likedPetPhotos()
    {
        return $this->belongsToMany(PetPhoto::class, 'pet_photo_likes')->withTimestamps();
    }

    /**
     * Get the saved items for the user.
     */
    public function savedItems()
    {
        return $this->hasMany(SavedItem::class);
    }

    /**
     * Get all puppy health records for the user's litters.
     */
    public function puppyHealthRecords()
    {
        return $this->hasManyThrough(PuppyHealthRecord::class, Litter::class);
    }

    /**
     * Get all health records for the user's adoptions.
     */
    public function adoptionHealthRecords()
    {
        return $this->hasManyThrough(PuppyHealthRecord::class, Adoption::class);
    }

    /**
     * Get the articles written by the user.
     */
    public function articles()
    {
        return $this->hasMany(Article::class);
    }

    /**
     * Get the conversations associated with the user.
     */
    public function conversations()
    {
        return $this->belongsToMany(Conversation::class, 'conversation_user');
    }

    /**
     * Get the messages sent by the user.
     */
    public function messages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function eventRegistrations()
    {
        return $this->hasMany(EventRegistration::class);
    }

    /**
     * Get the badges earned by the user.
     */
    public function badges()
    {
        return $this->belongsToMany(Badge::class, 'user_badges')
            ->withPivot('earned_at')
            ->withTimestamps();
    }

    /**
     * Get the user's avatar URL.
     */
    public function getAvatarUrlAttribute()
    {
        return $this->avatar ? Storage::url($this->avatar) : null;
    }

    /**
     * Get the listing tier for the user.
     */
    public function listingTier()
    {
        return $this->belongsTo(ListingTier::class);
    }

    /**
     * Get the resolved active subscription tier for the user.
     */
    public function getSubscriptionTierAttribute()
    {
        if ($this->listingTier) {
            return $this->listingTier;
        }

        return ListingTier::firstOrCreate(['id' => 1], [
            'name' => 'Free',
            'max_listings' => 1,
            'price' => 0,
        ]);
    }

    /**
     * Check if the user has an active paid subscription or tier.
     */
    public function isSubscribed(): bool
    {
        if ($this->subscribed('default')) {
            return true;
        }

        $tierId = $this->listing_tier_id;
        return $tierId && $tierId > 1;
    }

    /**
     * Check if the user is on the Connoisseur (Premium) tier.
     */
    public function isConnoisseur(): bool
    {
        $name = strtolower($this->subscription_tier->name ?? '');
        return str_contains($name, 'connoisseur') || str_contains($name, 'premium') || $this->listing_tier_id === 2;
    }

    /**
     * Check if the user is on the Sovereign Elite tier.
     */
    public function isElite(): bool
    {
        $name = strtolower($this->subscription_tier->name ?? '');
        return str_contains($name, 'sovereign') || str_contains($name, 'elite') || $this->listing_tier_id === 3;
    }

    /**
     * Maximum number of pets allowed on the user's current tier.
     */
    public function maxPetsAllowed(): int
    {
        if ($this->isSubscribed() || $this->isConnoisseur() || $this->isElite()) {
            return 999999; // Unlimited
        }

        return 2; // Free Patron tier limit
    }

    /**
     * Check if the user can register another pet.
     */
    public function canAddPet(): bool
    {
        return $this->pets()->count() < $this->maxPetsAllowed();
    }

    /**
     * Check if the user possesses the Verified Gold Shield Badge.
     */
    public function hasVerifiedShield(): bool
    {
        if ($this->isElite()) {
            return true;
        }

        // Check if user is an approved breeder or clinic with badge
        if ($this->breederProfile && $this->breederProfile->is_verified) {
            return true;
        }

        return false;
    }

    /**
     * Check if the user can generate 5-Generation Pedigree trees.
     */
    public function canAccess5GenPedigree(): bool
    {
        return $this->isSubscribed() || $this->isConnoisseur() || $this->isElite();
    }

    /**
     * Get the latest active subscription record.
     */
    public function activeSubscription()
    {
        return $this->subscriptions()->latest()->first();
    }

    /**
     * Get the total listings count for the user.
     */
    public function getTotalListingsCountAttribute()
    {
        return $this->litters()->count() + 
               $this->adoptions()->count() + 
               $this->studServices()->count();
    }

    /**
     * Check if the user can create a new listing.
     */
    public function canCreateListing()
    {
        $tier = $this->listingTier;
        if (!$tier) {
            return true; // Fallback if no tier is assigned somehow
        }

        if ($tier->max_listings === -1) {
            return true; // Unlimited
        }

        return $this->total_listings_count < $tier->max_listings;
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'suspended_until' => 'datetime',
        ];
    }
}
