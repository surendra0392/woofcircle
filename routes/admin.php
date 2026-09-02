<?php

use App\Http\Controllers\Admin\AdminAdoptionController;
use App\Http\Controllers\Admin\AdminAppointmentController;
use App\Http\Controllers\Admin\AdminArticleCategoryController;
use App\Http\Controllers\Admin\AdminArticleController;
use App\Http\Controllers\Admin\AdminAuditLogController;
use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminDirectoryController;
use App\Http\Controllers\Admin\AdminBreedController;

use App\Http\Controllers\Admin\AdminCareerPositionController;
use App\Http\Controllers\Admin\AdminCareerApplicationController;
use App\Http\Controllers\Admin\AdminContactController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminEventController;
use App\Http\Controllers\Admin\AdminEventTypeController;
use App\Http\Controllers\Admin\AdminGalleryCategoryController;
use App\Http\Controllers\Admin\AdminGalleryController;
use App\Http\Controllers\Admin\AdminLitterController;
use App\Http\Controllers\Admin\AdminManagementController;
use App\Http\Controllers\Admin\AdminMedicalRecordController;
use App\Http\Controllers\Admin\AdminNotificationController;
use App\Http\Controllers\Admin\AdminPetController;
use App\Http\Controllers\Admin\AdminProfileController;
use App\Http\Controllers\Admin\AdminPuppyHealthRecordController;
use App\Http\Controllers\Admin\AdminReviewController;
use App\Http\Controllers\Admin\AdminRoleController;
use App\Http\Controllers\Admin\AdminSettingController;
use App\Http\Controllers\Admin\AdminListingTierController;
use App\Http\Controllers\Admin\AdminStudServiceController;
use App\Http\Controllers\Admin\AdminSupportTicketController;
use App\Http\Controllers\Admin\BulkActionController;
use App\Http\Controllers\Admin\AdminTrainerSpecializationController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminVaccinationController;
use App\Http\Controllers\Admin\AdminVetServiceController;
use App\Http\Controllers\Admin\CityController;
use App\Http\Controllers\Admin\StateController;
use App\Http\Controllers\Admin\UserAuditLogController;
use App\Http\Middleware\RedirectIfAdmin;
use Illuminate\Support\Facades\Route;

// Admin root redirect (/admin or /admin/)
Route::get('/', function () {
    return redirect()->route('admin.dashboard');
});

// Admin guest routes
Route::middleware(RedirectIfAdmin::class)->group(function () {
    Route::get('login', [AdminAuthController::class, 'showLogin'])->name('login');
    Route::post('login', [AdminAuthController::class, 'login']);
});

// Admin authenticated routes
Route::middleware(['auth:admin', 'throttle:admin', \App\Http\Middleware\CheckAdmin::class])->group(function () {
    Route::post('logout', [AdminAuthController::class, 'logout'])->name('logout');

    Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Bulk Delete Action
    Route::delete('bulk-delete', [BulkActionController::class, 'destroy'])->name('bulk.destroy');

    // Profile Management
    Route::get('profile', [AdminProfileController::class, 'edit'])->name('profile.edit');
    Route::put('profile', [AdminProfileController::class, 'update'])->name('profile.update');
    Route::put('profile/password', [AdminProfileController::class, 'updatePassword'])->name('profile.password.update');

    // Platform Settings
    Route::get('settings', [AdminSettingController::class, 'index'])->name('settings.index');
    Route::put('settings', [AdminSettingController::class, 'update'])->name('settings.update');
    Route::get('settings/payments', [AdminSettingController::class, 'payments'])->name('settings.payments');
    Route::put('settings/payments', [AdminSettingController::class, 'updatePayments'])->name('settings.payments.update');
    Route::get('states', [StateController::class, 'index'])->name('states.index');
    Route::post('states', [StateController::class, 'store'])->name('states.store');
    Route::put('states/{state}', [StateController::class, 'update'])->name('states.update');
    Route::delete('states/{state}', [StateController::class, 'destroy'])->name('states.destroy');

    Route::get('cities', [CityController::class, 'index'])->name('cities.index');
    Route::post('cities', [CityController::class, 'store'])->name('cities.store');
    Route::put('cities/{city}', [CityController::class, 'update'])->name('cities.update');
    Route::delete('cities/{city}', [CityController::class, 'destroy'])->name('cities.destroy');

    Route::get('breeds', [AdminBreedController::class, 'index'])->name('breeds.index');
    Route::get('breeds/create', [AdminBreedController::class, 'create'])->name('breeds.create');
    Route::post('breeds', [AdminBreedController::class, 'store'])->name('breeds.store');
    Route::get('breeds/{breed}/edit', [AdminBreedController::class, 'edit'])->name('breeds.edit');
    Route::post('breeds/{breed}', [AdminBreedController::class, 'update'])->name('breeds.update'); // POST instead of PUT because of file uploads in FormData
    Route::delete('breeds/{breed}', [AdminBreedController::class, 'destroy'])->name('breeds.destroy');

    Route::get('users', [AdminUserController::class, 'index'])->name('users.index');
    Route::post('users', [AdminUserController::class, 'store'])->name('users.store');
    Route::put('users/{user}', [AdminUserController::class, 'update'])->name('users.update');
    Route::patch('users/{user}/suspend', [AdminUserController::class, 'suspend'])->name('users.suspend');
    Route::patch('users/{user}/toggle-active', [AdminUserController::class, 'toggleActive'])->name('users.toggle-active');
    Route::delete('users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');

    // Listing Tiers
    Route::get('listing-tiers', [AdminListingTierController::class, 'index'])->name('listing-tiers.index');
    Route::post('listing-tiers', [AdminListingTierController::class, 'store'])->name('listing-tiers.store');
    Route::put('listing-tiers/{tier}', [AdminListingTierController::class, 'update'])->name('listing-tiers.update');
    Route::delete('listing-tiers/{tier}', [AdminListingTierController::class, 'destroy'])->name('listing-tiers.destroy');

    // Admin Management
    Route::get('admins', [AdminManagementController::class, 'index'])->name('admins.index');
    Route::post('admins', [AdminManagementController::class, 'store'])->name('admins.store');
    Route::put('admins/{admin}', [AdminManagementController::class, 'update'])->name('admins.update');
    Route::patch('admins/{admin}/toggle-active', [AdminManagementController::class, 'toggleActive'])->name('admins.toggle-active');
    Route::delete('admins/{admin}', [AdminManagementController::class, 'destroy'])->name('admins.destroy');

    Route::get('roles', [AdminRoleController::class, 'index'])->name('roles.index');
    Route::post('roles', [AdminRoleController::class, 'store'])->name('roles.store');
    Route::put('roles/{role}', [AdminRoleController::class, 'update'])->name('roles.update');
    Route::delete('roles/{role}', [AdminRoleController::class, 'destroy'])->name('roles.destroy');

    // Review Management
    Route::get('reviews', [AdminReviewController::class, 'index'])->name('reviews.index');
    Route::post('reviews', [AdminReviewController::class, 'store'])->name('reviews.store');
    Route::put('reviews/{review}', [AdminReviewController::class, 'update'])->name('reviews.update');
    Route::delete('reviews/{review}', [AdminReviewController::class, 'destroy'])->name('reviews.destroy');

    // Directory Profile Management (breeder, vet, trainer, boarding, welfare, pet-shop)
    // Prefixes sourced from ProfileConfig.admin_route_prefix to match original URL patterns
    $directoryTypes = [
        'breeder' => ['prefix' => 'breeders', 'has_verified' => true],
        'vet' => ['prefix' => 'vets', 'has_verified' => false],
        'trainer' => ['prefix' => 'trainers', 'has_verified' => false],
        'boarding' => ['prefix' => 'boarding', 'has_verified' => false],
        'welfare' => ['prefix' => 'welfare', 'has_verified' => false],
        'pet-shop' => ['prefix' => 'pet-shops', 'has_verified' => false],
    ];

    foreach ($directoryTypes as $type => $options) {
        $routePrefix = $options['prefix'];
        $namePrefix = $routePrefix;
        $param = '{id}';
        $galleryParam = '{galleryId}';

        Route::get($routePrefix, [AdminDirectoryController::class, 'index'])->name($namePrefix . '.index')->defaults('type', $type);
        Route::get($routePrefix . '/create', [AdminDirectoryController::class, 'create'])->name($namePrefix . '.create')->defaults('type', $type);
        Route::post($routePrefix, [AdminDirectoryController::class, 'store'])->name($namePrefix . '.store')->defaults('type', $type);
        Route::get($routePrefix . '/' . $param . '/edit', [AdminDirectoryController::class, 'edit'])->name($namePrefix . '.edit')->defaults('type', $type);
        Route::match(['POST', 'PUT'], $routePrefix . '/' . $param, [AdminDirectoryController::class, 'update'])->name($namePrefix . '.update')->defaults('type', $type);
        Route::patch($routePrefix . '/' . $param . '/toggle-active', [AdminDirectoryController::class, 'toggleActive'])->name($namePrefix . '.toggle-active')->defaults('type', $type);
        Route::delete($routePrefix . '/' . $param, [AdminDirectoryController::class, 'destroy'])->name($namePrefix . '.destroy')->defaults('type', $type);
        Route::delete($routePrefix . '/gallery/' . $galleryParam, [AdminDirectoryController::class, 'deleteGalleryImage'])->name($namePrefix . '.gallery.destroy')->defaults('type', $type);

        // Breeder-only: toggle-verified
        if ($options['has_verified'] ?? false) {
            Route::patch($routePrefix . '/' . $param . '/toggle-verified', [AdminDirectoryController::class, 'toggleVerified'])->name($namePrefix . '.toggle-verified')->defaults('type', $type);
        }
    }

    // Vet Services
    Route::resource('vet-services', AdminVetServiceController::class)->except(['create', 'edit', 'show']);

    // Trainer Specializations
    Route::resource('trainer-specializations', AdminTrainerSpecializationController::class)->except(['create', 'edit', 'show']);

    // Events
    Route::resource('event-types', AdminEventTypeController::class)->except(['create', 'edit', 'show']);
    Route::patch('event-types/{event_type}/toggle-active', [AdminEventTypeController::class, 'toggleActive'])->name('event-types.toggle-active');

    Route::get('events', [AdminEventController::class, 'index'])->name('events.index');
    Route::get('events/create', [AdminEventController::class, 'create'])->name('events.create');
    Route::post('events', [AdminEventController::class, 'store'])->name('events.store');
    Route::get('events/{event}/edit', [AdminEventController::class, 'edit'])->name('events.edit');
    Route::post('events/{event}', [AdminEventController::class, 'update'])->name('events.update');
    Route::delete('events/{event}', [AdminEventController::class, 'destroy'])->name('events.destroy');
    Route::get('events/{event}/registrations', [AdminEventController::class, 'registrations'])->name('events.registrations');
    Route::patch('events/{event}/toggle-active', [AdminEventController::class, 'toggleActive'])->name('events.toggle-active');
    Route::patch('events/{event}/toggle-featured', [AdminEventController::class, 'toggleFeatured'])->name('events.toggle-featured');
    Route::delete('events/gallery/{image}', [AdminEventController::class, 'deleteGalleryImage'])->name('events.gallery.destroy');

    // Content & SEO
    Route::resource('article-categories', AdminArticleCategoryController::class)->except(['create', 'edit', 'show']);
    Route::patch('article-categories/{article_category}/toggle-active', [AdminArticleCategoryController::class, 'toggleActive'])->name('article-categories.toggle-active');

    // Careers Management
    Route::resource('career-positions', AdminCareerPositionController::class)->except(['show']);
    Route::patch('career-positions/{career_position}/toggle-active', [AdminCareerPositionController::class, 'toggleActive'])->name('career-positions.toggle-active');

    Route::get('career-applications', [AdminCareerApplicationController::class, 'index'])->name('career-applications.index');
    Route::get('career-applications/export', [AdminCareerApplicationController::class, 'export'])->name('career-applications.export');
    Route::get('career-applications/{career_application}', [AdminCareerApplicationController::class, 'show'])->name('career-applications.show');
    Route::patch('career-applications/{career_application}/status', [AdminCareerApplicationController::class, 'updateStatus'])->name('career-applications.update-status');
    Route::get('career-applications/{career_application}/download-resume', [AdminCareerApplicationController::class, 'downloadResume'])->name('career-applications.download-resume');
    Route::delete('career-applications/{career_application}', [AdminCareerApplicationController::class, 'destroy'])->name('career-applications.destroy');

    Route::get('articles', [AdminArticleController::class, 'index'])->name('articles.index');
    Route::get('articles/create', [AdminArticleController::class, 'create'])->name('articles.create');
    Route::post('articles', [AdminArticleController::class, 'store'])->name('articles.store');
    Route::get('articles/{article}/edit', [AdminArticleController::class, 'edit'])->name('articles.edit');
    Route::post('articles/{article}', [AdminArticleController::class, 'update'])->name('articles.update');
    Route::delete('articles/{article}', [AdminArticleController::class, 'destroy'])->name('articles.destroy');
    Route::patch('articles/{article}/toggle-publish', [AdminArticleController::class, 'togglePublish'])->name('articles.toggle-publish');
    Route::patch('articles/{article}/toggle-featured', [AdminArticleController::class, 'toggleFeatured'])->name('articles.toggle-featured');
    Route::delete('articles/gallery/{image}', [AdminArticleController::class, 'deleteGalleryImage'])->name('articles.gallery.destroy');

    Route::get('gallery', [AdminGalleryController::class, 'index'])->name('gallery.index');
    Route::get('gallery/create', [AdminGalleryController::class, 'create'])->name('gallery.create');
    Route::post('gallery', [AdminGalleryController::class, 'store'])->name('gallery.store');
    Route::get('gallery/{gallery}/edit', [AdminGalleryController::class, 'edit'])->name('gallery.edit');
    Route::post('gallery/{gallery}', [AdminGalleryController::class, 'update'])->name('gallery.update');
    Route::delete('gallery/{gallery}', [AdminGalleryController::class, 'destroy'])->name('gallery.destroy');
    Route::patch('gallery/{gallery}/toggle-featured', [AdminGalleryController::class, 'toggleFeatured'])->name('gallery.toggle-featured');
    Route::patch('gallery/{gallery}/toggle-active', [AdminGalleryController::class, 'toggleActive'])->name('gallery.toggle-active');
    Route::delete('gallery/images/{image}', [AdminGalleryController::class, 'deleteImage'])->name('gallery.images.destroy');

    Route::resource('gallery-categories', AdminGalleryCategoryController::class)->except(['create', 'edit', 'show']);

    // Litter Marketplace Management
    Route::get('litters', [AdminLitterController::class, 'index'])->name('litters.index');
    Route::get('litters/create', [AdminLitterController::class, 'create'])->name('litters.create');
    Route::post('litters', [AdminLitterController::class, 'store'])->name('litters.store');
    Route::get('litters/{litter}/edit', [AdminLitterController::class, 'edit'])->name('litters.edit');
    Route::post('litters/{litter}', [AdminLitterController::class, 'update'])->name('litters.update');
    Route::patch('litters/{litter}/toggle-approval', [AdminLitterController::class, 'toggleApproval'])->name('litters.toggle-approval');
    Route::patch('litters/{litter}/toggle-availability', [AdminLitterController::class, 'toggleAvailability'])->name('litters.toggle-availability');
    Route::delete('litters/{litter}', [AdminLitterController::class, 'destroy'])->name('litters.destroy');
    Route::delete('litters/images/{image}', [AdminLitterController::class, 'deleteImage'])->name('litters.images.destroy');

    // Puppy Health Records & Transfer System
    Route::get('litters/{litter}/health-records', [AdminPuppyHealthRecordController::class, 'index'])->name('litters.health-records.index');
    Route::post('litters/{litter}/health-records', [AdminPuppyHealthRecordController::class, 'store'])->name('litters.health-records.store');
    Route::put('litters/{litter}/health-records/{record}', [AdminPuppyHealthRecordController::class, 'update'])->name('litters.health-records.update');
    Route::delete('litters/{litter}/health-records/{record}', [AdminPuppyHealthRecordController::class, 'destroy'])->name('litters.health-records.destroy');
    Route::post('litters/{litter}/transfer', [AdminPuppyHealthRecordController::class, 'convertToPet'])->name('litters.transfer');

    // Admin Transfer Requests Management
    Route::get('transfer-requests', [AdminLitterController::class, 'transferRequestsIndex'])->name('transfer-requests.index');
    Route::post('transfer-requests/{request}/approve', [AdminLitterController::class, 'approveTransferRequest'])->name('transfer-requests.approve');
    Route::post('transfer-requests/{request}/reject', [AdminLitterController::class, 'rejectTransferRequest'])->name('transfer-requests.reject');

    // Stud Service Management
    Route::get('stud-services', [AdminStudServiceController::class, 'index'])->name('stud-services.index');
    Route::get('stud-services/create', [AdminStudServiceController::class, 'create'])->name('stud-services.create');
    Route::post('stud-services', [AdminStudServiceController::class, 'store'])->name('stud-services.store');
    Route::get('stud-services/{stud_service}/edit', [AdminStudServiceController::class, 'edit'])->name('stud-services.edit');
    Route::post('stud-services/{stud_service}', [AdminStudServiceController::class, 'update'])->name('stud-services.update');
    Route::patch('stud-services/{stud_service}/toggle-approval', [AdminStudServiceController::class, 'toggleApproval'])->name('stud-services.toggle-approval');
    Route::patch('stud-services/{stud_service}/toggle-availability', [AdminStudServiceController::class, 'toggleAvailability'])->name('stud-services.toggle-availability');
    Route::delete('stud-services/{stud_service}', [AdminStudServiceController::class, 'destroy'])->name('stud-services.destroy');
    Route::delete('stud-services/images/{image}', [AdminStudServiceController::class, 'deleteImage'])->name('stud-services.images.destroy');

    // Adoption Management
    Route::get('adoptions', [AdminAdoptionController::class, 'index'])->name('adoptions.index');
    Route::get('adoptions/create', [AdminAdoptionController::class, 'create'])->name('adoptions.create');
    Route::post('adoptions', [AdminAdoptionController::class, 'store'])->name('adoptions.store');
    Route::get('adoptions/{adoption}/edit', [AdminAdoptionController::class, 'edit'])->name('adoptions.edit');
    Route::post('adoptions/{adoption}', [AdminAdoptionController::class, 'update'])->name('adoptions.update');
    Route::patch('adoptions/{adoption}/toggle-approval', [AdminAdoptionController::class, 'toggleApproval'])->name('adoptions.toggle-approval');
    Route::patch('adoptions/{adoption}/toggle-availability', [AdminAdoptionController::class, 'toggleAvailability'])->name('adoptions.toggle-availability');
    Route::delete('adoptions/{adoption}', [AdminAdoptionController::class, 'destroy'])->name('adoptions.destroy');
    Route::delete('adoptions/images/{image}', [AdminAdoptionController::class, 'deleteImage'])->name('adoptions.images.destroy');

    // Ads Management
    Route::get('ad-pricings', [\App\Http\Controllers\Admin\AdminAdPricingController::class, 'index'])->name('ad-pricings.index');
    Route::patch('ad-pricings/{pricing}', [\App\Http\Controllers\Admin\AdminAdPricingController::class, 'update'])->name('ad-pricings.update');
    Route::get('ads', [\App\Http\Controllers\Admin\AdminAdPlacementController::class, 'index'])->name('ads.index');
    Route::post('ads/{adPlacement}/approve', [\App\Http\Controllers\Admin\AdminAdPlacementController::class, 'approve'])->name('ads.approve');
    Route::post('ads/{adPlacement}/reject', [\App\Http\Controllers\Admin\AdminAdPlacementController::class, 'reject'])->name('ads.reject');
    Route::delete('ads/{adPlacement}', [\App\Http\Controllers\Admin\AdminAdPlacementController::class, 'destroy'])->name('ads.destroy');

    // Pets Management
    Route::get('pets', [AdminPetController::class, 'index'])->name('pets.index');
    Route::get('pets/create', [AdminPetController::class, 'create'])->name('pets.create');
    Route::post('pets', [AdminPetController::class, 'store'])->name('pets.store');
    Route::get('pets/{pet}/edit', [AdminPetController::class, 'edit'])->name('pets.edit');
    Route::post('pets/{pet}', [AdminPetController::class, 'update'])->name('pets.update');
    Route::delete('pets/{pet}', [AdminPetController::class, 'destroy'])->name('pets.destroy');

    // Vaccination Management
    Route::get('vaccinations', [AdminVaccinationController::class, 'index'])->name('vaccinations.index');
    Route::get('vaccinations/create', [AdminVaccinationController::class, 'create'])->name('vaccinations.create');
    Route::post('vaccinations', [AdminVaccinationController::class, 'store'])->name('vaccinations.store');
    Route::get('vaccinations/{vaccination}/edit', [AdminVaccinationController::class, 'edit'])->name('vaccinations.edit');
    Route::post('vaccinations/{vaccination}', [AdminVaccinationController::class, 'update'])->name('vaccinations.update');
    Route::delete('vaccinations/{vaccination}', [AdminVaccinationController::class, 'destroy'])->name('vaccinations.destroy');

    // Medical Records Management
    Route::get('medical-records', [AdminMedicalRecordController::class, 'index'])->name('medical-records.index');
    Route::get('medical-records/create', [AdminMedicalRecordController::class, 'create'])->name('medical-records.create');
    Route::post('medical-records', [AdminMedicalRecordController::class, 'store'])->name('medical-records.store');
    Route::get('medical-records/{medical_record}/edit', [AdminMedicalRecordController::class, 'edit'])->name('medical-records.edit');
    Route::post('medical-records/{medical_record}', [AdminMedicalRecordController::class, 'update'])->name('medical-records.update');
    Route::delete('medical-records/{medical_record}', [AdminMedicalRecordController::class, 'destroy'])->name('medical-records.destroy');

    // Appointments Management
    Route::get('appointments', [AdminAppointmentController::class, 'index'])->name('appointments.index');
    Route::get('appointments/create', [AdminAppointmentController::class, 'create'])->name('appointments.create');
    Route::post('appointments', [AdminAppointmentController::class, 'store'])->name('appointments.store');
    Route::get('appointments/{appointment}/edit', [AdminAppointmentController::class, 'edit'])->name('appointments.edit');
    Route::post('appointments/{appointment}', [AdminAppointmentController::class, 'update'])->name('appointments.update');
    Route::delete('appointments/{appointment}', [AdminAppointmentController::class, 'destroy'])->name('appointments.destroy');

    // Notifications Management
    Route::get('notifications', [AdminNotificationController::class, 'index'])->name('notifications.index');
    Route::post('notifications', [AdminNotificationController::class, 'store'])->name('notifications.store');
    Route::delete('notifications/{notification}', [AdminNotificationController::class, 'destroy'])->name('notifications.destroy');

    // Audit Logs
    Route::get('audit-logs', [AdminAuditLogController::class, 'index'])->name('audit-logs.index');
    Route::get('user-audit-logs', [UserAuditLogController::class, 'index'])->name('user-audit-logs.index');

    // Support Tickets Management
    Route::prefix('support-tickets')->name('support-tickets.')->group(function () {
        Route::get('/', [AdminSupportTicketController::class, 'index'])->name('index');
        Route::get('/{ticket}', [AdminSupportTicketController::class, 'show'])->name('show');
        Route::post('/{ticket}/reply', [AdminSupportTicketController::class, 'reply'])->name('reply');
        Route::patch('/{ticket}/status', [AdminSupportTicketController::class, 'updateStatus'])->name('update-status');
    });

    // Chat / Messages
    Route::prefix('messages')->name('messages.')->group(function () {
        Route::get('/', [\App\Http\Controllers\ChatController::class, 'index'])->name('index');
        Route::get('/{conversation}', [\App\Http\Controllers\ChatController::class, 'show'])->name('show');
        Route::post('/{conversation}', [\App\Http\Controllers\ChatController::class, 'store'])->name('store');
        Route::delete('/{conversation}', [\App\Http\Controllers\ChatController::class, 'destroy'])->name('destroy');
        Route::patch('/{conversation}/read', [\App\Http\Controllers\ChatController::class, 'markAsRead'])->name('read');
    });

    // Contact Messages Management
    Route::prefix('contact-messages')->name('contact-messages.')->group(function () {
        Route::get('/', [AdminContactController::class, 'index'])->name('index');
        Route::get('/{message}', [AdminContactController::class, 'show'])->name('show');
        Route::patch('/{message}/status', [AdminContactController::class, 'updateStatus'])->name('update-status');
        Route::delete('/{message}', [AdminContactController::class, 'destroy'])->name('destroy');
    });
});
