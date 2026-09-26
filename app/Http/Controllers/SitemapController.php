<?php

namespace App\Http\Controllers;

use App\Models\Adoption;
use App\Models\Article;
use App\Models\BoardingProfile;
use App\Models\Breed;
use App\Models\BreederProfile;
use App\Models\Event;
use App\Models\Litter;
use App\Models\PetShopProfile;
use App\Models\StudService;
use App\Models\TrainerProfile;
use App\Models\VetProfile;
use Carbon\Carbon;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    /**
     * Get root URL for sitemaps.
     */
    protected function baseUrl(): string
    {
        return rtrim(config('app.url', 'https://woofcircle.in'), '/');
    }

    /**
     * XML Sitemap Index.
     */
    public function index(): Response
    {
        $base = $this->baseUrl();
        $now = Carbon::now()->toAtomString();

        $subSitemaps = [
            'sitemap-pages.xml',
            'sitemap-breeds.xml',
            'sitemap-litters.xml',
            'sitemap-studs.xml',
            'sitemap-adoptions.xml',
            'sitemap-directories.xml',
            'sitemap-articles.xml',
            'sitemap-events.xml',
        ];

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        foreach ($subSitemaps as $sitemap) {
            $xml .= "  <sitemap>\n";
            $xml .= "    <loc>{$base}/{$sitemap}</loc>\n";
            $xml .= "    <lastmod>{$now}</lastmod>\n";
            $xml .= "  </sitemap>\n";
        }

        $xml .= '</sitemapindex>';

        return response($xml, 200, [
            'Content-Type' => 'application/xml; charset=utf-8',
            'Cache-Control' => 'public, max-age=3600',
        ]);
    }

    /**
     * Core static pages sitemap.
     */
    public function pages(): Response
    {
        $base = $this->baseUrl();
        $today = Carbon::today()->toAtomString();

        $staticPages = [
            ['path' => '', 'priority' => '1.0', 'freq' => 'daily'],
            ['path' => '/puppies', 'priority' => '0.9', 'freq' => 'daily'],
            ['path' => '/breeds', 'priority' => '0.9', 'freq' => 'weekly'],
            ['path' => '/breeds/compare', 'priority' => '0.7', 'freq' => 'monthly'],
            ['path' => '/breeders', 'priority' => '0.8', 'freq' => 'daily'],
            ['path' => '/studs', 'priority' => '0.8', 'freq' => 'daily'],
            ['path' => '/adoptions', 'priority' => '0.8', 'freq' => 'daily'],
            ['path' => '/directory', 'priority' => '0.8', 'freq' => 'daily'],
            ['path' => '/vets', 'priority' => '0.8', 'freq' => 'daily'],
            ['path' => '/trainers', 'priority' => '0.8', 'freq' => 'daily'],
            ['path' => '/boarding', 'priority' => '0.8', 'freq' => 'daily'],
            ['path' => '/welfare', 'priority' => '0.7', 'freq' => 'weekly'],
            ['path' => '/pet-shops', 'priority' => '0.7', 'freq' => 'weekly'],
            ['path' => '/articles', 'priority' => '0.8', 'freq' => 'daily'],
            ['path' => '/events', 'priority' => '0.7', 'freq' => 'weekly'],
            ['path' => '/community/feed', 'priority' => '0.7', 'freq' => 'daily'],
            ['path' => '/community/leaderboard', 'priority' => '0.6', 'freq' => 'weekly'],
            ['path' => '/forum', 'priority' => '0.7', 'freq' => 'daily'],
            ['path' => '/gallery', 'priority' => '0.6', 'freq' => 'weekly'],
            ['path' => '/pricing', 'priority' => '0.6', 'freq' => 'monthly'],
            ['path' => '/about', 'priority' => '0.5', 'freq' => 'monthly'],
            ['path' => '/contact', 'priority' => '0.5', 'freq' => 'monthly'],
            ['path' => '/careers', 'priority' => '0.5', 'freq' => 'monthly'],
            ['path' => '/lost-pets', 'priority' => '0.7', 'freq' => 'daily'],
            ['path' => '/reviews', 'priority' => '0.6', 'freq' => 'weekly'],
            ['path' => '/privacy-policy', 'priority' => '0.3', 'freq' => 'yearly'],
            ['path' => '/terms-and-ethics', 'priority' => '0.3', 'freq' => 'yearly'],
            ['path' => '/help-center', 'priority' => '0.4', 'freq' => 'monthly'],
        ];

        return $this->buildUrlsetResponse($staticPages, function ($item) use ($base, $today) {
            return [
                'loc' => $base . $item['path'],
                'lastmod' => $today,
                'changefreq' => $item['freq'],
                'priority' => $item['priority'],
            ];
        });
    }

    /**
     * Breeds sitemap.
     */
    public function breeds(): Response
    {
        $base = $this->baseUrl();
        $breeds = Breed::select('slug', 'updated_at')->get();

        return $this->buildUrlsetResponse($breeds, function ($breed) use ($base) {
            return [
                'loc' => "{$base}/breeds/{$breed->slug}",
                'lastmod' => ($breed->updated_at ?? Carbon::now())->toAtomString(),
                'changefreq' => 'weekly',
                'priority' => '0.8',
            ];
        });
    }

    /**
     * Litters / Puppies sitemap.
     */
    public function litters(): Response
    {
        $base = $this->baseUrl();
        $litters = Litter::where('is_available', true)
            ->where(function ($q) {
                $q->where('status', 'active')->orWhere('status', 'approved')->orWhereNull('status');
            })
            ->select('id', 'slug', 'updated_at')
            ->get();

        return $this->buildUrlsetResponse($litters, function ($litter) use ($base) {
            $identifier = $litter->slug ?: $litter->id;
            return [
                'loc' => "{$base}/puppies/{$identifier}",
                'lastmod' => ($litter->updated_at ?? Carbon::now())->toAtomString(),
                'changefreq' => 'daily',
                'priority' => '0.9',
            ];
        });
    }

    /**
     * Stud Services sitemap.
     */
    public function studs(): Response
    {
        $base = $this->baseUrl();
        $studs = StudService::where('is_available', true)
            ->where(function ($q) {
                $q->where('status', 'active')->orWhere('status', 'approved')->orWhereNull('status');
            })
            ->select('id', 'slug', 'updated_at')
            ->get();

        return $this->buildUrlsetResponse($studs, function ($stud) use ($base) {
            $identifier = $stud->slug ?: $stud->id;
            return [
                'loc' => "{$base}/studs/{$identifier}",
                'lastmod' => ($stud->updated_at ?? Carbon::now())->toAtomString(),
                'changefreq' => 'daily',
                'priority' => '0.8',
            ];
        });
    }

    /**
     * Adoptions sitemap.
     */
    public function adoptions(): Response
    {
        $base = $this->baseUrl();
        $adoptions = Adoption::where('is_available', true)
            ->where(function ($q) {
                $q->where('status', 'active')->orWhere('status', 'approved')->orWhereNull('status');
            })
            ->select('id', 'slug', 'updated_at')
            ->get();

        return $this->buildUrlsetResponse($adoptions, function ($adoption) use ($base) {
            $identifier = $adoption->slug ?: $adoption->id;
            return [
                'loc' => "{$base}/adoptions/{$identifier}",
                'lastmod' => ($adoption->updated_at ?? Carbon::now())->toAtomString(),
                'changefreq' => 'daily',
                'priority' => '0.8',
            ];
        });
    }

    /**
     * Directory profiles (Vets, Trainers, Boarding, Welfare, Pet Shops, Breeders).
     */
    public function directories(): Response
    {
        $base = $this->baseUrl();
        $urls = [];

        // Vets
        VetProfile::where('is_approved', true)->select('slug', 'updated_at')->get()->each(function ($p) use ($base, &$urls) {
            $urls[] = ['loc' => "{$base}/vets/{$p->slug}", 'lastmod' => ($p->updated_at ?? Carbon::now())->toAtomString(), 'priority' => '0.8'];
        });

        // Trainers
        TrainerProfile::where('is_approved', true)->select('slug', 'updated_at')->get()->each(function ($p) use ($base, &$urls) {
            $urls[] = ['loc' => "{$base}/trainers/{$p->slug}", 'lastmod' => ($p->updated_at ?? Carbon::now())->toAtomString(), 'priority' => '0.8'];
        });

        // Boarding
        BoardingProfile::where('is_approved', true)->select('slug', 'updated_at')->get()->each(function ($p) use ($base, &$urls) {
            $urls[] = ['loc' => "{$base}/boarding/{$p->slug}", 'lastmod' => ($p->updated_at ?? Carbon::now())->toAtomString(), 'priority' => '0.8'];
        });

        // Welfare
        WelfareProfile::where('is_approved', true)->select('slug', 'updated_at')->get()->each(function ($p) use ($base, &$urls) {
            $urls[] = ['loc' => "{$base}/welfare/{$p->slug}", 'lastmod' => ($p->updated_at ?? Carbon::now())->toAtomString(), 'priority' => '0.7'];
        });

        // Pet Shops
        PetShopProfile::where('is_approved', true)->select('slug', 'updated_at')->get()->each(function ($p) use ($base, &$urls) {
            $urls[] = ['loc' => "{$base}/pet-shops/{$p->slug}", 'lastmod' => ($p->updated_at ?? Carbon::now())->toAtomString(), 'priority' => '0.7'];
        });

        // Breeders
        BreederProfile::where('is_approved', true)->select('slug', 'updated_at')->get()->each(function ($p) use ($base, &$urls) {
            $urls[] = ['loc' => "{$base}/breeders/{$p->slug}", 'lastmod' => ($p->updated_at ?? Carbon::now())->toAtomString(), 'priority' => '0.8'];
        });

        return $this->buildUrlsetResponse($urls, function ($item) {
            return [
                'loc' => $item['loc'],
                'lastmod' => $item['lastmod'],
                'changefreq' => 'weekly',
                'priority' => $item['priority'],
            ];
        });
    }

    /**
     * Articles / Blog posts sitemap.
     */
    public function articles(): Response
    {
        $base = $this->baseUrl();
        $articles = Article::where('is_published', true)->select('slug', 'updated_at')->get();

        return $this->buildUrlsetResponse($articles, function ($article) use ($base) {
            return [
                'loc' => "{$base}/articles/{$article->slug}",
                'lastmod' => ($article->updated_at ?? Carbon::now())->toAtomString(),
                'changefreq' => 'weekly',
                'priority' => '0.8',
            ];
        });
    }

    /**
     * Events sitemap.
     */
    public function events(): Response
    {
        $base = $this->baseUrl();
        $events = Event::select('slug', 'updated_at')->get();

        return $this->buildUrlsetResponse($events, function ($event) use ($base) {
            return [
                'loc' => "{$base}/events/{$event->slug}",
                'lastmod' => ($event->updated_at ?? Carbon::now())->toAtomString(),
                'changefreq' => 'weekly',
                'priority' => '0.7',
            ];
        });
    }

    /**
     * Helper to build XML urlset.
     */
    protected function buildUrlsetResponse($items, callable $formatter): Response
    {
        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        foreach ($items as $item) {
            $data = $formatter($item);
            $xml .= "  <url>\n";
            $xml .= "    <loc>" . htmlspecialchars($data['loc'], ENT_XML1, 'UTF-8') . "</loc>\n";
            $xml .= "    <lastmod>{$data['lastmod']}</lastmod>\n";
            $xml .= "    <changefreq>{$data['changefreq']}</changefreq>\n";
            $xml .= "    <priority>{$data['priority']}</priority>\n";
            $xml .= "  </url>\n";
        }

        $xml .= '</urlset>';

        return response($xml, 200, [
            'Content-Type' => 'application/xml; charset=utf-8',
            'Cache-Control' => 'public, max-age=3600',
        ]);
    }
}
