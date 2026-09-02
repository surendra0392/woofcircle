<?php

namespace App\Http\Controllers;

use App\Models\State;
use App\Support\ProfileConfig;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProfileController
{
    /**
     * Show the profile dashboard overview page.
     */
    public function index(string $type)
    {
        $config = ProfileConfig::get($type);
        if (! $config) {
            abort(404);
        }

        $user = Auth::user();

        if (! $user->hasRole($config['role'])) {
            return redirect()->route('dashboard')->with('error', 'Only '.$config['role'].' providers can access this page.');
        }

        $model = $config['model'];
        $profile = $model::with($config['with_relations'])->where('user_id', $user->id)->first();

        $analytics = [
            'gallery_count' => 0,
            'profile_completeness' => 0,
            'is_verified' => false,
            'is_active' => false,
        ];

        if ($profile) {
            if ($profile->logo) {
                $profile->logo = Storage::url($profile->logo);
            }
            $profile->gallery->each(function ($item) {
                $item->image = Storage::url($item->image);
            });

            $galleryCount = $profile->gallery()->count();
            $fillableFields = $config['fillable_fields'];
            $filled = 0;
            $total = count($fillableFields);
            foreach ($fillableFields as $field) {
                if (! empty($profile->$field)) {
                    $filled++;
                }
            }
            if ($profile->logo) {
                $filled++;
                $total++;
            }
            $profileCompleteness = $total > 0 ? round(($filled / $total) * 100) : 0;

            $analytics = [
                'gallery_count' => $galleryCount,
                'profile_completeness' => $profileCompleteness,
                'is_verified' => $profile->is_verified,
                'is_active' => $profile->is_active,
            ];
        }

        return Inertia::render($config['dashboard_view'], [
            'profile' => $profile,
            'analytics' => $analytics,
        ]);
    }

    /**
     * Show the profile edit form.
     */
    public function edit(string $type)
    {
        $config = ProfileConfig::get($type);
        if (! $config) {
            abort(404);
        }

        $user = Auth::user();

        if (! $user->hasRole($config['role'])) {
            return redirect()->route('dashboard')->with('error', 'Only '.$config['role'].' providers can access this page.');
        }

        $model = $config['model'];
        $profile = $model::with($config['with_relations'])->where('user_id', $user->id)->first();

        if ($profile) {
            if ($profile->logo) {
                $profile->logo = Storage::url($profile->logo);
            }
            $profile->gallery->each(function ($item) {
                $item->image = Storage::url($item->image);
            });
        }

        $extraData = [];
        if ($config['extra_data'] && isset($config['extra_data_model'])) {
            $extraData[$config['extra_data']] = $config['extra_data_model']::orderBy('name')->get();
        }

        return Inertia::render($config['edit_view'], array_merge([
            'profile' => $profile,
            'states' => State::orderBy('name')->get(),
        ], $extraData));
    }

    /**
     * Update or create the profile.
     */
    public function update(Request $request, string $type)
    {
        $config = ProfileConfig::get($type);
        if (! $config) {
            abort(404);
        }

        $user = Auth::user();

        if (! $user->hasRole($config['role'])) {
            return redirect()->route('dashboard')->with('error', 'Only '.$config['role'].' providers can access this page.');
        }

        $validated = $request->validate($config['validation']);

        $model = $config['model'];
        $profile = $model::where('user_id', $user->id)->first();

        if ($request->hasFile('logo')) {
            if ($profile && $profile->logo) {
                Storage::disk('public')->delete($profile->getRawOriginal('logo'));
            }
            $validated['logo'] = $request->file('logo')->store($config['logo_path'], 'public');
        } else {
            unset($validated['logo']);
        }

        if ($profile) {
            $profile->update($validated);
            $message = $config['success_update'];
        } else {
            $validated['user_id'] = $user->id;
            $validated['is_active'] = false;
            $profile = $model::create($validated);
            $message = $config['success_create'];
        }

        // Handle extra relations (services, specializations)
        if ($config['extra_data']) {
            $relation = $config['extra_data']; // 'services' or 'specializations'
            if ($request->has($relation)) {
                $profile->$relation()->sync($request->$relation);
            }
        }

        if ($request->hasFile('gallery')) {
            $currentCount = $profile->gallery()->count();
            $uploadedCount = 0;
            foreach ($request->file('gallery') as $image) {
                if ($currentCount >= 10) {
                    break;
                }
                $path = $image->store($config['gallery_path'], 'public');
                $profile->gallery()->create(['image' => $path]);
                $currentCount++;
                $uploadedCount++;
            }
            if ($uploadedCount > 0) {
                $message .= ' '.$uploadedCount.' new gallery image'.($uploadedCount !== 1 ? 's' : '').' added to your gallery.';
            }
        }

        return back()->with('success', $message);
    }

    /**
     * Delete a gallery image.
     */
    public function deleteGalleryImage(string $type, int $imageId)
    {
        $config = ProfileConfig::get($type);
        if (! $config) {
            abort(404);
        }

        $user = Auth::user();

        if (! $user->hasRole($config['role'])) {
            return redirect()->route('dashboard')->with('error', 'Only '.$config['role'].' providers can access this page.');
        }

        $model = $config['model'];
        $galleryModel = $config['gallery_model'];
        $foreignKey = $config['gallery_foreign_key'];

        $profile = $model::where('user_id', $user->id)->first();

        $image = $galleryModel::findOrFail($imageId);

        if (! $profile || $image->$foreignKey !== $profile->id) {
            abort(403);
        }

        Storage::disk('public')->delete($image->image);
        $image->delete();

        return back()->with('success', $config['gallery_deleted']);
    }
}
