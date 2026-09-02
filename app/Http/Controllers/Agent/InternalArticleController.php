<?php

namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use App\Models\InternalArticle;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InternalArticleController extends Controller
{
    /**
     * Display paginated articles, optionally filtered by category.
     */
    public function index(Request $request)
    {
        $articles = InternalArticle::where('portal', 'agent')->latest()->get();

        return Inertia::render('Agent/KnowledgeBase/Index', [
            'articles' => $articles,
            'categories' => [],
            'filters' => [
                'category' => $request->category ?? 'all',
            ],
        ]);
    }

    /**
     * Show a single article.
     */
    public function show(InternalArticle $article)
    {
        return Inertia::render('Agent/KnowledgeBase/Show', [
            'article' => $article,
        ]);
    }

    /**
     * Show the form to create a new article (management only).
     */
    public function create()
    {
        $categories = InternalArticle::select('category', \Illuminate\Support\Facades\DB::raw('count(*) as count'))
            ->groupBy('category')
            ->orderByDesc('count')
            ->get();

        return Inertia::render('Agent/KnowledgeBase/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a new article.
     */
    public function store(Request $request)
    {
        $admin = auth('admin')->user();
        $mgmtRoles = ['team_leader', 'area_manager', 'district_head', 'state_head', 'superadmin'];

        if (! in_array($admin->role, $mgmtRoles)) {
            abort(403, 'Only agent managers can create articles.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'required|string|max:100',
        ]);

        $validated['portal'] = 'agent';

        InternalArticle::create($validated);

        return redirect()->route('agent.knowledge-base.index')
            ->with('success', 'Article published successfully.');
    }

    /**
     * Show the form to edit an existing article (management only).
     */
    public function edit(InternalArticle $article)
    {
        $admin = auth('admin')->user();
        $mgmtRoles = ['team_leader', 'area_manager', 'district_head', 'state_head', 'superadmin'];

        if (! in_array($admin->role, $mgmtRoles)) {
            abort(403, 'Only agent managers can edit articles.');
        }

        $categories = InternalArticle::select('category', \Illuminate\Support\Facades\DB::raw('count(*) as count'))
            ->groupBy('category')
            ->orderByDesc('count')
            ->get();

        return Inertia::render('Agent/KnowledgeBase/Edit', [
            'article' => $article,
            'categories' => $categories,
        ]);
    }

    /**
     * Update an existing article.
     */
    public function update(Request $request, InternalArticle $article)
    {
        $admin = auth('admin')->user();
        $mgmtRoles = ['team_leader', 'area_manager', 'district_head', 'state_head', 'superadmin'];

        if (! in_array($admin->role, $mgmtRoles)) {
            abort(403, 'Only agent managers can edit articles.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'required|string|max:100',
        ]);

        $article->update($validated);

        return redirect()->route('agent.knowledge-base.show', $article)
            ->with('success', 'Article updated successfully.');
    }

    /**
     * Delete an article.
     */
    public function destroy(InternalArticle $article)
    {
        $admin = auth('admin')->user();
        $mgmtRoles = ['team_leader', 'area_manager', 'district_head', 'state_head', 'superadmin'];

        if (! in_array($admin->role, $mgmtRoles)) {
            abort(403, 'Only agent managers can delete articles.');
        }

        $article->delete();

        return redirect()->route('agent.knowledge-base.index')
            ->with('success', 'Article deleted.');
    }
}
