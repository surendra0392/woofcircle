<?php

namespace App\Http\Controllers\Concerns;

use App\Models\Admin;
use Illuminate\Support\Collection;

trait HasTransferValidation
{
    /**
     * Get eligible transfer targets from the current admin's hierarchy,
     * filtered to only include admins with one of the given roles.
     *
     * Collects the admin's reporting tree (subordinates + direct manager)
     * and returns a collection of {id, name, role} arrays ready to pass
     * directly to an Inertia dropdown or select component.
     */
    protected function eligibleTargets(array $roles): Collection
    {
        $admin = auth('admin')->user();
        $targets = $admin->allSubordinates();

        if ($admin->manager_id && $admin->manager) {
            $targets->push($admin->manager);
        }

        return $targets
            ->filter(fn ($target) => in_array($target->role, $roles))
            ->map(fn ($target) => [
                'id'   => $target->id,
                'name' => $target->name,
                'role' => $target->role,
            ])
            ->values();
    }

    /**
     * Validate that a transfer target is both within the current admin's
     * hierarchy AND has one of the allowed roles.
     *
     * Returns null when validation passes, or a redirect response with
     * validation errors when it fails.
     *
     * @param  mixed       $targetId  The admin ID to validate.
     * @param  array       $roles     Allowed role strings.
     * @param  string      $inputName Request input key (e.g. 'assigned_to').
     * @param  string      $label     Human-readable label for error messages.
     * @return \Illuminate\Http\RedirectResponse|null
     */
    protected function validateTransferTarget(
        mixed  $targetId,
        array  $roles,
        string $inputName = 'assigned_to',
        string $label = 'item',
    ): ?\Illuminate\Http\RedirectResponse {
        $admin = auth('admin')->user();

        // --- Hierarchy check ---
        $validIds = $admin->allSubordinates()->pluck('id');
        if ($admin->manager_id) {
            $validIds->push($admin->manager_id);
        }

        if (! $validIds->contains($targetId)) {
            return redirect()->back()->withErrors([
                $inputName => "You cannot transfer a {$label} to this user.",
            ]);
        }

        // --- Role validation ---
        $targetAdmin = Admin::findOrFail($targetId);
        if (! in_array($targetAdmin->role, $roles)) {
            return redirect()->back()->withErrors([
                $inputName => 'This user is not eligible to receive this assignment.',
            ]);
        }

        return null;
    }
}
