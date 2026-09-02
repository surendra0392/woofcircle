<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\EventType;
use App\Models\State;
use Carbon\Carbon;
use Faker\Factory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Event Types
        $types = [
            'Dog Show',
            'Adoption Camp',
            'Training Workshop',
            'Breed Meetup',
            'Charity Run',
            'Health Clinic',
        ];

        $eventTypes = [];
        foreach ($types as $type) {
            $eventTypes[] = EventType::firstOrCreate([
                'name' => $type,
            ], [
                'slug' => Str::slug($type),
                'is_active' => true,
            ]);
        }

        // Check if we have locations
        $states = State::with('cities')->has('cities')->get();
        if ($states->isEmpty()) {
            $this->command->warn('No states or cities found. Skipping event seeding. Please run LocationSeeder first.');

            return;
        }

        // 2. Create Sample Events
        $faker = Factory::create();

        $events = [
            [
                'title' => 'Annual Golden Retriever Championship',
                'description' => 'Join us for the most awaited Golden Retriever show of the year. Featuring agility courses, obedience trials, and conformation judging.',
                'event_type_id' => $eventTypes[0]->id, // Dog Show
                'start_date' => Carbon::now()->addDays(15),
                'end_date' => Carbon::now()->addDays(16),
                'start_time' => '09:00',
                'venue_name' => 'Royal Canine Arena',
                'address' => 'Plot 42, Exhibition Grounds',
                'organizer_name' => 'Kennel Club of India',
                'contact_phone' => '+91 9876543210',
                'contact_email' => 'events@kci.org',
                'is_featured' => true,
            ],
            [
                'title' => 'Mega Indie Dog Adoption Drive',
                'description' => 'Give a loving home to our beautiful rescued Indian pariah dogs. Over 50 fully vaccinated and friendly pups waiting for their forever families.',
                'event_type_id' => $eventTypes[1]->id, // Adoption Camp
                'start_date' => Carbon::now()->addDays(5),
                'end_date' => null,
                'start_time' => '10:00',
                'venue_name' => 'City Central Park',
                'address' => 'Near Gate 3, Central Park',
                'organizer_name' => 'Pawsome Rescue Foundation',
                'contact_phone' => '+91 9876500001',
                'contact_email' => 'adopt@pawsomerescue.org',
                'is_featured' => true,
            ],
            [
                'title' => 'Puppy Socialization Masterclass',
                'description' => 'A hands-on workshop for new pet parents to understand puppy behavior, basic commands, and positive reinforcement techniques.',
                'event_type_id' => $eventTypes[2]->id, // Training Workshop
                'start_date' => Carbon::now()->addDays(20),
                'end_date' => Carbon::now()->addDays(20),
                'start_time' => '16:00',
                'venue_name' => 'The Pet Hub',
                'address' => '12B, Community Center',
                'organizer_name' => 'Elite K9 Training',
                'contact_phone' => '+91 9998887776',
                'contact_email' => 'info@elitek9.com',
                'is_featured' => false,
            ],
            [
                'title' => 'Beagle Enthusiasts Weekly Meetup',
                'description' => 'A casual Sunday morning gathering for Beagle owners. Let the dogs play while you connect with fellow pet parents.',
                'event_type_id' => $eventTypes[3]->id, // Breed Meetup
                'start_date' => Carbon::now()->addDays(7),
                'end_date' => null,
                'start_time' => '07:30',
                'venue_name' => 'Bark Park',
                'address' => 'Sector 14 Dog Park',
                'organizer_name' => 'Beagle Buddies Club',
                'contact_phone' => null,
                'contact_email' => null,
                'is_featured' => false,
            ],
            [
                'title' => 'Paws for a Cause - 5K Charity Run',
                'description' => 'Run alongside your furry friend to raise funds for local animal shelters. All proceeds go towards emergency medical care for street dogs.',
                'event_type_id' => $eventTypes[4]->id, // Charity Run
                'start_date' => Carbon::now()->addDays(30),
                'end_date' => Carbon::now()->addDays(30),
                'start_time' => '06:00',
                'venue_name' => 'Marine Drive Promenade',
                'address' => 'Starting Point: Sea Link Entrance',
                'organizer_name' => 'Runners for Rescues',
                'contact_phone' => '+91 8887776665',
                'contact_email' => 'run@cause.org',
                'is_featured' => true,
            ],
        ];

        foreach ($events as $eventData) {
            $state = $states->random();
            $city = $state->cities->random();

            $eventData['state_id'] = $state->id;
            $eventData['city_id'] = $city->id;

            $eventData['slug'] = Str::slug($eventData['title']);
            $original = $eventData['slug'];
            $count = 1;
            while (Event::where('slug', $eventData['slug'])->exists()) {
                $eventData['slug'] = $original.'-'.$count++;
            }

            Event::create($eventData);
        }

        $this->command->info('Events and Event Types seeded successfully!');
    }
}
