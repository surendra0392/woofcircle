<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pet;
use Illuminate\Support\Facades\Auth;

class UserPetFollowController extends Controller
{
    public function toggle(Pet $pet)
    {
        $user = Auth::user();

        if ($user->followedPets()->where('pet_id', $pet->id)->exists()) {
            $user->followedPets()->detach($pet->id);
            $pet->decrement('followers_count');
            return back()->with('success', 'You unfollowed ' . $pet->name);
        } else {
            $user->followedPets()->attach($pet->id);
            $pet->increment('followers_count');
            return back()->with('success', 'You are now following ' . $pet->name);
        }
    }
}
