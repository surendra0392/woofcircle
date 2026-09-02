<?php

namespace App\Support;

use App\Models\Admin;
use App\Models\AdminAuditLog;
use App\Models\Adoption;
use App\Models\BoardingProfile;
use App\Models\Breed;
use App\Models\BreederProfile;
use App\Models\City;
use App\Models\ContactMessage;
use App\Models\Gallery;
use App\Models\Litter;
use App\Models\Pet;
use App\Models\Review;
use App\Models\Role;
use App\Models\State;
use App\Models\StudService;
use App\Models\TrainerProfile;
use App\Models\User;
use App\Models\VetProfile;
use App\Models\VetService;
use App\Models\WelfareProfile;
use Illuminate\Support\Facades\DB;

class DashboardStats
{
    /**
     * Gather all dashboard statistics, consolidated into fewer queries.
     */
    public static function all(): array
    {
        // ── 1. Core user stats (1 query instead of 2) ──
        $userStats = User::selectRaw('COUNT(*) as total, SUM(is_active) as active')->first();

        // ── 2. Directory profile stats (6 queries instead of 12) ──
        $breederStats = BreederProfile::selectRaw('COUNT(*) as total, SUM(is_active) as active')->first();
        $vetStats = VetProfile::selectRaw('COUNT(*) as total, SUM(is_active) as active')->first();
        $trainerStats = TrainerProfile::selectRaw('COUNT(*) as total, SUM(is_active) as active')->first();
        $boardingStats = BoardingProfile::selectRaw("
            COUNT(*) as total,
            SUM(is_active) as active,
            SUM(service_type = 'boarding') as boarding_only,
            SUM(service_type = 'daycare') as daycare_only,
            SUM(service_type = 'both') as boarding_both
        ")->first();
        $welfareStats = WelfareProfile::selectRaw('COUNT(*) as total, SUM(is_active) as active')->first();

        // ── 3. Marketplace stats (individual — different models, no shared aggregations) ──
        $totalLitters = Litter::count();
        $totalStuds = StudService::count();
        $totalAdoptions = Adoption::count();
        $totalPets = Pet::count();

        // ── 4. Review stats (1 query instead of 2) ──
        $reviewStats = Review::selectRaw("COUNT(*) as total, SUM(status = 'pending') as pending")->first();

        // ── 5. Catalog & location counts ──
        $breedStats = Breed::selectRaw('COUNT(*) as total, SUM(is_active) as active')->first();
        $vetServices = VetService::count();
        $specializations = 0; // Deprecated
        $states = State::count();
        $cities = City::count();

        // ── 6. System stats ──
        $admins = Admin::count();
        $roles = Role::count();

        // ── 7. Contact messages (1 query instead of 2) ──
        $contactStats = ContactMessage::selectRaw("COUNT(*) as total, SUM(status = 'new') as unread")->first();

        // ── 8. Gallery engagement ──
        // Demo gallery IDs for exclusion (hardcoded titles — consider adding is_demo flag to model)
        $demoGalleryIds = Gallery::whereIn('title', ['Puppy Training Session', 'Dog Show 2025 Highlights'])->pluck('id');

        $galleryEngagement = Gallery::selectRaw("
            COALESCE(SUM(shares_count), 0) as total_shares,
            COALESCE(SUM(exports_count), 0) as total_exports
        ")->whereNotIn('title', ['Puppy Training Session', 'Dog Show 2025 Highlights'])->first();

        $totalGalleryLikes = DB::table('gallery_likes')
            ->when($demoGalleryIds->isNotEmpty(), fn($q) => $q->whereNotIn('gallery_id', $demoGalleryIds))
            ->count();

        // ── 9. Top states (consolidate orderByRaw subqueries) ──
        $topStates = State::withCount([
            'breederProfiles',
            'vetProfiles',
            'trainerProfiles',
            'boardingProfiles',
            'welfareProfiles',
        ])->orderByRaw('(
            (SELECT COUNT(*) FROM directory_profiles WHERE directory_profiles.state_id = states.id)
        ) DESC')->take(5)->get();

        // ── 10. Passport Registry Stats ──
        $passportStats = Pet::selectRaw("
            SUM(passport_number IS NOT NULL) as total_passports,
            SUM(is_lost = 1) as lost_pets,
            SUM(transfer_count) as total_transfers
        ")->first();

        $expiringVaccinations = \App\Models\Vaccination::where('next_due_date', '<=', now()->addDays(30))
            ->where('next_due_date', '>=', now())
            ->count();

        return [
            'stats' => [
                'total_users' => (int) $userStats->total,
                'active_users' => (int) $userStats->active,
                'total_admins' => $admins,
                'total_roles' => $roles,
                'total_breeds' => (int) $breedStats->total,
                'active_breeds' => (int) $breedStats->active,
                'total_breeders' => (int) $breederStats->total,
                'active_breeders' => (int) $breederStats->active,
                'total_vets' => (int) $vetStats->total,
                'active_vets' => (int) $vetStats->active,
                'total_trainers' => (int) $trainerStats->total,
                'active_trainers' => (int) $trainerStats->active,
                'total_boarding' => (int) $boardingStats->total,
                'active_boarding' => (int) $boardingStats->active,
                'boarding_only' => (int) $boardingStats->boarding_only,
                'daycare_only' => (int) $boardingStats->daycare_only,
                'boarding_both' => (int) $boardingStats->boarding_both,
                'total_welfare' => (int) $welfareStats->total,
                'active_welfare' => (int) $welfareStats->active,
                'vet_services' => $vetServices,
                'specializations' => $specializations,
                'total_states' => $states,
                'total_cities' => $cities,
                'total_litters' => $totalLitters,
                'total_studs' => $totalStuds,
                'total_adoptions' => $totalAdoptions,
                'total_pets' => $totalPets,
                'total_reviews' => (int) $reviewStats->total,
                'pending_reviews' => (int) $reviewStats->pending,
                'total_contact_messages' => (int) $contactStats->total,
                'unread_contact_messages' => (int) $contactStats->unread,
                'total_gallery_likes' => $totalGalleryLikes,
                'total_gallery_shares' => (int) ($galleryEngagement->total_shares ?? 0),
                'total_gallery_exports' => (int) ($galleryEngagement->total_exports ?? 0),
                'total_passports' => (int) ($passportStats->total_passports ?? 0),
                'lost_pets' => (int) ($passportStats->lost_pets ?? 0),
                'expiring_vaccinations' => $expiringVaccinations,
                'total_transfers' => (int) ($passportStats->total_transfers ?? 0),
            ],
        ];
    }

    /**
     * Recent activity data (separate from counts since they fetch rows, not aggregates).
     */
    public static function recentActivity(): array
    {
        return [
            'recent_users' => User::with('role')->latest()->take(5)->get(),
            'recent_breeders' => BreederProfile::with(['state', 'city'])->latest()->take(5)->get(),
            'recent_vets' => VetProfile::with(['state', 'city'])->latest()->take(5)->get(),
            'recent_trainers' => TrainerProfile::with(['state', 'city'])->latest()->take(5)->get(),
            'recent_boarding' => BoardingProfile::with(['state', 'city'])->latest()->take(5)->get(),
            'recent_welfare' => WelfareProfile::with(['state', 'city'])->latest()->take(5)->get(),
            'recent_reviews' => Review::with(['user', 'reviewable'])->latest()->take(5)->get(),
            'recent_logs' => AdminAuditLog::with('admin')->latest()->take(6)->get(),
        ];
    }

    /**
     * Top states by combined directory listings.
     */
    public static function topStates()
    {
        return State::withCount([
            'breederProfiles',
            'vetProfiles',
            'trainerProfiles',
            'boardingProfiles',
            'welfareProfiles',
        ])->orderByRaw('(
            (SELECT COUNT(*) FROM directory_profiles WHERE directory_profiles.state_id = states.id)
        ) DESC')->take(5)->get();
    }
}

