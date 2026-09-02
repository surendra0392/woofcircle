<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ForumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Health & Nutrition',
                'slug' => 'health-and-nutrition',
                'description' => 'Discuss pet diet, vet care, supplements, and overall well-being.',
                'icon' => 'HeartPulse',
                'sort_order' => 1,
            ],
            [
                'name' => 'Training & Behavior',
                'slug' => 'training-and-behavior',
                'description' => 'Share tips on obedience, behavioral issues, and advanced training techniques.',
                'icon' => 'Brain',
                'sort_order' => 2,
            ],
            [
                'name' => 'Breeding & Genetics',
                'slug' => 'breeding-and-genetics',
                'description' => 'A place for breeders to discuss bloodlines, genetics, and responsible breeding practices.',
                'icon' => 'Dna',
                'sort_order' => 3,
            ],
            [
                'name' => 'Marketplace Discussions',
                'slug' => 'marketplace-discussions',
                'description' => 'Discussions about buying, selling, stud services, and pet supplies.',
                'icon' => 'ShoppingBag',
                'sort_order' => 4,
            ],
            [
                'name' => 'Off-Topic & Fun',
                'slug' => 'off-topic-and-fun',
                'description' => 'Share funny stories, photos, and chat about anything else!',
                'icon' => 'Smile',
                'sort_order' => 5,
            ]
        ];

        foreach ($categories as $cat) {
            $category = \App\Models\ForumCategory::updateOrCreate(['slug' => $cat['slug']], $cat);
            
            // Only seed threads if this category is empty
            if ($category->threads()->count() === 0) {
                $user = \App\Models\User::first() ?? \App\Models\User::factory()->create();
                
                for ($i = 1; $i <= 3; $i++) {
                    $thread = $category->threads()->create([
                        'user_id' => $user->id,
                        'title' => "Discussion about {$category->name} - Topic {$i}",
                        'slug' => \Illuminate\Support\Str::slug("Discussion about {$category->name} - Topic {$i}") . '-' . uniqid(),
                        'body' => "This is a sample discussion thread about {$category->name}. What are your thoughts and experiences?",
                        'view_count' => rand(10, 100),
                        'reply_count' => 2,
                    ]);

                    for ($j = 1; $j <= 2; $j++) {
                        $thread->replies()->create([
                            'user_id' => $user->id,
                            'body' => "This is a great point about {$category->name}. I completely agree with your thoughts on Topic {$i}.",
                        ]);
                    }
                }
            }
        }
    }
}
