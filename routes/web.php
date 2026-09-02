<?php

use App\Http\Controllers\BreederHealthRecordController;
use App\Http\Controllers\BreederLitterController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\BookingController;

use App\Http\Controllers\MarketplaceController;
use App\Http\Controllers\MemberAdoptionController;
use App\Http\Controllers\MemberStudServiceController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PublicBreedController;
use App\Http\Controllers\PublicCommunityController;
use App\Http\Controllers\PublicContactController;
use App\Http\Controllers\PublicDirectoryController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SaveItemController;
use App\Http\Controllers\SupportTicketController;
use App\Http\Controllers\UserAppointmentController;
use App\Http\Controllers\UserDashboardController;
use App\Http\Controllers\UserGalleryController;
use App\Http\Controllers\PetHealthController;
use App\Http\Controllers\UserPetController;
use App\Http\Controllers\PetPassportController;
use App\Http\Controllers\BreedComparisonController;
use App\Http\Controllers\LostPetController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\ForumController;
use App\Http\Controllers\PedigreeController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\PublicCareerController;
use Illuminate\Support\Facades\Route;

Route::get('/pets/passport-verification', [PetPassportController::class, 'index'])->name('pets.passport.index');
Route::get('/pets/passport/{passport}', [PetPassportController::class, 'show'])->name('pets.passport.show');
Route::get('/pets/passport/{passport}/pdf', [PetPassportController::class, 'pdf'])->name('pets.passport.pdf');
Route::get('/pets/{pet}/pedigree', [PedigreeController::class, 'show'])->name('pets.pedigree.show');
Route::get('/api/cities/{state}', [PublicDirectoryController::class, 'citiesByState'])->name('api.cities.by-state');
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');




Route::get('/about', function () {
    return Inertia::render('about');
})->name('about');

Route::get('/help-center', function () {
    return Inertia::render('help-center');
})->name('help-center');

Route::get('/privacy-policy', function () {
    return Inertia::render('privacy-policy');
})->name('privacy-policy');

Route::get('/terms-and-ethics', function () {
    return Inertia::render('terms-and-ethics');
})-> name('terms-and-ethics');

Route::get('/careers', [PublicCareerController::class, 'index'])->name('careers');
Route::post('/careers/apply', [PublicCareerController::class, 'apply'])->name('careers.apply');

Route::get('/contact', [PublicContactController::class, 'index'])->name('contact');
Route::post('/contact', [PublicContactController::class, 'store'])->name('contact.store');

// Public Marketplace Redirect & Routes
Route::redirect('/marketplace', '/puppies');

Route::get('/breeds', [PublicBreedController::class, 'index'])->name('breeds.index');
Route::get('/breeds/compare', [BreedComparisonController::class, 'index'])->name('breeds.compare');
Route::get('/breeds/{slug}', [PublicBreedController::class, 'show'])->name('breeds.show');

Route::get('/pricing', [SubscriptionController::class, 'pricing'])->name('subscription.pricing');

Route::get('/api/cities/{state}', [PublicDirectoryController::class, 'citiesByState'])->name('api.cities.by-state');
Route::get('/api/location/search', [\App\Http\Controllers\LocationController::class, 'search'])->name('api.location.search');
Route::post('/api/location/set', [\App\Http\Controllers\LocationController::class, 'set'])->name('api.location.set');
Route::get('/api/location/nearby', [\App\Http\Controllers\LocationController::class, 'nearby'])->name('api.location.nearby');
use App\Http\Controllers\Community\FeedController;
use App\Http\Controllers\Community\LeaderboardController;
use App\Http\Controllers\UserPetFollowController;

// ── Community & auth routes (registered first so they take priority over {location}) ──
Route::get('/community/leaderboard', [LeaderboardController::class, 'index'])->name('community.leaderboard');

Route::get('/community/feed', [FeedController::class, 'index'])->name('community.feed.index');
Route::post('/community/feed', [FeedController::class, 'store'])->name('community.feed.store')->middleware('auth');
Route::post('/community/feed/{photo}/like', [FeedController::class, 'toggleLike'])->name('community.feed.like')->middleware('auth');

Route::post('/pets/{pet}/follow', [UserPetFollowController::class, 'toggle'])->name('pets.follow')->middleware('auth');

Route::get('/events', [PublicCommunityController::class, 'events'])->name('community.events.index');
Route::get('/events/{slug}', [PublicCommunityController::class, 'eventShow'])->name('community.events.show');
Route::post('/events/{event}/register', [PublicCommunityController::class, 'registerEvent'])->name('community.events.register')->middleware('auth');

Route::get('/articles', [PublicCommunityController::class, 'articles'])->name('community.articles.index');
Route::get('/articles/{slug}', [PublicCommunityController::class, 'articleShow'])->name('community.articles.show');

Route::get('/gallery', [PublicCommunityController::class, 'gallery'])->name('community.gallery.index');
Route::get('/gallery/{slug}', [PublicCommunityController::class, 'galleryShow'])->name('community.gallery.show');
Route::get('/gallery/{slug}/download', [PublicCommunityController::class, 'galleryExportZip'])->name('community.gallery.download');
Route::get('/gallery/{slug}/export-zip', [PublicCommunityController::class, 'galleryExportZip'])->name('community.gallery.export-zip');
Route::get('/gallery/{slug}/export', [PublicCommunityController::class, 'galleryExportZip']);
Route::get('/api/export-zip', [PublicCommunityController::class, 'galleryExportZip'])->name('api.export-zip');
Route::post('/gallery/{slug}/like', [PublicCommunityController::class, 'galleryLike'])->name('community.gallery.like');
Route::post('/gallery/{slug}/share', [PublicCommunityController::class, 'galleryShare'])->name('community.gallery.share');
Route::post('/gallery/{slug}/export', [PublicCommunityController::class, 'galleryExport'])->name('community.gallery.export');

Route::get('/reviews', [ReviewController::class, 'index'])->name('reviews.index');

Route::post('/api/track-interaction', function (\Illuminate\Http\Request $request) {
    $request->validate([
        'viewable_type' => 'required|string',
        'viewable_id' => 'required|integer',
        'interaction_type' => 'required|in:phone_click,website_click,booking_click',
    ]);
    \App\Models\ProfileView::create([
        'viewable_type' => $request->viewable_type,
        'viewable_id' => $request->viewable_id,
        'ip_address' => $request->ip(),
        'interaction_type' => $request->interaction_type,
    ]);
    return response()->json(['ok' => true]);
})->name('api.track-interaction');

Route::get('/lost-pets', [LostPetController::class, 'index'])->name('lost-pets.index');
Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe'])->name('newsletter.subscribe');
Route::get('/newsletter/unsubscribe/{token}', [NewsletterController::class, 'unsubscribe'])->name('newsletter.unsubscribe');

// Forum Routes
Route::get('/forum', [ForumController::class, 'index'])->name('forum.index');
Route::get('/forum/{category:slug}', [ForumController::class, 'category'])->name('forum.category');
Route::get('/forum/{category:slug}/{thread:slug}', [ForumController::class, 'show'])->name('forum.thread');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

// ── Portal Logins ──
Route::get('/hr/login', [\App\Http\Controllers\Admin\PortalAuthController::class, 'showHrLogin'])->name('hr.login');
Route::post('/hr/login', [\App\Http\Controllers\Admin\PortalAuthController::class, 'hrLogin']);
Route::post('/hr/logout', [\App\Http\Controllers\Admin\PortalAuthController::class, 'hrLogout'])->name('hr.logout');

Route::get('/agent/login', [\App\Http\Controllers\Admin\PortalAuthController::class, 'showAgentLogin'])->name('agent.login');
Route::post('/agent/login', [\App\Http\Controllers\Admin\PortalAuthController::class, 'agentLogin']);
Route::post('/agent/logout', [\App\Http\Controllers\Admin\PortalAuthController::class, 'agentLogout'])->name('agent.logout');

Route::get('/support/login', [\App\Http\Controllers\Admin\PortalAuthController::class, 'showSupportLogin'])->name('support.login');
Route::post('/support/login', [\App\Http\Controllers\Admin\PortalAuthController::class, 'supportLogin']);
Route::post('/support/logout', [\App\Http\Controllers\Admin\PortalAuthController::class, 'supportLogout'])->name('support.logout');

$locationRoutes = function () {
    Route::get('/puppies', [MarketplaceController::class, 'index'])->name('marketplace.index');
    Route::get('/puppies/{slug}', [MarketplaceController::class, 'show'])->name('marketplace.litters.show');

    Route::get('/breeders', [MarketplaceController::class, 'breeders'])->name('marketplace.breeders.index');
    Route::get('/breeders/{slug}', [MarketplaceController::class, 'breederShow'])->name('marketplace.breeders.show');

    Route::get('/studs', [MarketplaceController::class, 'studs'])->name('marketplace.studs.index');
    Route::get('/studs/{slug}', [MarketplaceController::class, 'studShow'])->name('marketplace.studs.show');
    
    Route::get('/adoptions', [MarketplaceController::class, 'adoption'])->name('marketplace.adoption.index');
    Route::get('/adoptions/{slug}', [MarketplaceController::class, 'adoptionShow'])->name('marketplace.adoption.show');

    // Directory
    Route::get('/directory', [PublicDirectoryController::class, 'index'])->name('directory.index');
    Route::get('/vets', [PublicDirectoryController::class, 'vets'])->name('directory.vets');
    Route::get('/vets/{slug}', [PublicDirectoryController::class, 'vetShow'])->name('directory.vets.show');
    Route::post('/vets/{vet}/book-appointment', [PublicDirectoryController::class, 'bookAppointment'])->name('directory.vets.book-appointment')->middleware('auth');
    
    Route::get('/trainers', [PublicDirectoryController::class, 'trainers'])->name('directory.trainers');
    Route::get('/trainers/{slug}', [PublicDirectoryController::class, 'trainerShow'])->name('directory.trainers.show');
    Route::post('/trainers/{trainer}/book-mastery', [PublicDirectoryController::class, 'bookMastery'])->name('directory.trainers.book-mastery')->middleware('auth');
    
    Route::get('/boarding', [PublicDirectoryController::class, 'boarding'])->name('directory.boarding');
    Route::get('/boarding/{slug}', [PublicDirectoryController::class, 'boardingShow'])->name('directory.boarding.show');
    Route::post('/boarding/{boarding}/book', [PublicDirectoryController::class, 'bookBoarding'])->name('directory.boarding.book')->middleware('auth');
    
    Route::get('/welfare', [PublicDirectoryController::class, 'welfare'])->name('directory.welfare');
    Route::get('/welfare/{slug}', [PublicDirectoryController::class, 'welfareShow'])->name('directory.welfare.show');
    
    Route::get('/pet-shops', [PublicDirectoryController::class, 'petShops'])->name('directory.pet-shops');
    Route::get('/pet-shops/{slug}', [PublicDirectoryController::class, 'petShopShow'])->name('directory.pet-shops.show');
    Route::post('/pet-shops/{petShop}/inquire', [PublicDirectoryController::class, 'inquirePetShop'])->name('directory.pet-shops.inquire')->middleware('auth');

    // Bookings
    Route::get('/api/bookings/slots', [BookingController::class, 'getAvailableSlots'])->name('api.bookings.slots');
    Route::post('/api/bookings', [BookingController::class, 'store'])->name('api.bookings.store')->middleware('auth');
};

Route::middleware('auth')->group(function () {
    // Subscription Routes
    Route::get('/settings/subscription', [SubscriptionController::class, 'index'])->name('subscription.index');
    Route::get('/dashboard/subscription', [SubscriptionController::class, 'index'])->name('dashboard.subscription');
    Route::post('/subscription/checkout', [SubscriptionController::class, 'createCheckoutSession'])->name('subscription.checkout');
    Route::post('/subscription/verify-razorpay', [SubscriptionController::class, 'verifyRazorpayPayment'])->name('subscription.verify-razorpay');
    Route::get('/subscription/success', [SubscriptionController::class, 'handleStripeSuccess'])->name('subscription.success');
    Route::post('/subscription/cancel', [SubscriptionController::class, 'cancel'])->name('subscription.cancel');
    Route::post('/subscription/resume', [SubscriptionController::class, 'resume'])->name('subscription.resume');

    // Forum Auth Routes
    Route::get('/forum/{category:slug}/create/thread', [ForumController::class, 'create'])->name('forum.create');
    Route::post('/forum/{category:slug}', [ForumController::class, 'store'])->name('forum.store');
    Route::post('/forum/{category:slug}/{thread:slug}/reply', [ForumController::class, 'storeReply'])->name('forum.reply.store');

    Route::post('/articles/{slug}/save', [PublicCommunityController::class, 'articleSave'])->name('community.articles.save');
    Route::post('/save-item/{type}/{id}', [SaveItemController::class, 'toggle'])->name('save-item.toggle');
    Route::post('/marketplace/litters/{litter}/convert', [MarketplaceController::class, 'convertToPet'])->name('marketplace.litters.convert');
    Route::post('/marketplace/puppies/{litter}/request-transfer', [MarketplaceController::class, 'requestTransfer'])->name('marketplace.litters.request-transfer');
    Route::post('/marketplace/adoption/{adoption}/express-interest', [ChatController::class, 'expressInterestAdoption'])->name('marketplace.adoption.express-interest');
    Route::post('/marketplace/studs/{stud}/book-consultation', [ChatController::class, 'bookConsultationStud'])->name('marketplace.studs.book-consultation');
    Route::post('/dashboard/breeder/transfer-requests/{request}/approve', [BreederHealthRecordController::class, 'approveTransferRequest'])->name('breeder.litters.transfer-requests.approve');
    Route::post('/dashboard/breeder/transfer-requests/{request}/reject', [BreederHealthRecordController::class, 'rejectTransferRequest'])->name('breeder.litters.transfer-requests.reject');

    Route::get('dashboard', [UserDashboardController::class, 'index'])->name('dashboard');
    Route::get('dashboard/saved', [UserDashboardController::class, 'savedListings'])->name('dashboard.saved');
    Route::get('dashboard/reviews', [UserDashboardController::class, 'reviews'])->name('dashboard.reviews');
    Route::get('dashboard/business/analytics', [App\Http\Controllers\ProviderAnalyticsController::class, 'index'])->name('dashboard.business.analytics');
    Route::get('dashboard/business/bookings', [App\Http\Controllers\ProviderBookingController::class, 'index'])->name('dashboard.business.bookings');
    Route::patch('dashboard/business/bookings/{booking}', [App\Http\Controllers\ProviderBookingController::class, 'updateStatus'])->name('dashboard.business.bookings.update');
    Route::get('dashboard/business/availability', [App\Http\Controllers\ProviderBookingController::class, 'availabilityIndex'])->name('dashboard.business.availability');
    Route::post('dashboard/business/availability', [App\Http\Controllers\ProviderBookingController::class, 'storeAvailability'])->name('dashboard.business.availability.store');
    Route::delete('dashboard/business/availability/{availability}', [App\Http\Controllers\ProviderBookingController::class, 'destroyAvailability'])->name('dashboard.business.availability.destroy');

    // Chat / Messages
    Route::get('/chat/initiate/{user}', [ChatController::class, 'initiate'])->name('chat.initiate');
    Route::patch('/chat/{conversation}/read', [ChatController::class, 'markAsRead'])->name('chat.read');

    Route::prefix('dashboard/messages')->name('dashboard.messages.')->group(function () {
        Route::get('/', [ChatController::class, 'index'])->name('index');
        Route::get('/{conversation}', [ChatController::class, 'show'])->name('show');
        Route::post('/{conversation}', [ChatController::class, 'store'])->name('store');
        Route::delete('/{conversation}', [ChatController::class, 'destroy'])->name('destroy');
    });

    // Profile Routes (breeder, trainer, vet, boarding, welfare, pet-shop)
    // Trainer uses /dashboard/trainer/profile; all others use /{slug}/profile
    $profileTypes = [
        'breeder' => ['slug' => 'breeder'],
        'trainer' => ['slug' => 'trainer', 'profile_prefix' => 'dashboard/trainer'],
        'vet' => ['slug' => 'vet'],
        'boarding' => ['slug' => 'boarding'],
        'welfare' => ['slug' => 'welfare'],
        'pet-shop' => ['slug' => 'pet-shop'],
    ];

    foreach ($profileTypes as $type => $config) {
        $slug = $config['slug'];
        $profilePrefix = $config['profile_prefix'] ?? $slug;

        Route::get("/dashboard/{$slug}", [ProfileController::class, 'index'])->name("{$type}.dashboard")->defaults('type', $type);
        Route::get("/{$profilePrefix}/profile", [ProfileController::class, 'edit'])->name("{$type}.profile.edit")->defaults('type', $type);
        Route::post("/{$profilePrefix}/profile", [ProfileController::class, 'update'])->name("{$type}.profile.update")->defaults('type', $type);
        Route::delete("/{$profilePrefix}/gallery/{imageId}", [ProfileController::class, 'deleteGalleryImage'])->name("{$type}.gallery.destroy")->defaults('type', $type);
    }

    // Breeder Litters (Marketplace)
    Route::get('/dashboard/breeder/litters', [BreederLitterController::class, 'index'])->name('breeder.litters.index');
    Route::get('/dashboard/breeder/litters/create', [BreederLitterController::class, 'create'])->name('breeder.litters.create');
    Route::post('/dashboard/breeder/litters', [BreederLitterController::class, 'store'])->name('breeder.litters.store');
    Route::get('/dashboard/breeder/litters/{litter}/edit', [BreederLitterController::class, 'edit'])->name('breeder.litters.edit');
    Route::post('/dashboard/breeder/litters/{litter}', [BreederLitterController::class, 'update'])->name('breeder.litters.update');
    Route::delete('/dashboard/breeder/litters/{litter}', [BreederLitterController::class, 'destroy'])->name('breeder.litters.destroy');
    Route::delete('/dashboard/breeder/litters/image/{image}', [BreederLitterController::class, 'deleteImage'])->name('breeder.litters.image.destroy');

    // Breeder Litter Health Records
    Route::get('/dashboard/breeder/litters/{litter}/health-records', [BreederHealthRecordController::class, 'index'])->name('breeder.litters.health-records.index');
    Route::post('/dashboard/breeder/litters/{litter}/health-records', [BreederHealthRecordController::class, 'store'])->name('breeder.litters.health-records.store');
    Route::post('/dashboard/breeder/litters/{litter}/health-records/{record}', [BreederHealthRecordController::class, 'update'])->name('breeder.litters.health-records.update');
    Route::delete('/dashboard/breeder/litters/{litter}/health-records/{record}', [BreederHealthRecordController::class, 'destroy'])->name('breeder.litters.health-records.destroy');
    Route::post('/dashboard/breeder/litters/{litter}/transfer', [BreederHealthRecordController::class, 'transfer'])->name('breeder.litters.transfer');

    // Adoption Management
    Route::get('/dashboard/adoptions', [MemberAdoptionController::class, 'index'])->name('dashboard.adoptions.index');
    Route::get('/dashboard/adoptions/create', [MemberAdoptionController::class, 'create'])->name('dashboard.adoptions.create');
    Route::post('/dashboard/adoptions', [MemberAdoptionController::class, 'store'])->name('dashboard.adoptions.store');
    Route::get('/dashboard/adoptions/{adoption}/edit', [MemberAdoptionController::class, 'edit'])->name('dashboard.adoptions.edit');
    Route::post('/dashboard/adoptions/{adoption}', [MemberAdoptionController::class, 'update'])->name('dashboard.adoptions.update');
    Route::delete('/dashboard/adoptions/{adoption}', [MemberAdoptionController::class, 'destroy'])->name('dashboard.adoptions.destroy');
    Route::delete('/dashboard/adoptions/image/{image}', [MemberAdoptionController::class, 'deleteImage'])->name('dashboard.adoptions.image.destroy');

    // Stud Service Management
    Route::get('/dashboard/stud-services', [MemberStudServiceController::class, 'index'])->name('dashboard.stud-services.index');
    Route::get('/dashboard/stud-services/create', [MemberStudServiceController::class, 'create'])->name('dashboard.stud-services.create');
    Route::post('/dashboard/stud-services', [MemberStudServiceController::class, 'store'])->name('dashboard.stud-services.store');
    Route::get('/dashboard/stud-services/{studService}/edit', [MemberStudServiceController::class, 'edit'])->name('dashboard.stud-services.edit');
    Route::post('/dashboard/stud-services/{studService}', [MemberStudServiceController::class, 'update'])->name('dashboard.stud-services.update');
    Route::delete('/dashboard/stud-services/{studService}', [MemberStudServiceController::class, 'destroy'])->name('dashboard.stud-services.destroy');
    Route::delete('/dashboard/stud-services/images/{image}', [MemberStudServiceController::class, 'deleteImage'])->name('dashboard.stud-services.images.destroy');

    // Pet Management
    Route::get('/dashboard/pets', [UserPetController::class, 'index'])->name('pets.index');
    Route::get('/dashboard/pets/create', [UserPetController::class, 'create'])->name('pets.create');
    Route::post('/dashboard/pets', [UserPetController::class, 'store'])->name('pets.store');
    Route::get('/dashboard/pets/{pet}/edit', [UserPetController::class, 'edit'])->name('pets.edit');
    Route::post('/dashboard/pets/{pet}', [UserPetController::class, 'update'])->name('pets.update');
    Route::delete('/dashboard/pets/{pet}', [UserPetController::class, 'destroy'])->name('pets.destroy');
    Route::post('/dashboard/pets/{pet}/report-lost', [LostPetController::class, 'reportLost'])->name('pets.report-lost');
    Route::post('/dashboard/pets/{pet}/mark-found', [LostPetController::class, 'markFound'])->name('pets.mark-found');

    // User Gallery Management
    Route::get('/dashboard/gallery', [UserGalleryController::class, 'index'])->name('dashboard.gallery.index');
    Route::get('/dashboard/gallery/create', [UserGalleryController::class, 'create'])->name('dashboard.gallery.create');
    Route::post('/dashboard/gallery', [UserGalleryController::class, 'store'])->name('dashboard.gallery.store');
    Route::get('/dashboard/gallery/{gallery}/edit', [UserGalleryController::class, 'edit'])->name('dashboard.gallery.edit');
    Route::post('/dashboard/gallery/{gallery}', [UserGalleryController::class, 'update'])->name('dashboard.gallery.update');
    Route::delete('/dashboard/gallery/{gallery}', [UserGalleryController::class, 'destroy'])->name('dashboard.gallery.destroy');
    Route::delete('/dashboard/gallery/images/{image}', [UserGalleryController::class, 'deleteImage'])->name('dashboard.gallery.images.destroy');

    // Pet Health Management (Vaccinations & Medical Records)
    Route::controller(PetHealthController::class)->prefix('dashboard/pets/{pet}')->group(function () {
        // Vaccinations
        Route::get('vaccinations', 'indexVaccinations')->name('pets.vaccinations.index');
        Route::get('vaccinations/create', 'createVaccination')->name('pets.vaccinations.create');
        Route::post('vaccinations', 'storeVaccination')->name('pets.vaccinations.store');
        Route::get('vaccinations/{vaccination}/edit', 'editVaccination')->name('pets.vaccinations.edit');
        Route::post('vaccinations/{vaccination}', 'updateVaccination')->name('pets.vaccinations.update');
        Route::delete('vaccinations/{vaccination}', 'destroyVaccination')->name('pets.vaccinations.destroy');

        // Medical Records
        Route::get('medical-records', 'indexMedicalRecords')->name('pets.medical-records.index');
        Route::get('medical-records/create', 'createMedicalRecord')->name('pets.medical-records.create');
        Route::post('medical-records', 'storeMedicalRecord')->name('pets.medical-records.store');
        Route::get('medical-records/{medicalRecord}/edit', 'editMedicalRecord')->name('pets.medical-records.edit');
        Route::post('medical-records/{medicalRecord}', 'updateMedicalRecord')->name('pets.medical-records.update');
        Route::delete('medical-records/{medicalRecord}', 'destroyMedicalRecord')->name('pets.medical-records.destroy');
    });

    // Appointments Management
    Route::resource('dashboard/pets/{pet}/appointments', UserAppointmentController::class)
        ->names('pets.appointments')
        ->except(['show']);

    // Notifications
    Route::get('/dashboard/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::get('/notifications/latest', [NotificationController::class, 'latest'])->name('notifications.latest');
    Route::post('/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
    
    // Web Push Subscriptions
    Route::post('/push/subscribe', [App\Http\Controllers\PushSubscriptionController::class, 'update'])->name('push.subscribe');
    Route::delete('/push/unsubscribe', [App\Http\Controllers\PushSubscriptionController::class, 'destroy'])->name('push.unsubscribe');
    // Reviews
    Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');
    Route::put('/reviews/{review}', [ReviewController::class, 'update'])->name('reviews.update');
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy'])->name('reviews.destroy');
    // Support Tickets
    Route::post('/help-center/tickets', [SupportTicketController::class, 'store'])->name('help-center.tickets.store');
    Route::prefix('dashboard/support')->name('dashboard.support.')->group(function () {
        Route::get('/', [SupportTicketController::class, 'index'])->name('index');
        Route::get('/{ticket}', [SupportTicketController::class, 'show'])->name('show');
        Route::post('/{ticket}', [SupportTicketController::class, 'update'])->name('update');
    });
});

// Ziggy deferred route loader — returns route definitions for a named group.
// Auth gates: public = open (no throttle — hit on every page load),
// dashboard = authenticated user, admin = admin guard.
// Cache-Control: 1 hour since route definitions only change between deploys.
Route::get('/api/ziggy/{group}', function (string $group) {
    if ($group === 'admin') {
        if (! auth('admin')->check()) {
            abort(403, 'Admin authentication required to fetch admin routes.');
        }
    } elseif ($group === 'dashboard') {
        if (! auth()->check()) {
            abort(401, 'Authentication required to fetch dashboard routes.');
        }
    }

    return response()->json(
        (new Tighten\Ziggy\Ziggy($group))->toArray(),
        200,
        ['Cache-Control' => app()->isLocal() ? 'no-cache, no-store, must-revalidate' : 'public, max-age=3600']
    );
})->middleware('web');

// Register the routes directly
$locationRoutes();

// SEO City Routes for Footer Links (exclude reserved portal prefixes)
Route::get('/{city}/puppies', function (\Illuminate\Http\Request $request, $city) {
    $request->merge(['search' => $city]);
    return app(\App\Http\Controllers\MarketplaceController::class)->index($request);
})->where('city', '^(?!admin|agent|support|hr|dashboard|api|login|register|logout).*$')->name('seo.city.puppies');

Route::get('/{city}/breeders', function (\Illuminate\Http\Request $request, $city) {
    $request->merge(['search' => $city]);
    return app(\App\Http\Controllers\MarketplaceController::class)->breeders($request);
})->where('city', '^(?!admin|agent|support|hr|dashboard|api|login|register|logout).*$')->name('seo.city.breeders');

// Visual Display Banners & Ad Tracking
Route::get('/api/ads/banner/{slot}', [\App\Http\Controllers\PublicAdController::class, 'getBanner'])->name('ads.banner');
Route::post('/api/ads/{adPlacement}/impression', [\App\Http\Controllers\PublicAdController::class, 'trackImpression'])->name('ads.impression');
Route::get('/ads/{adPlacement}/click', [\App\Http\Controllers\PublicAdController::class, 'trackClick'])->name('ads.click');

