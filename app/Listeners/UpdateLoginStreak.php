<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class UpdateLoginStreak
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Login $event): void
    {
        $user = $event->user;

        if (!$user instanceof \App\Models\User) {
            return;
        }

        $today = now()->startOfDay();
        $lastLogin = $user->last_login_date ? \Carbon\Carbon::parse($user->last_login_date)->startOfDay() : null;

        if (!$lastLogin) {
            $user->current_login_streak = 1;
            $user->highest_login_streak = 1;
        } elseif ($lastLogin->equalTo($today)) {
            // Already logged in today, do nothing
            return;
        } elseif ($lastLogin->equalTo($today->copy()->subDay())) {
            // Logged in yesterday, increment streak
            $user->current_login_streak += 1;
            if ($user->current_login_streak > $user->highest_login_streak) {
                $user->highest_login_streak = $user->current_login_streak;
            }
        } else {
            // Missed a day, reset streak
            $user->current_login_streak = 1;
        }

        $user->last_login_date = now();
        $user->save();
    }
}
