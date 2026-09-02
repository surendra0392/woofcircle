<?php

namespace App\Http\Controllers\Support;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CannedResponse;
use Inertia\Inertia;

class ManageCannedResponseController extends Controller
{
    public function index()
    {
        $responses = CannedResponse::all();
        
        return Inertia::render('Support/CannedResponses/Index', [
            'responses' => $responses,
        ]);
    }

    public function create()
    {
        return Inertia::render('Support/CannedResponses/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        CannedResponse::create($validated);

        return redirect()->route('support.manage-canned.index')->with('success', 'Canned response created successfully.');
    }

    public function destroy(CannedResponse $cannedResponse)
    {
        $cannedResponse->delete();
        
        return redirect()->back()->with('success', 'Canned response deleted successfully.');
    }
}
