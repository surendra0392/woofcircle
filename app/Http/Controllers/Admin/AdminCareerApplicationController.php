<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CareerApplication;
use App\Models\CareerPosition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminCareerApplicationController
{
    public function index(Request $request)
    {
        $applications = CareerApplication::with('position')
            ->when($request->filled('search'), function ($q) use ($request) {
                $q->where(function ($q) use ($request) {
                    $q->where('full_name', 'like', '%' . $request->search . '%')
                      ->orWhere('email', 'like', '%' . $request->search . '%')
                      ->orWhere('phone', 'like', '%' . $request->search . '%');
                });
            })
            ->when($request->filled('position_id') && $request->position_id !== 'all', function ($q) use ($request) {
                $q->where('career_position_id', $request->position_id);
            })
            ->when($request->filled('status') && $request->status !== 'all', function ($q) use ($request) {
                $q->where('status', $request->status);
            })
            ->latest()
            ->paginate(15)
            ->through(function ($application) {
                return array_merge($application->toArray(), [
                    'applied_at' => $application->created_at->format('M d, Y'),
                    'position_title' => $application->position?->title ?? 'Deleted Position',
                    'position_department' => $application->position?->department ?? '-',
                ]);
            });

        $positions = CareerPosition::orderBy('title')->get(['id', 'title']);

        return Inertia::render('admin/careers/applications/index', [
            'applications' => $applications,
            'positions' => $positions,
            'filters' => $request->only(['search', 'position_id', 'status']),
        ]);
    }

    public function show(CareerApplication $careerApplication)
    {
        $careerApplication->load('position');

        return Inertia::render('admin/careers/applications/show', [
            'application' => array_merge($careerApplication->toArray(), [
                'applied_at' => $careerApplication->created_at->format('M d, Y \a\t h:i A'),
                'position_title' => $careerApplication->position?->title ?? 'Deleted Position',
                'position_department' => $careerApplication->position?->department ?? '-',
                'position_location' => $careerApplication->position?->location ?? '-',
            ]),
        ]);
    }

    public function updateStatus(Request $request, CareerApplication $careerApplication)
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:pending,reviewed,shortlisted,rejected'],
            'admin_notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $careerApplication->update($validated);

        return back()->with('success', 'Application status updated.');
    }

    public function downloadResume(CareerApplication $careerApplication)
    {
        if (!$careerApplication->resume_path || !Storage::disk('public')->exists($careerApplication->resume_path)) {
            return back()->with('error', 'Resume file not found.');
        }

        $extension = pathinfo($careerApplication->resume_path, PATHINFO_EXTENSION);
        $filename = str_replace(' ', '_', $careerApplication->full_name) . '_resume.' . $extension;

        return Storage::disk('public')->download($careerApplication->resume_path, $filename);
    }

    public function export(Request $request): StreamedResponse
    {
        $applications = CareerApplication::with('position')
            ->when($request->filled('position_id') && $request->position_id !== 'all', function ($q) use ($request) {
                $q->where('career_position_id', $request->position_id);
            })
            ->when($request->filled('status') && $request->status !== 'all', function ($q) use ($request) {
                $q->where('status', $request->status);
            })
            ->latest()
            ->get();

        return response()->streamDownload(function () use ($applications) {
            $handle = fopen('php://output', 'w');

            // Header row
            fputcsv($handle, [
                'ID', 'Position', 'Department', 'Full Name', 'Email', 'Phone',
                'Experience (Years)', 'Current Company', 'LinkedIn', 'Portfolio',
                'Status', 'Applied Date', 'Cover Letter', 'Admin Notes',
            ]);

            foreach ($applications as $app) {
                fputcsv($handle, [
                    $app->id,
                    $app->position?->title ?? 'Deleted',
                    $app->position?->department ?? '-',
                    $app->full_name,
                    $app->email,
                    $app->phone,
                    $app->experience_years ?? '-',
                    $app->current_company ?? '-',
                    $app->linkedin_url ?? '-',
                    $app->portfolio_url ?? '-',
                    $app->status,
                    $app->created_at->format('Y-m-d H:i'),
                    $app->cover_letter ?? '-',
                    $app->admin_notes ?? '-',
                ]);
            }

            fclose($handle);
        }, 'career_applications_' . now()->format('Y_m_d') . '.csv', [
            'Content-Type' => 'text/csv',
        ]);
    }

    public function destroy(CareerApplication $careerApplication)
    {
        if ($careerApplication->resume_path) {
            Storage::disk('public')->delete($careerApplication->resume_path);
        }

        $careerApplication->delete();

        return redirect()->route('admin.career-applications.index')->with('success', 'Application deleted successfully.');
    }
}
