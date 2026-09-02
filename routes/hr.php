<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Hr\HrDashboardController;
use App\Http\Controllers\Hr\EmployeeController;
use App\Http\Controllers\Hr\PayoutController;

Route::get('/', [HrDashboardController::class, 'index'])->name('dashboard');
Route::get('/profile', [\App\Http\Controllers\Admin\AdminProfileController::class, 'edit'])->name('profile.edit');
Route::put('/profile', [\App\Http\Controllers\Admin\AdminProfileController::class, 'update'])->name('profile.update');
Route::put('/profile/password', [\App\Http\Controllers\Admin\AdminProfileController::class, 'updatePassword'])->name('profile.password.update');
Route::resource('employees', EmployeeController::class);
Route::post('employees/{employee}/documents', [EmployeeController::class, 'uploadDocument'])->name('employees.documents.store');
Route::delete('employees/{employee}/documents/{document}', [EmployeeController::class, 'deleteDocument'])->name('employees.documents.destroy');
Route::resource('payouts', PayoutController::class)->only(['index', 'store', 'update']);
Route::post('payouts/{payout}/claim', [PayoutController::class, 'claim'])->name('payouts.claim');
Route::post('payouts/{payout}/transfer', [PayoutController::class, 'transfer'])->name('payouts.transfer');
Route::get('team', [\App\Http\Controllers\Hr\HrTeamController::class, 'index'])->name('team.index');

// Assigned Support Tickets - HR may receive tickets from support transfers
Route::prefix('leaves')->name('leaves.')->group(function () {
    Route::get('/', [\App\Http\Controllers\Hr\HrLeaveController::class, 'index'])->name('index');
    Route::get('/create', [\App\Http\Controllers\Hr\HrLeaveController::class, 'create'])->name('create');
    Route::post('/', [\App\Http\Controllers\Hr\HrLeaveController::class, 'store'])->name('store');
    Route::get('/{leave}', [\App\Http\Controllers\Hr\HrLeaveController::class, 'show'])->name('show');
    Route::post('/{leave}/approve', [\App\Http\Controllers\Hr\HrLeaveController::class, 'approve'])->name('approve');
    Route::post('/{leave}/reject', [\App\Http\Controllers\Hr\HrLeaveController::class, 'reject'])->name('reject');
    Route::post('/{leave}/cancel', [\App\Http\Controllers\Hr\HrLeaveController::class, 'cancel'])->name('cancel');
});

Route::prefix('tickets')->name('tickets.')->group(function () {
    Route::get('/', [\App\Http\Controllers\Hr\HrTicketController::class, 'index'])->name('index');
    Route::get('/{id}', [\App\Http\Controllers\Hr\HrTicketController::class, 'show'])->name('show');
    Route::post('/{id}/reply', [\App\Http\Controllers\Hr\HrTicketController::class, 'reply'])->name('reply');
    Route::post('/{id}/unassign', [\App\Http\Controllers\Hr\HrTicketController::class, 'unassign'])->name('unassign');
});

Route::prefix('knowledge-base')->name('knowledge-base.')->group(function () {
    Route::get('/', [\App\Http\Controllers\Hr\InternalArticleController::class, 'index'])->name('index');
    Route::get('/create', [\App\Http\Controllers\Hr\InternalArticleController::class, 'create'])->name('create');
    Route::post('/', [\App\Http\Controllers\Hr\InternalArticleController::class, 'store'])->name('store');
    Route::get('/{article}', [\App\Http\Controllers\Hr\InternalArticleController::class, 'show'])->name('show');
    Route::get('/{article}/edit', [\App\Http\Controllers\Hr\InternalArticleController::class, 'edit'])->name('edit');
    Route::put('/{article}', [\App\Http\Controllers\Hr\InternalArticleController::class, 'update'])->name('update');
    Route::delete('/{article}', [\App\Http\Controllers\Hr\InternalArticleController::class, 'destroy'])->name('destroy');
});