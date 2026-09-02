<?php

namespace App\Http\Controllers\Community;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\PetPhoto;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FeedController extends Controller
{
    public function index()
    {
        $photos = PetPhoto::with(['user:id,first_name,last_name,avatar', 'pet:id,name,breed_id,passport_number', 'pet.breed'])
            ->withCount('likes')
            ->latest()
            ->paginate(15);

        // Append 'has_liked' attribute for the current user
        if (Auth::check()) {
            $userId = Auth::id();
            $photos->getCollection()->transform(function ($photo) use ($userId) {
                $photo->has_liked = $photo->likes()->where('user_id', $userId)->exists();
                return $photo;
            });
        }

        return Inertia::render('Community/Feed/Index', [
            'photos' => $photos,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:5120',
            'caption' => 'nullable|string|max:500',
            'pet_id' => 'nullable|exists:pets,id',
        ]);

        $path = $request->file('image')->store('pet-photos', 'public');

        PetPhoto::create([
            'user_id' => Auth::id(),
            'pet_id' => $request->pet_id,
            'image_path' => $path,
            'caption' => $request->caption,
        ]);

        return back()->with('success', 'Photo shared successfully!');
    }

    public function toggleLike(PetPhoto $photo)
    {
        $user = Auth::user();

        if ($user->likedPetPhotos()->where('pet_photo_id', $photo->id)->exists()) {
            $user->likedPetPhotos()->detach($photo->id);
            $photo->decrement('likes_count');
        } else {
            $user->likedPetPhotos()->attach($photo->id);
            $photo->increment('likes_count');
        }

        return back();
    }
}
