<?php

namespace App\Http\Controllers;

use App\Models\CareerApplication;
use App\Models\CareerPosition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PublicCareerController
{
    public function index()
    {
        $positions = CareerPosition::active()
            ->orderBy('sort_order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('careers', [
            'positions' => $positions
        ]);
    }

    public function apply(Request $request)
    {
        $request->validate([
            'career_position_id' => 'required|exists:career_positions,id',
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'cover_letter' => 'nullable|string',
            'resume' => 'required|file|mimes:pdf,doc,docx|max:5120',
            'experience_years' => 'nullable|integer|min:0|max:50',
            'current_company' => 'nullable|string|max:255',
            'linkedin_url' => 'nullable|url|max:255',
            'portfolio_url' => 'nullable|url|max:255',
        ]);

        $position = CareerPosition::findOrFail($request->career_position_id);
        if (!$position->is_active) {
            return back()->withErrors(['career_position_id' => 'This position is no longer accepting applications.']);
        }

        // Store the resume securely in the public disk
        $path = $request->file('resume')->store('resumes', 'public');

        CareerApplication::create([
            'career_position_id' => $request->career_position_id,
            'full_name' => $request->full_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'cover_letter' => $request->cover_letter,
            'resume_path' => $path,
            'experience_years' => $request->experience_years,
            'current_company' => $request->current_company,
            'linkedin_url' => $request->linkedin_url,
            'portfolio_url' => $request->portfolio_url,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Your application for ' . $position->title . ' has been submitted successfully!');
    }
}
