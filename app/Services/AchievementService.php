<?php

namespace App\Services;

use App\Models\User;
use App\Models\Badge;

class AchievementService
{
    /**
     * Check and award badges for the given user based on their current state.
     */
    public function checkAndAward(User $user)
    {
        // Get only the badges the user does not currently have
        $unearnedBadges = Badge::whereNotIn('id', $user->badges()->select('badges.id'))->get();

        foreach ($unearnedBadges as $badge) {
            if ($this->meetsCriteria($user, $badge->criteria)) {
                $user->badges()->attach($badge->id, ['earned_at' => now()]);
            }
        }
    }

    /**
     * Determine if a user meets a specific criteria for a badge.
     */
    protected function meetsCriteria(User $user, string $criteria): bool
    {
        return match ($criteria) {
            'completed_profile' => $this->hasCompletedProfile($user),
            'added_pet' => $user->pets()->count() > 0,
            'reported_lost_pet' => $user->pets()->where('is_lost', true)->count() > 0,
            'streak_7_days' => $user->highest_login_streak >= 7,
            'streak_30_days' => $user->highest_login_streak >= 30,
            'streak_100_days' => $user->highest_login_streak >= 100,
            // We can add more criteria cases as needed
            default => false,
        };
    }

    protected function hasCompletedProfile(User $user): bool
    {
        // Simple heuristic for profile completion
        return !empty($user->avatar) && !empty($user->mobile_number);
    }

}
