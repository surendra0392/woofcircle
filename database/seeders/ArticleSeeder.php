<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\ArticleCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Article Categories
        $categories = [
            'Dog Training' => 'Professional behavior, obedience coaching, and puppy foundations.',
            'Puppy Care' => 'Essential guidance for the crucial early months of your canine companion.',
            'Health & Nutrition' => 'Veterinary insights, dietary formulation, and preventative medicine.',
            'Breed Profiles' => 'Deep analytical dives into temperaments, origins, and genetics.',
            'Lifestyle & Travel' => 'Luxury stays, transport protocols, and contemporary living with companions.',
            'Events & Shows' => 'Kennel club championship trials, agility showcases, and community meetups.',
        ];

        $categoryMap = [];
        foreach ($categories as $catName => $catDesc) {
            $categoryMap[$catName] = ArticleCategory::firstOrCreate(
                ['slug' => Str::slug($catName)],
                [
                    'name' => $catName,
                    'is_active' => true,
                ]
            );
        }

        $curatedArticles = [
            [
                'title' => 'The Architecture of Canine Nutrition: Custom Formulations for Champions',
                'category' => 'Health & Nutrition',
                'featured_image' => 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop',
                'excerpt' => 'A deep dive into custom ancestral formulations, micronutrient density, and botanical additions suited for high-energy working lineages.',
                'content' => 'Optimal canine vitality begins at the cellular level. When developing nutritional strategies for high-performance companions, ancestral macro-ratios must balance raw lean proteins, organ-derived minerals, and cold-pressed omega oils. Modern clinical trials emphasize the protective impact of natural polyphenols and prebiotic fibers on digestive microbiome longevity.',
                'author_name' => 'Dr. Victoria Sterling, MRCVS',
                'is_featured' => true,
            ],
            [
                'title' => 'Travel Redefined: Six-Star Stays & Private Retreats for Modern Companions',
                'category' => 'Lifestyle & Travel',
                'featured_image' => 'https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=800&auto=format&fit=crop',
                'excerpt' => 'A curated review of six-star boarding retreats, bespoke air travel accommodations, and private paddock getaways across India.',
                'content' => 'High-end hospitality for canines has evolved beyond simple kennels into bespoke sanctuaries. From climate-controlled master suites and hydrotherapy recovery pools to personalized chef-crafted menus, we review how top retreats ensure total comfort and mental equilibrium for traveling companions.',
                'author_name' => 'Alistair Vance',
                'is_featured' => true,
            ],
            [
                'title' => 'Understanding Lineage: How Genetic Tapestries Safeguard Breed Heritage',
                'category' => 'Breed Profiles',
                'featured_image' => 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=800&auto=format&fit=crop',
                'excerpt' => 'How genome tracing, COI coefficients, and predictive diagnostics safeguard pedigree legacy and companion longevity.',
                'content' => 'Preserving true breed standards requires meticulous attention to hereditary genetics. Through comprehensive DNA profiling and coefficient of inbreeding calculations, ethical breeders eliminate recessive hereditary conditions while reinforcing true breed temperament, conformation, and resilience.',
                'author_name' => 'Elizabeth Montgomery',
                'is_featured' => true,
            ],
            [
                'title' => 'The Art of K9 Behavioral Mastery: Positive Reinforcement & Working Trials',
                'category' => 'Dog Training',
                'featured_image' => 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=800&auto=format&fit=crop',
                'excerpt' => 'Modern positive reinforcement methodologies and neurological communication patterns in working and companion canines.',
                'content' => 'True obedience is built upon communication, trust, and clear motivational drives. By understanding operative conditioning and reward timing, master trainers develop responsive, calm, and confident companions capable of thriving in complex urban and show environments.',
                'author_name' => 'Marcus Thorne, Master K9 Instructor',
                'is_featured' => true,
            ],
            [
                'title' => 'The Golden Months: Essential Development Milestones for Young Pups',
                'category' => 'Puppy Care',
                'featured_image' => 'https://images.unsplash.com/photo-1591768575198-88dac53fbd0a?q=80&w=800&auto=format&fit=crop',
                'excerpt' => 'A step-by-step master plan for socialization, neurological stimulation, and early health vaccination protocols.',
                'content' => 'Between 8 and 16 weeks of age, a puppy’s cognitive framework undergoes its most pivotal development. Introducing varied environmental stimuli, controlled social interactions, and positive crate associations lays the indestructible foundation for a balanced adult canine.',
                'author_name' => 'Dr. Sarah Jenkins',
                'is_featured' => false,
            ],
            [
                'title' => 'Championship Rings & Conformation: A Behind-the-Scenes Showcase',
                'category' => 'Events & Shows',
                'featured_image' => 'https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=800&auto=format&fit=crop',
                'excerpt' => 'Inside the judging standards, gait analysis, and preparation routines of international kennel club show rings.',
                'content' => 'Conformation shows are not mere beauty pageants—they are exacting assessments of structural biomechanics and breed standard fidelity. We explore how judges evaluate gait, top-line stability, coat texture, and alertness under international kennel standards.',
                'author_name' => 'WoofCircle Editorial Board',
                'is_featured' => false,
            ],
        ];

        foreach ($curatedArticles as $artData) {
            $cat = $categoryMap[$artData['category']] ?? null;
            Article::create([
                'title' => $artData['title'],
                'slug' => Str::slug($artData['title']),
                'excerpt' => $artData['excerpt'],
                'content' => $artData['content'],
                'featured_image' => $artData['featured_image'],
                'author_name' => $artData['author_name'],
                'category_id' => $cat?->id,
                'is_published' => true,
                'is_featured' => $artData['is_featured'],
                'published_at' => now()->subDays(rand(1, 30)),
                'meta_title' => $artData['title'],
                'meta_description' => $artData['excerpt'],
            ]);
        }

        $this->command->info('Curated Articles and Article Categories seeded successfully!');
    }
}
