<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RateLimiter::for('admin', function (Request $request) {
            return Limit::perMinute(30)->by($request->user('admin')?->id ?: $request->ip());
        });

        \Illuminate\Database\Eloquent\Relations\Relation::enforceMorphMap([
            'vet' => \App\Models\VetProfile::class,
            'trainer' => \App\Models\TrainerProfile::class,
            'boarding' => \App\Models\BoardingProfile::class,
            'welfare' => \App\Models\WelfareProfile::class,
            'pet-shop' => \App\Models\PetShopProfile::class,
            'breeder' => \App\Models\BreederProfile::class,
            'litter' => \App\Models\Litter::class,
            'puppy' => \App\Models\Litter::class,
            'stud' => \App\Models\StudService::class,
            'adoption' => \App\Models\Adoption::class,
            'event' => \App\Models\Event::class,
            'gallery' => \App\Models\Gallery::class,
        ]);
    }
}
