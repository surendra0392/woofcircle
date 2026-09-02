<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Relations\Relation;
use App\Models\SavedItem;

class SaveItemController
{
    /**
     * Toggle saved status of a marketplace or directory item.
     */
    public function toggle(Request $request, string $type, $id)
    {
        $class = Relation::getMorphedModel($type);
        if (! $class) {
            return back()->with('error', 'Invalid item type.');
        }

        // Verify the item exists
        $item = $class::find($id);
        if (! $item) {
            return back()->with('error', 'Item not found.');
        }

        $user = $request->user();

        $savedItem = SavedItem::where('user_id', $user->id)
            ->where('saved_item_type', $type)
            ->where('saved_item_id', $id)
            ->first();

        if ($savedItem) {
            $savedItem->delete();
            $saved = false;
        } else {
            SavedItem::create([
                'user_id' => $user->id,
                'saved_item_type' => $type,
                'saved_item_id' => $id,
            ]);
            $saved = true;
        }

        $typeName = ucfirst(str_replace('_', ' ', $type));

        return back()->with(
            'success',
            $saved ? "{$typeName} saved successfully." : "{$typeName} removed from saved list."
        );
    }
}
