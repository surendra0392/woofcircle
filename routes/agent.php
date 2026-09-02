<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AgentDashboardController;
use App\Http\Controllers\AgentOnboardingController;
use App\Http\Controllers\AgentPlacementController;

Route::get('/', [AgentDashboardController::class, 'index'])->name('dashboard');
Route::get('/profile', [\App\Http\Controllers\Admin\AdminProfileController::class, 'edit'])->name('profile.edit');
Route::put('/profile', [\App\Http\Controllers\Admin\AdminProfileController::class, 'update'])->name('profile.update');
Route::put('/profile/password', [\App\Http\Controllers\Admin\AdminProfileController::class, 'updatePassword'])->name('profile.password.update');
Route::post('/profiles/{id}/transfer', [AgentDashboardController::class, 'transferProfile'])->name('profiles.transfer');

Route::get('/onboarding', [AgentOnboardingController::class, 'create'])->name('onboarding.create');
Route::post('/onboarding', [AgentOnboardingController::class, 'store'])->name('onboarding.store');

Route::get('/book-ad', [AgentPlacementController::class, 'create'])->name('book-ad.create');
Route::get('/book-ad/search', [AgentPlacementController::class, 'searchEntities'])->name('book-ad.search');
Route::post('/book-ad/check-availability', [AgentPlacementController::class, 'checkAvailability'])->name('book-ad.check-availability');
Route::post('/book-ad', [AgentPlacementController::class, 'store'])->name('book-ad.store');

Route::get('/earnings', [\App\Http\Controllers\Agent\AgentEarningsController::class, 'index'])->name('earnings.index');
Route::post('/earnings/request', [\App\Http\Controllers\Agent\AgentEarningsController::class, 'requestPayout'])->name('earnings.request');

Route::get('/team', [\App\Http\Controllers\Agent\TeamController::class, 'index'])->name('team.index');

Route::prefix('leads')->name('leads.')->group(function () {
    Route::get('/', [\App\Http\Controllers\Agent\LeadController::class, 'index'])->name('index');
    Route::get('/create', [\App\Http\Controllers\Agent\LeadController::class, 'create'])->name('create');
    Route::post('/', [\App\Http\Controllers\Agent\LeadController::class, 'store'])->name('store');
    Route::get('/{lead}', [\App\Http\Controllers\Agent\LeadController::class, 'show'])->name('show');
    Route::get('/{lead}/edit', [\App\Http\Controllers\Agent\LeadController::class, 'edit'])->name('edit');
    Route::post('/{lead}/convert', [\App\Http\Controllers\Agent\LeadController::class, 'convertToProfile'])->name('convert');
    Route::post('/{lead}/status', [\App\Http\Controllers\Agent\LeadController::class, 'updateStatus'])->name('status');
    Route::put('/{lead}', [\App\Http\Controllers\Agent\LeadController::class, 'update'])->name('update');
    Route::delete('/{lead}', [\App\Http\Controllers\Agent\LeadController::class, 'destroy'])->name('destroy');
});

Route::prefix('support')->name('support.')->group(function () {
    Route::get('/', [\App\Http\Controllers\Agent\InternalTicketController::class, 'index'])->name('index');
    Route::get('/create', [\App\Http\Controllers\Agent\InternalTicketController::class, 'create'])->name('create');
    Route::post('/', [\App\Http\Controllers\Agent\InternalTicketController::class, 'store'])->name('store');
    Route::get('/{ticket}', [\App\Http\Controllers\Agent\InternalTicketController::class, 'show'])->name('show');
    Route::post('/{ticket}/reply', [\App\Http\Controllers\Agent\InternalTicketReplyController::class, 'store'])->name('reply.store');
    Route::post('/{ticket}/claim', [\App\Http\Controllers\Agent\InternalTicketController::class, 'claim'])->name('claim');
    Route::post('/{ticket}/transfer', [\App\Http\Controllers\Agent\InternalTicketController::class, 'transfer'])->name('transfer');
});

Route::prefix('knowledge-base')->name('knowledge-base.')->group(function () {
    Route::get('/', [\App\Http\Controllers\Agent\InternalArticleController::class, 'index'])->name('index');
    Route::get('/create', [\App\Http\Controllers\Agent\InternalArticleController::class, 'create'])->name('create');
    Route::post('/', [\App\Http\Controllers\Agent\InternalArticleController::class, 'store'])->name('store');
    Route::get('/{article}', [\App\Http\Controllers\Agent\InternalArticleController::class, 'show'])->name('show');
    Route::get('/{article}/edit', [\App\Http\Controllers\Agent\InternalArticleController::class, 'edit'])->name('edit');
    Route::put('/{article}', [\App\Http\Controllers\Agent\InternalArticleController::class, 'update'])->name('update');
    Route::delete('/{article}', [\App\Http\Controllers\Agent\InternalArticleController::class, 'destroy'])->name('destroy');
});