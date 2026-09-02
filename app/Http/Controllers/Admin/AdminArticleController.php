<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\ArticleCategory;
use App\Models\ArticleGallery;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminArticleController
{
    public function index(Request $request)
    {
        $query = Article::with(['category', 'gallery', 'user']);

        if ($request->filled('search')) {
            $query->where('title', 'like', '%'.$request->search.'%');
        }

        if ($request->has('is_published') && $request->is_published !== 'all') {
            $query->where('is_published', $request->is_published === 'true');
        }

        if ($request->filled('category_id') && $request->category_id !== 'all') {
            $query->where('category_id', $request->category_id);
        }

        $articles = $query->latest()->paginate(15)->through(function ($article) {
            return array_merge($article->toArray(), [
                'featured_image' => $article->featured_image_url,
                'published_at' => $article->published_at?->format('Y-m-d H:i:s'),
                'gallery' => $article->gallery->map(function ($image) {
                    return [
                        'id' => $image->id,
                        'url' => $image->url,
                    ];
                }),
            ]);
        });

        $categories = ArticleCategory::where('is_active', true)->orderBy('name')->get();

        return Inertia::render('admin/articles', [
            'articles' => $articles,
            'categories' => $categories,
            'filters' => $request->only(['search', 'is_published', 'category_id']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/articles/create', [
            'categories' => ArticleCategory::where('is_active', true)->orderBy('name')->get(),
            'users' => User::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function edit(Article $article)
    {
        $articleData = array_merge($article->toArray(), [
            'featured_image' => $article->featured_image_url,
            'published_at' => $article->published_at?->format('Y-m-d H:i:s'),
            'gallery' => $article->gallery->map(function ($image) {
                return [
                    'id' => $image->id,
                    'url' => $image->url,
                ];
            })->toArray(),
        ]);

        return Inertia::render('admin/articles/edit', [
            'article' => $articleData,
            'categories' => ArticleCategory::where('is_active', true)->orderBy('name')->get(),
            'users' => User::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string'],
            'content' => ['required', 'string'],
            'featured_image' => ['nullable', 'image', 'max:5120'], // 5MB max
            'author_name' => ['nullable', 'string', 'max:255'],
            'category_id' => ['nullable', 'exists:article_categories,id'],
            'user_id' => ['nullable', 'exists:users,id'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'gallery' => ['nullable', 'array', 'max:10'],
            'gallery.*' => ['image', 'max:5120'],
            'is_published' => ['boolean'],
            'is_featured' => ['boolean'],
        ]);

        if ($request->hasFile('featured_image')) {
            $validated['featured_image'] = $request->file('featured_image')->store('articles/images', 'public');
        }

        $validated['slug'] = Str::slug($validated['title']);
        $original = $validated['slug'];
        $count = 1;
        while (Article::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = $original.'-'.$count++;
        }

        unset($validated['gallery']);

        $article = Article::create($validated);

        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $index => $image) {
                $path = $image->store('articles/gallery', 'public');
                $article->gallery()->create([
                    'image_path' => $path,
                    'sort_order' => $index,
                ]);
            }
        }

        return redirect()->route('admin.articles.index')->with('success', 'Article created successfully.');
    }

    public function update(Request $request, Article $article)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string'],
            'content' => ['required', 'string'],
            'featured_image' => ['nullable', 'image', 'max:5120'],
            'author_name' => ['nullable', 'string', 'max:255'],
            'category_id' => ['nullable', 'exists:article_categories,id'],
            'user_id' => ['nullable', 'exists:users,id'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'gallery' => ['nullable', 'array', 'max:10'],
            'gallery.*' => ['image', 'max:5120'],
            'is_published' => ['boolean'],
            'is_featured' => ['boolean'],
        ]);

        if ($request->hasFile('featured_image')) {
            if ($article->featured_image) {
                Storage::disk('public')->delete($article->featured_image);
            }
            $validated['featured_image'] = $request->file('featured_image')->store('articles/images', 'public');
        } else {
            unset($validated['featured_image']);
        }

        unset($validated['gallery']);

        $article->update($validated);

        if ($request->hasFile('gallery')) {
            $currentMaxOrder = $article->gallery()->max('sort_order') ?? -1;
            foreach ($request->file('gallery') as $index => $image) {
                $path = $image->store('articles/gallery', 'public');
                $article->gallery()->create([
                    'image_path' => $path,
                    'sort_order' => $currentMaxOrder + 1 + $index,
                ]);
            }
        }

        return redirect()->route('admin.articles.index')->with('success', 'Article updated successfully.');
    }

    public function togglePublish(Article $article)
    {
        $article->update(['is_published' => ! $article->is_published]);
        $status = $article->is_published ? 'published' : 'unpublished';

        return redirect()->route('admin.articles.index')->with('success', "Article $status successfully.");
    }

    public function toggleFeatured(Article $article)
    {
        $article->update(['is_featured' => ! $article->is_featured]);
        $status = $article->is_featured ? 'featured' : 'unfeatured';

        return redirect()->route('admin.articles.index')->with('success', "Article marked as $status.");
    }

    public function destroy(Article $article)
    {
        if ($article->featured_image) {
            Storage::disk('public')->delete($article->featured_image);
        }

        foreach ($article->gallery as $image) {
            Storage::disk('public')->delete($image->image_path);
        }

        $article->delete();

        return redirect()->route('admin.articles.index')->with('success', 'Article deleted permanently.');
    }

    public function deleteGalleryImage(ArticleGallery $image)
    {
        Storage::disk('public')->delete($image->image_path);
        $image->delete();

        return back()->with('success', 'Image deleted from gallery.');
    }
}
