<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Gallery;
use App\Models\GalleryCategory;
use App\Models\GalleryImage;
use App\Models\GalleryLike;
use App\Models\State;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class GallerySeeder extends Seeder
{
    public function run(): void
    {
        // Clean up previous galleries to avoid duplicates on re-runs
        // This will cascade delete gallery_images and gallery_likes
        Gallery::query()->delete();

        // Ensure mock/placeholder images exist in public storage
        $disk = Storage::disk('public');
        $disk->makeDirectory('gallery');
        $disk->makeDirectory('gallery/album');

        $imageUrls = [
            'gallery/sample_main_1.jpg' => 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
            'gallery/sample_main_2.jpg' => 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
            'gallery/album/sample1.jpg' => 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
            'gallery/album/sample2.jpg' => 'https://images.unsplash.com/photo-1537151608828-ea2b117b62e4?auto=format&fit=crop&w=800&q=80',
            'gallery/album/sample3.jpg' => 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=800&q=80',

            // New 15 seed images for the 20 galleries pool
            'gallery/album/seed_1.jpg' => 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
            'gallery/album/seed_2.jpg' => 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=800&q=80',
            'gallery/album/seed_3.jpg' => 'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?auto=format&fit=crop&w=800&q=80',
            'gallery/album/seed_4.jpg' => 'https://images.unsplash.com/photo-1477884213960-b1396a724b40?auto=format&fit=crop&w=800&q=80',
            'gallery/album/seed_5.jpg' => 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
            'gallery/album/seed_6.jpg' => 'https://images.unsplash.com/photo-1514984879728-be0aff75a6e8?auto=format&fit=crop&w=800&q=80',
            'gallery/album/seed_7.jpg' => 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&w=800&q=80',
            'gallery/album/seed_8.jpg' => 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=800&q=80',
            'gallery/album/seed_9.jpg' => 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
            'gallery/album/seed_10.jpg' => 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=800&q=80',
            'gallery/album/seed_11.jpg' => 'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?auto=format&fit=crop&w=800&q=80',
            'gallery/album/seed_12.jpg' => 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=800&q=80',
            'gallery/album/seed_13.jpg' => 'https://images.unsplash.com/photo-1444212477490-ca407925329e?auto=format&fit=crop&w=800&q=80',
            'gallery/album/seed_14.jpg' => 'https://images.unsplash.com/photo-1510771433102-609149ef0371?auto=format&fit=crop&w=800&q=80',
            'gallery/album/seed_15.jpg' => 'https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=800&q=80',
        ];

        foreach ($imageUrls as $path => $url) {
            if (! $disk->exists($path)) {
                try {
                    $content = @file_get_contents($url);
                    if ($content !== false) {
                        $disk->put($path, $content);
                    } else {
                        throw new \Exception;
                    }
                } catch (\Exception $e) {
                    if (function_exists('imagecreatetruecolor')) {
                        $im = imagecreatetruecolor(800, 600);
                        $bg = imagecolorallocate($im, 240, 230, 210);
                        imagefill($im, 0, 0, $bg);
                        $textColor = imagecolorallocate($im, 40, 40, 40);
                        imagestring($im, 5, 50, 50, 'Woof Circle - '.basename($path), $textColor);
                        ob_start();
                        imagejpeg($im);
                        $imgData = ob_get_clean();
                        imagedestroy($im);
                        $disk->put($path, $imgData);
                    }
                }
            }
        }

        // 1. Create/Retrieve Categories
        $cats = ['Puppies', 'Events', 'Training', 'Rescue'];
        $categoryModels = [];
        foreach ($cats as $cat) {
            $categoryModels[] = GalleryCategory::updateOrCreate(
                ['slug' => Str::slug($cat)],
                [
                    'name' => $cat,
                    'description' => "Visuals related to $cat",
                    'is_active' => true,
                ]
            );
        }

        $state = State::first();
        $city = City::where('state_id', $state->id)->first() ?? City::first();

        // 2. Create the 2 Demo Gallery Entries (so existing event/article logic is unaffected)
        $demoItems = [
            [
                'title' => 'Puppy Training Session',
                'description' => 'A group of puppies learning basic obedience.',
                'image' => 'gallery/sample_main_1.jpg',
                'category_id' => $categoryModels[2]->id, // Training
                'state_id' => $state->id,
                'city_id' => $city->id,
                'is_featured' => true,
                'is_active' => true,
                'images' => [
                    ['path' => 'gallery/album/sample1.jpg', 'caption' => 'Initial group gathering'],
                    ['path' => 'gallery/album/sample2.jpg', 'caption' => 'Learning to sit'],
                ],
            ],
            [
                'title' => 'Dog Show 2025 Highlights',
                'description' => 'The grand championship show held in Mumbai.',
                'image' => 'gallery/sample_main_2.jpg',
                'category_id' => $categoryModels[1]->id, // Events
                'state_id' => $state->id,
                'city_id' => $city->id,
                'is_featured' => true,
                'is_active' => true,
                'images' => [
                    ['path' => 'gallery/album/sample3.jpg', 'caption' => 'The winners circle'],
                ],
            ],
        ];

        foreach ($demoItems as $itemData) {
            $images = $itemData['images'];
            unset($itemData['images']);

            $gallery = Gallery::create($itemData);

            foreach ($images as $img) {
                GalleryImage::create([
                    'gallery_id' => $gallery->id,
                    'image_path' => $img['path'],
                    'caption' => $img['caption'],
                ]);
            }
        }

        // 3. Create 20 Random Galleries
        $users = User::all();
        $states = State::all();
        $seedImageKeys = array_keys(array_slice($imageUrls, 5)); // Only the 15 seed_x.jpg images

        $titles = [
            'Playful Golden Retrievers in the Park',
            'French Bulldog Puppy Adventures',
            'Majestic German Shepherds Training',
            'Happy Huskies Playing in Snow',
            'Cute Corgi Beach Day Out',
            'Dachshund Fun Obstacle Course',
            'Poodle Styling and Grooming Show',
            'Border Collie Agility Championship',
            'Adorable Shiba Inu Autumn Walk',
            'Great Dane Gentle Giant Playtime',
            'Boxer Puppies First Vet Visit',
            'Beagle Sniffing Trails Exploration',
            'Rottweiler Family Guard Dog Training',
            'Chihuahua Tiny Explorer Journey',
            'Cavalier King Charles Spaniel Naptime',
            'Pug Funny Moments in the Yard',
            'Labrador Retriever Lake Swim Practice',
            'Australian Shepherd Tricks Showcase',
            'Shih Tzu Royal Haircuts Display',
            'Boston Terrier City Park Strolls',
        ];

        foreach ($titles as $index => $title) {
            // Determine owner: 25% Admin (user_id => null), 75% Random User
            $isAdmin = ($index % 4 === 0);
            $userId = $isAdmin ? null : $users->random()->id;

            // Pick random location
            $selectedState = $states->random();
            $selectedCity = City::where('state_id', $selectedState->id)->first() ?? $city;

            // Select random main image
            $featuredImage = $seedImageKeys[array_rand($seedImageKeys)];

            // Select 5 to 10 random album images from the seed pool
            $numImages = rand(5, 10);
            $shuffledKeys = $seedImageKeys;
            shuffle($shuffledKeys);
            $albumKeys = array_slice($shuffledKeys, 0, $numImages);

            // 80% chance of being active, or always active if admin
            $isActive = $isAdmin ? true : (rand(1, 10) <= 8);

            // Create Gallery record
            $gallery = Gallery::create([
                'user_id' => $userId,
                'title' => $title,
                'description' => "A beautiful showcase titled '{$title}', highlighting moments, breeds, and local canine gatherings.",
                'image' => $featuredImage,
                'category_id' => $categoryModels[array_rand($categoryModels)]->id,
                'state_id' => $selectedState->id,
                'city_id' => $selectedCity->id,
                'is_featured' => (rand(1, 10) <= 2), // 20% chance of being featured
                'is_active' => $isActive,
                'shares_count' => rand(5, 60),
                'exports_count' => rand(2, 25),
            ]);

            // Add Album Images
            foreach ($albumKeys as $sortIdx => $imagePath) {
                GalleryImage::create([
                    'gallery_id' => $gallery->id,
                    'image_path' => $imagePath,
                    'caption' => 'Captured scene '.($sortIdx + 1).' of '.$gallery->title,
                    'sort_order' => $sortIdx,
                ]);
            }

            // Create user-associated likes (ensuring unique constraints)
            $numLikes = rand(5, 30);
            if ($users->isNotEmpty()) {
                $likedUsers = $users->random(min($numLikes, $users->count()));
                foreach ($likedUsers as $likedUser) {
                    GalleryLike::create([
                        'gallery_id' => $gallery->id,
                        'user_id' => $likedUser->id,
                    ]);
                }
            }

            // Create guest likes
            $numGuestLikes = rand(0, 10);
            for ($g = 0; $g < $numGuestLikes; $g++) {
                GalleryLike::create([
                    'gallery_id' => $gallery->id,
                    'user_id' => null,
                    'ip_address' => '192.168.1.'.rand(1, 254),
                    'session_id' => Str::random(40),
                ]);
            }
        }
    }
}
