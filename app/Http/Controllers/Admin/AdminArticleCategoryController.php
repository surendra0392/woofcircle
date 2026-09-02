<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ArticleCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminArticleCategoryController
{
    public function index()
    {
        return Inertia::render('admin/article-categories', [
            'categories' => ArticleCategory::withCount('articles')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:article_categories,name',
            'is_active' => 'boolean',
        ]);

        ArticleCategory::create($validated);

        return back()->with('success', 'Article category created successfully.');
    }

    public function update(Request $request, ArticleCategory $articleCategory)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:article_categories,name,'.$articleCategory->id,
            'is_active' => 'boolean',
        ]);

        if ($articleCategory->name !== $validated['name']) {
            $slug = Str::slug($validated['name']);
            $original = $slug;
            $count = 1;
            while (ArticleCategory::where('slug', $slug)->where('id', '!=', $articleCategory->id)->exists()) {
                $slug = $original.'-'.$count++;
            }
            $validated['slug'] = $slug;
        }

        $articleCategory->update($validated);

        return back()->with('success', 'Article category updated successfully.');
    }

    public function toggleActive(ArticleCategory $articleCategory)
    {
        $articleCategory->update(['is_active' => ! $articleCategory->is_active]);

        return back()->with('success', 'Article category status updated.');
    }

    public function destroy(ArticleCategory $articleCategory)
    {
        if ($articleCategory->articles()->exists()) {
            return back()->with('error', 'Cannot delete category because it has associated articles.');
        }

        $articleCategory->delete();

        return back()->with('success', 'Article category deleted successfully.');
    }
}
