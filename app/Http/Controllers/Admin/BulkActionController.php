<?php

namespace App\Http\Controllers\Admin;

use App\Models\Admin;
use App\Models\Adoption;
use App\Models\Article;
use App\Models\ArticleCategory;
use App\Models\BoardingProfile;
use App\Models\Breed;
use App\Models\BreederProfile;
use App\Models\City;
use App\Models\Event;
use App\Models\EventType;
use App\Models\Gallery;
use App\Models\GalleryCategory;
use App\Models\Litter;
use App\Models\MedicalRecord;
use App\Models\Notification;
use App\Models\Pet;
use App\Models\PetShopProfile;
use App\Models\PuppyHealthRecord;
use App\Models\Review;
use App\Models\Role;
use App\Models\State;
use App\Models\StudService;
use App\Models\TrainerProfile;
use App\Models\User;
use App\Models\Vaccination;
use App\Models\VetProfile;
use App\Models\VetService;
use App\Models\WelfareProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BulkActionController
{
    /**
     * Permitted resources for bulk deletion.
     * Keys match the frontend resource identifiers; values are the Eloquent model classes.
     * Add a new entry here when a new bulk-deletable resource is introduced.
     */
    protected $modelMap = [
        'admins' => Admin::class,
        'users' => User::class,
        'adoptions' => Adoption::class,
        'articles' => Article::class,
        'article_categories' => ArticleCategory::class,
        'breeders' => BreederProfile::class,
        'breeds' => Breed::class,
        'events' => Event::class,
        'event_types' => EventType::class,
        'gallery' => Gallery::class,
        'gallery_categories' => GalleryCategory::class,
        'litters' => Litter::class,
        'medical_records' => MedicalRecord::class,
        'notifications' => Notification::class,
        'pets' => Pet::class,
        'pet_shops' => PetShopProfile::class,
        'reviews' => Review::class,
        'roles' => Role::class,
        'stud_services' => StudService::class,
        'trainers' => TrainerProfile::class,
        'vaccinations' => Vaccination::class,
        'vets' => VetProfile::class,
        'vet_services' => VetService::class,
        'cities' => City::class,
        'states' => State::class,
        'boarding' => BoardingProfile::class,
        'welfare' => WelfareProfile::class,
        'health_records' => PuppyHealthRecord::class,
    ];

    public function destroy(Request $request)
    {
        $request->validate([
            'resource' => 'required|string',
            'ids' => 'required|array',
            'ids.*' => 'integer',
        ]);

        $resource = $request->input('resource');
        $ids = $request->input('ids');

        if (!array_key_exists($resource, $this->modelMap)) {
            return back()->with('error', "Bulk delete is not supported for {$resource}.");
        }

        $modelClass = $this->modelMap[$resource];

        DB::beginTransaction();
        try {
            $deletedCount = 0;

            foreach ($ids as $id) {
                // Safeguard: prevent admins from deleting themselves
                if ($resource === 'admins' && $id == auth('admin')->id()) {
                    continue;
                }

                $item = $modelClass::find($id);
                if ($item) {
                    $item->delete();
                    $deletedCount++;
                }
            }

            DB::commit();
            return back()->with('success', "{$deletedCount} items successfully deleted.");
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Bulk Delete Failed: " . $e->getMessage());
            return back()->with('error', 'An error occurred while performing bulk deletion.');
        }
    }
}
