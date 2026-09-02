<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Support\SupportDashboardController;
use App\Http\Controllers\Support\SupportQueueController;
use App\Http\Controllers\Support\SupportTicketController;
use App\Http\Controllers\Support\SupportTeamController;
use App\Http\Controllers\Support\CannedResponseController;

Route::get('/', [SupportDashboardController::class, 'index'])->name('dashboard');
Route::get('/profile', [\App\Http\Controllers\Admin\AdminProfileController::class, 'edit'])->name('profile.edit');
Route::put('/profile', [\App\Http\Controllers\Admin\AdminProfileController::class, 'update'])->name('profile.update');
Route::put('/profile/password', [\App\Http\Controllers\Admin\AdminProfileController::class, 'updatePassword'])->name('profile.password.update');
Route::get('/queue', [SupportQueueController::class, 'index'])->name('queue.index');
Route::get('/tickets/{type}/{id}', [SupportTicketController::class, 'show'])->name('tickets.show');
Route::post('/tickets/{type}/{id}/claim', [SupportTicketController::class, 'claim'])->name('tickets.claim');
Route::put('/tickets/{type}/{id}/status', [SupportTicketController::class, 'updateStatus'])->name('tickets.updateStatus');
Route::post('/tickets/{type}/{id}/reply', [SupportTicketController::class, 'reply'])->name('tickets.reply');
Route::post('/tickets/{type}/{id}/transfer', [SupportTicketController::class, 'transfer'])->name('tickets.transfer');
Route::post('/tickets/{type}/{id}/global-transfer', [SupportTicketController::class, 'globalTransfer'])->name('tickets.globalTransfer');
Route::post('/tickets/{type}/{id}/escalate', [SupportTicketController::class, 'escalate'])->name('tickets.escalate');
Route::get('/team', [SupportTeamController::class, 'index'])->name('team.index');
Route::get('/canned-responses', [CannedResponseController::class, 'index'])->name('canned-responses.index');
Route::resource('manage-canned', \App\Http\Controllers\Support\ManageCannedResponseController::class)->only(['index', 'create', 'store', 'destroy']);

Route::prefix('knowledge-base')->name('knowledge-base.')->group(function () {
    Route::get('/', [\App\Http\Controllers\Support\InternalArticleController::class, 'index'])->name('index');
    Route::get('/create', [\App\Http\Controllers\Support\InternalArticleController::class, 'create'])->name('create');
    Route::post('/', [\App\Http\Controllers\Support\InternalArticleController::class, 'store'])->name('store');
    Route::get('/{article}', [\App\Http\Controllers\Support\InternalArticleController::class, 'show'])->name('show');
    Route::get('/{article}/edit', [\App\Http\Controllers\Support\InternalArticleController::class, 'edit'])->name('edit');
    Route::put('/{article}', [\App\Http\Controllers\Support\InternalArticleController::class, 'update'])->name('update');
    Route::delete('/{article}', [\App\Http\Controllers\Support\InternalArticleController::class, 'destroy'])->name('destroy');
});
