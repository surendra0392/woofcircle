<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Pet;
use Inertia\Inertia;

class PedigreeController
{
    public function show(Pet $pet)
    {
        // Load up to 3 generations of ancestry
        $pet->load([
            'sire.sire.sire', 'sire.sire.dam',
            'sire.dam.sire', 'sire.dam.dam',
            'dam.sire.sire', 'dam.sire.dam',
            'dam.dam.sire', 'dam.dam.dam'
        ]);

        $user = auth()->user();
        $canAccessFullLineage = $user ? $user->canAccess5GenPedigree() : false;

        return Inertia::render('pets/pedigree', [
            'pet' => $pet,
            'can_access_full_lineage' => $canAccessFullLineage,
            'user_tier' => $user ? ($user->subscription_tier->name ?? 'Free') : 'Guest',
        ]);
    }
}
