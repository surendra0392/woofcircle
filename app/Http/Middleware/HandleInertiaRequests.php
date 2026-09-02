<?php

namespace App\Http\Middleware;

use App\Models\Message;
use App\Models\Setting;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $petQuotes = collect([
            'A dog is the only thing on earth that loves you more than he loves himself. - Josh Billings',
            'Dogs are not our whole life, but they make our lives whole. - Roger Caras',
            'The better I get to know men, the more I find myself loving dogs. - Charles de Gaulle',
            'Happiness is a warm puppy. - Charles M. Schulz',
            'A dog will teach you unconditional love. If you can have that in your life, things won\'t be too bad. - Robert Wagner',
            'Everything I know I learned from dogs. - Nora Roberts',
            'Love is a four-legged word. - Unknown',
            'The world would be a nicer place if everyone had the ability to love as unconditionally as a dog. - M.K. Clinton',
            'No matter how little money and how few possessions you own, having a dog makes you rich. - Louis Sabin',
            'Dogs leave paw prints on our hearts. - Unknown',
        ]);

        [$message, $author] = str($petQuotes->random())->explode(' - ');

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user() ? array_merge($request->user()->toArray(), [
                    'roles' => $request->user()->roles->pluck('slug')->toArray(),
                    'unread_messages_count' => Message::where('user_id', '!=', $request->user()->id)
                        ->whereHas('conversation', function ($q) use ($request) {
                            $q->whereHas('users', function ($q2) use ($request) {
                                $q2->where('users.id', $request->user()->id);
                            });
                        })
                        ->whereNull('read_at')
                        ->count(),
                ]) : null,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'warning' => $request->session()->get('warning'),
                'info' => $request->session()->get('info'),
            ],
            'settings' => \Cache::rememberForever('site_settings', function () {
                return Setting::all()->pluck('value', 'key')->toArray();
            }),
            'user_location' => collect($request->session()->get('user_location'))->toArray() ?: null,
        ];
    }
}
