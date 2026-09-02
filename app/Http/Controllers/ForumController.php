<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\ForumCategory;
use App\Models\ForumThread;
use App\Models\ForumReply;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ForumController
{
    public function index()
    {
        $categories = ForumCategory::withCount('threads')->orderBy('sort_order')->get();
        $latestThreads = ForumThread::with(['user', 'category'])->latest()->take(6)->get();

        $totalThreads = ForumThread::count();
        $totalReplies = ForumReply::count();

        return Inertia::render('forum/index', [
            'categories' => $categories,
            'latestThreads' => $latestThreads,
            'stats' => [
                'categories_count' => $categories->count(),
                'threads_count' => $totalThreads,
                'replies_count' => $totalReplies,
            ],
        ]);
    }

    public function category(ForumCategory $category)
    {
        $threads = $category->threads()->with('user')->withCount('replies')->latest()->paginate(15);
        return Inertia::render('forum/category', [
            'category' => $category,
            'threads' => $threads,
        ]);
    }

    public function show(ForumCategory $category, ForumThread $thread)
    {
        $thread->increment('view_count');
        $thread->load(['user', 'category']);
        $replies = $thread->replies()->with('user')->oldest()->paginate(20);

        return Inertia::render('forum/thread', [
            'thread' => $thread,
            'replies' => $replies,
        ]);
    }

    public function create(ForumCategory $category)
    {
        return Inertia::render('forum/create', [
            'category' => $category
        ]);
    }

    public function store(Request $request, ForumCategory $category)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
        ]);

        $thread = $category->threads()->create([
            'user_id' => auth()->id(),
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']) . '-' . uniqid(),
            'body' => $validated['body'],
        ]);

        auth()->user()->increment('karma_points', 5);

        return redirect()->route('forum.thread', [$category->slug, $thread->slug])
            ->with('success', 'Thread created successfully!');
    }

    public function storeReply(Request $request, ForumCategory $category, ForumThread $thread)
    {
        $validated = $request->validate([
            'body' => 'required|string',
        ]);

        $thread->replies()->create([
            'user_id' => auth()->id(),
            'body' => $validated['body'],
        ]);

        $thread->increment('reply_count');

        auth()->user()->increment('karma_points', 2);

        return back()->with('success', 'Reply posted successfully!');
    }
}
