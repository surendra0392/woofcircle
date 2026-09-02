<?php

namespace App\Http\Controllers\Admin;

use App\Models\City;
use App\Models\Role;
use App\Models\State;
use App\Models\User;
use App\Support\ProfileConfig;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;

class AdminDirectoryController
{
    /**
     * Display a listing of directory profiles.
     */
    public function index(Request $request, string $type)
    {
        $config = ProfileConfig::get($type);
        $modelClass = $config['model'];
        $keys = $this->viewKeys($type);

        $query = $modelClass::with($config['admin_with'] ?? $config['with_relations'] ?? []);

        // Apply configured filters
        foreach ($config['admin_filters'] ?? [] as $filter) {
            if ($filter === 'is_verified' && $request->has('is_verified')) {
                $query->where('is_verified', $request->is_verified === 'true');
            } elseif ($filter === 'is_active' && $request->has('is_active')) {
                $query->where('is_active', $request->is_active === 'true');
            } elseif ($request->filled($filter)) {
                $query->where($filter, $request->$filter);
            }
        }

        // Special filter: trainer specialization_id uses whereHas
        if ($request->filled('specialization_id')) {
            $query->whereHas('specializations', fn($q) => $q->where('trainer_specializations.id', $request->specialization_id));
        }

        // Special filter: pet-shop search
        if ($request->filled('search')) {
            $nameField = $config['name_field'];
            $query->where($nameField, 'like', '%' . $request->search . '%');
        }

        $profiles = $query->latest()->paginate(10)->withQueryString();

        // Transform items: add URL for logo and gallery images
        $profiles->getCollection()->transform(function ($profile) use ($config) {
            $data = array_merge($profile->toArray(), [
                'logo' => $profile->logo_url,
                'gallery' => $profile->gallery->map(fn($img) => [
                    'id' => $img->id,
                    'image' => Storage::url($img->image),
                ]),
            ]);

            // Include extra data (e.g. services, specializations) as plucked IDs
            if ($config['extra_data'] && $profile->{$config['extra_data']}) {
                $data[$config['extra_data']] = $profile->{$config['extra_data']}->pluck('id')->toArray();
            }

            return $data;
        });

        $viewData = [
            $keys['plural'] => $profiles,
            'states' => State::orderBy('name')->get(),
            'cities' => City::orderBy('name')->get(),
            'filters' => $request->only(array_merge(
                $config['admin_filters'] ?? [],
                $type === 'trainer' ? ['specialization_id'] : [],
                $type === 'pet-shop' ? ['search'] : [],
                $type === 'boarding' ? ['service_type'] : [],
            )),
        ];

        // Pass extra data model list for filter dropdowns (e.g. allServices, allSpecializations)
        if ($config['extra_data'] && $config['extra_data_model']) {
            $extraModel = $config['extra_data_model'];
            $viewData['all' . ucfirst(Str::camel($config['extra_data']))] = $extraModel::where('is_active', true)->orderBy('name')->get();
        }

        return Inertia::render($config['admin_index_view'], $viewData);
    }

    /**
     * Show the form for creating a new directory profile.
     */
    public function create(string $type)
    {
        $config = ProfileConfig::get($type);
        $keys = $this->viewKeys($type);

        $viewData = [
            'states' => State::orderBy('name')->get(),
            'cities' => City::orderBy('name')->get(),
            'availableUsers' => $this->getAvailableUsers($type),
        ];

        // Pass extra data model list (e.g. allServices, allSpecializations)
        if ($config['extra_data'] && $config['extra_data_model']) {
            $extraModel = $config['extra_data_model'];
            $viewData['all' . ucfirst(Str::camel($config['extra_data']))] = $extraModel::where('is_active', true)->orderBy('name')->get();
        }

        // Pet-shop create passes 'users' instead of 'availableUsers'
        if ($type === 'pet-shop') {
            $viewData['users'] = $viewData['availableUsers'];
            unset($viewData['availableUsers']);
        }

        return Inertia::render($config['admin_create_view'], $viewData);
    }

    /**
     * Store a newly created directory profile.
     */
    public function store(Request $request, string $type)
    {
        $config = ProfileConfig::get($type);
        $modelClass = $config['model'];

        $validated = $request->validate($this->buildValidationRules($config));

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store($config['logo_path'], 'public');
        }

        $profile = $modelClass::create($validated);

        // Sync extra data (services, specializations, etc.)
        if ($config['extra_data'] && $request->filled($config['extra_data'])) {
            $profile->{$config['extra_data']}()->sync($request->{$config['extra_data']});
        }

        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $image) {
                $path = $image->store($config['gallery_path'], 'public');
                $profile->gallery()->create(['image' => $path]);
            }
        }

        return redirect()->route('admin.' . $config['admin_route_prefix'] . '.index')
            ->with('success', $config['success_created_admin'] ?? 'Profile created successfully.');
    }

    /**
     * Show the form for editing a directory profile.
     */
    public function edit($id, string $type)
    {
        $config = ProfileConfig::get($type);
        $modelClass = $config['model'];
        $keys = $this->viewKeys($type);

        $profile = $modelClass::with($config['admin_with'] ?? $config['with_relations'] ?? [])->findOrFail($id);

        $profileData = array_merge($profile->toArray(), [
            'logo' => $profile->logo_url,
            'gallery' => $profile->gallery->map(fn($img) => [
                'id' => $img->id,
                'image' => Storage::url($img->image),
            ])->toArray(),
        ]);

        if ($config['extra_data'] && $profile->{$config['extra_data']}) {
            $profileData[$config['extra_data']] = $profile->{$config['extra_data']}->pluck('id')->toArray();
        }

        $viewData = [
            $keys['singular'] => $profileData,
            'states' => State::orderBy('name')->get(),
            'cities' => City::orderBy('name')->get(),
            'availableUsers' => $this->getAvailableUsers($type, $profile),
        ];

        // Pass extra data model list
        if ($config['extra_data'] && $config['extra_data_model']) {
            $extraModel = $config['extra_data_model'];
            $viewData['all' . ucfirst(Str::camel($config['extra_data']))] = $extraModel::where('is_active', true)->orderBy('name')->get();
        }

        // Pet-shop edit passes 'users' instead of 'availableUsers'
        if ($type === 'pet-shop') {
            $viewData['users'] = $viewData['availableUsers'];
            unset($viewData['availableUsers']);
        }

        return Inertia::render($config['admin_edit_view'], $viewData);
    }

    /**
     * Update the specified directory profile.
     */
    public function update(Request $request, $id, string $type)
    {
        $config = ProfileConfig::get($type);
        $modelClass = $config['model'];

        $profile = $modelClass::findOrFail($id);

        $rules = $this->buildValidationRules($config, $profile);
        $validated = $request->validate($rules);

        if ($request->hasFile('logo')) {
            if ($profile->logo) {
                Storage::disk('public')->delete($profile->logo);
            }
            $validated['logo'] = $request->file('logo')->store($config['logo_path'], 'public');
        } elseif ($type !== 'pet-shop') {
            // PetShop doesn't unset logo, others do (avoids accidentally nulling logo)
            unset($validated['logo']);
        }

        $profile->update($validated);

        // Sync extra data (services, specializations, etc.)
        if ($config['extra_data'] && $request->has($config['extra_data'])) {
            $profile->{$config['extra_data']}()->sync($request->{$config['extra_data']} ?? []);
        }

        if ($request->hasFile('gallery')) {
            $currentCount = $profile->gallery()->count();
            foreach ($request->file('gallery') as $image) {
                if ($currentCount >= 10) {
                    break;
                }
                $path = $image->store($config['gallery_path'], 'public');
                $profile->gallery()->create(['image' => $path]);
                $currentCount++;
            }
        }

        return redirect()->route('admin.' . $config['admin_route_prefix'] . '.index')
            ->with('success', $config['success_updated_admin'] ?? 'Profile updated successfully.');
    }

    /**
     * Toggle the verified status (breeder only).
     */
    public function toggleVerified($id, string $type)
    {
        $config = ProfileConfig::get($type);
        $modelClass = $config['model'];
        $profile = $modelClass::findOrFail($id);

        $profile->update(['is_verified' => !$profile->is_verified]);

        return back()->with('success', $config['verification_toggled'] ?? 'Verification status updated.');
    }

    /**
     * Toggle the active status.
     */
    public function toggleActive($id, string $type)
    {
        $config = ProfileConfig::get($type);
        $modelClass = $config['model'];
        $profile = $modelClass::findOrFail($id);

        $profile->update(['is_active' => !$profile->is_active]);

        // When activating, ensure the user has the correct role
        if ($profile->is_active && $profile->user_id) {
            $user = User::find($profile->user_id);
            $roleSlug = $config['available_users_role'];
            if ($user && $roleSlug && !$user->hasRole($roleSlug)) {
                $role = Role::where('slug', $roleSlug)->first();
                if ($role) {
                    $user->roles()->syncWithoutDetaching([$role->id]);
                }
            }
        }

        return redirect()->route('admin.' . $config['admin_route_prefix'] . '.index')
            ->with('success', $config['activation_toggled'] ?? 'Activation status updated.');
    }

    /**
     * Remove the specified directory profile.
     */
    public function destroy($id, string $type)
    {
        $config = ProfileConfig::get($type);
        $modelClass = $config['model'];
        $profile = $modelClass::findOrFail($id);

        if ($profile->logo) {
            Storage::disk('public')->delete($profile->logo);
        }
        foreach ($profile->gallery as $img) {
            Storage::disk('public')->delete($img->image);
        }
        $profile->delete();

        return redirect()->route('admin.' . $config['admin_route_prefix'] . '.index')
            ->with('success', $config['success_deleted_admin'] ?? 'Profile deleted permanently.');
    }

    /**
     * Delete a gallery image.
     */
    public function deleteGalleryImage($galleryId, string $type)
    {
        $config = ProfileConfig::get($type);
        $galleryClass = $config['gallery_model'];

        $image = $galleryClass::findOrFail($galleryId);
        Storage::disk('public')->delete($image->image);
        $image->delete();

        return back()->with('success', $config['gallery_image_deleted_admin'] ?? 'Gallery image removed.');
    }

    // ─── Helpers ───────────────────────────────────────────

    protected function viewKeys(string $type): array
    {
        return match ($type) {
            'boarding', 'welfare' => ['plural' => $type . 'Profiles', 'singular' => 'profile'],
            'pet-shop' => ['plural' => 'petShops', 'singular' => 'petShop'],
            default => ['plural' => $type . 's', 'singular' => $type],
        };
    }

    protected function buildValidationRules(array $config, $profile = null): array
    {
        $rules = $config['validation'];

        // Add unique slug rule for pet-shop
        if ($config['admin_route_prefix'] === 'pet-shops') {
            $slugRule = ['required', 'string', 'max:255'];
            $slugRule[] = $profile
                ? 'unique:pet_shop_profiles,slug,' . $profile->id
                : 'unique:pet_shop_profiles,slug';
            $rules['slug'] = $slugRule;
        }

        return $rules;
    }

    protected function getAvailableUsers(string $type, $model = null): \Illuminate\Database\Eloquent\Collection
    {
        $config = ProfileConfig::get($type);
        $relation = $config['available_users_relation'];
        $roleSlug = $config['available_users_role'] ?? null;

        if ($roleSlug) {
            $query = User::where(function ($q) use ($relation, $roleSlug) {
                $q->whereDoesntHave($relation)
                    ->whereHas('roles', fn($r) => $r->where('slug', $roleSlug));
            })->with('role')->orderBy('name');

            if ($model && $model->user_id) {
                $query->orWhere('id', $model->user_id);
            }

            return $query->get(['id', 'name', 'email', 'role_id']);
        }

        return User::select('id', 'name', 'email', 'role_id')
            ->with('role')
            ->orderBy('name')
            ->get();
    }
}
