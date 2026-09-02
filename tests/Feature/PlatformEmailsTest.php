<?php

namespace Tests\Feature;

use App\Mail\AdoptionCreatedMail;
use App\Mail\AppointmentBookedMail;
use App\Mail\CareerApplicationConfirmationMail;
use App\Mail\CareerApplicationReceivedMail;
use App\Mail\ContactMessageConfirmationMail;
use App\Mail\ContactMessageReceivedMail;
use App\Mail\LitterCreatedMail;
use App\Mail\NewsletterWelcomeMail;
use App\Mail\ProfileCreatedMail;
use App\Mail\StudServiceCreatedMail;
use App\Mail\SupportTicketCreatedMail;
use App\Mail\SupportTicketStaffAlertMail;
use App\Mail\TransferRequestNotificationMail;
use App\Mail\WelcomeUserMail;
use App\Models\Breed;
use App\Models\CareerPosition;
use App\Models\City;
use App\Models\Litter;
use App\Models\Role;
use App\Models\State;
use App\Models\User;
use App\Models\VetProfile;
use App\Models\Pet;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PlatformEmailsTest extends TestCase
{
    use RefreshDatabase;

    public function test_welcome_email_is_sent_on_registration(): void
    {
        Mail::fake();

        $role = Role::firstOrCreate(['slug' => 'pet-parent'], [
            'name' => 'Pet Parent',
            'is_active' => true,
        ]);

        $response = $this->post('/register', [
            'name' => 'Ananya Sharma',
            'email' => 'ananya@example.com',
            'mobile_number' => '9876543210',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'roles' => [$role->id],
        ]);

        $response->assertRedirect('/dashboard');
        Mail::assertQueued(WelcomeUserMail::class, function ($mail) {
            return $mail->hasTo('ananya@example.com');
        });
    }

    public function test_contact_emails_are_sent_on_contact_submission(): void
    {
        Mail::fake();

        $response = $this->post('/contact', [
            'name' => 'Rahul Verma',
            'email' => 'rahul@example.com',
            'subject' => 'Kennel Club Inquiry',
            'message' => 'I would like to inquire about breeder onboarding.',
        ]);

        $response->assertSessionHas('success');
        Mail::assertQueued(ContactMessageConfirmationMail::class, function ($mail) {
            return $mail->hasTo('rahul@example.com');
        });
        Mail::assertQueued(ContactMessageReceivedMail::class);
    }

    public function test_career_emails_are_sent_on_job_application(): void
    {
        Mail::fake();
        Storage::fake('public');

        $position = CareerPosition::create([
            'title' => 'Senior Veterinarian Consultant',
            'department' => 'Veterinary Services',
            'location' => 'Bengaluru, India',
            'employment_type' => 'full_time',
            'workplace_type' => 'on_site',
            'description' => 'Lead clinical audits and care programs.',
            'requirements' => 'BVSc / MVSc with 5+ years experience.',
            'is_active' => true,
        ]);

        $file = UploadedFile::fake()->create('resume.pdf', 500, 'application/pdf');

        $response = $this->post('/careers/apply', [
            'career_position_id' => $position->id,
            'full_name' => 'Dr. Vikram Patel',
            'email' => 'vikram@example.com',
            'phone' => '9123456780',
            'cover_letter' => 'Passionate about canine health.',
            'resume' => $file,
            'experience_years' => 7,
        ]);

        $response->assertSessionHas('success');
        Mail::assertQueued(CareerApplicationConfirmationMail::class, function ($mail) {
            return $mail->hasTo('vikram@example.com');
        });
        Mail::assertQueued(CareerApplicationReceivedMail::class);
    }

    public function test_support_ticket_emails_are_sent_on_creation(): void
    {
        Mail::fake();

        $user = User::factory()->create([
            'name' => 'Priya Nair',
            'email' => 'priya@example.com',
        ]);

        $response = $this->actingAs($user)->post('/help-center/tickets', [
            'subject' => 'Vaccination Record Sync Issue',
            'category' => 'technical',
            'priority' => 'high',
            'message' => 'My recent vaccination certificate is not rendering properly.',
        ]);

        $response->assertRedirect();
        Mail::assertQueued(SupportTicketCreatedMail::class, function ($mail) {
            return $mail->hasTo('priya@example.com');
        });
        Mail::assertQueued(SupportTicketStaffAlertMail::class);
    }

    public function test_newsletter_welcome_email_is_sent_to_new_subscribers(): void
    {
        Mail::fake();

        $response = $this->post('/newsletter/subscribe', [
            'email' => 'subscriber@example.com',
            'name' => 'Dog Lover',
        ]);

        $response->assertSessionHas('success');
        Mail::assertQueued(NewsletterWelcomeMail::class, function ($mail) {
            return $mail->hasTo('subscriber@example.com');
        });
    }

    public function test_puppy_transfer_request_sends_email_to_breeder(): void
    {
        Mail::fake();

        $breeder = User::factory()->create([
            'name' => 'Champion Kennels',
            'email' => 'breeder@example.com',
        ]);

        $buyer = User::factory()->create([
            'name' => 'Aditi Rao',
            'email' => 'aditi@example.com',
        ]);

        $state = State::create(['name' => 'Karnataka']);
        $city = City::create(['name' => 'Bengaluru', 'state_id' => $state->id]);
        $breed = Breed::create([
            'name' => 'Golden Retriever',
            'slug' => 'golden-retriever',
            'size' => 'large',
            'group' => 'Sporting',
        ]);

        $litter = Litter::create([
            'user_id' => $breeder->id,
            'breed_id' => $breed->id,
            'state_id' => $state->id,
            'city_id' => $city->id,
            'title' => 'Golden Retriever Show Quality Litter',
            'slug' => 'golden-retriever-show-litter',
            'description' => 'KCI registered purebred puppies.',
            'status' => 'published',
            'is_approved' => true,
            'is_available' => true,
        ]);

        $response = $this->actingAs($buyer)->post("/marketplace/puppies/{$litter->id}/request-transfer", [
            'pet_name' => 'Leo',
            'gender' => 'male',
        ]);

        $response->assertSessionHas('success');
        Mail::assertQueued(TransferRequestNotificationMail::class, function ($mail) {
            return $mail->hasTo('breeder@example.com');
        });
    }

    public function test_litter_creation_sends_email_to_breeder(): void
    {
        Mail::fake();

        $breederRole = Role::firstOrCreate(['slug' => 'breeder'], ['name' => 'Breeder', 'is_active' => true]);
        $user = User::factory()->create(['name' => 'Arjun Singh', 'email' => 'arjun@breeder.com']);
        $user->roles()->attach($breederRole->id);

        $state = State::create(['name' => 'Maharashtra']);
        $city = City::create(['name' => 'Mumbai', 'state_id' => $state->id]);
        $breed = Breed::create([
            'name' => 'German Shepherd',
            'slug' => 'german-shepherd',
            'size' => 'large',
            'group' => 'Working',
        ]);

        $response = $this->actingAs($user)->post('/dashboard/breeder/litters', [
            'title' => 'Top Quality GSD Litter',
            'description' => 'Healthy certified puppies ready for home.',
            'breed_id' => $breed->id,
            'price' => 35000,
            'state_id' => $state->id,
            'city_id' => $city->id,
            'status' => 'published',
        ]);

        $response->assertRedirect('/dashboard/breeder/litters');
        Mail::assertQueued(LitterCreatedMail::class, function ($mail) {
            return $mail->hasTo('arjun@breeder.com');
        });
    }

    public function test_stud_service_creation_sends_email_to_owner(): void
    {
        Mail::fake();

        $user = User::factory()->create(['name' => 'Rohan Gupta', 'email' => 'rohan@stud.com']);
        $state = State::create(['name' => 'Delhi']);
        $city = City::create(['name' => 'New Delhi', 'state_id' => $state->id]);
        $breed = Breed::create([
            'name' => 'Beagle',
            'slug' => 'beagle',
            'size' => 'medium',
            'group' => 'Hound',
        ]);

        $response = $this->actingAs($user)->post('/dashboard/stud-services', [
            'breed_id' => $breed->id,
            'stud_dog_name' => 'Max',
            'title' => 'Champion Lineage Beagle Stud',
            'description' => 'Proven pedigree with excellent temperaments.',
            'fee' => 15000,
            'state_id' => $state->id,
            'city_id' => $city->id,
        ]);

        $response->assertRedirect('/dashboard/stud-services');
        Mail::assertQueued(StudServiceCreatedMail::class, function ($mail) {
            return $mail->hasTo('rohan@stud.com');
        });
    }

    public function test_adoption_listing_creation_sends_email_to_poster(): void
    {
        Mail::fake();

        $user = User::factory()->create(['name' => 'Pooja Rescue', 'email' => 'pooja@rescue.org']);
        $state = State::create(['name' => 'Tamil Nadu']);
        $city = City::create(['name' => 'Chennai', 'state_id' => $state->id]);
        $breed = Breed::create([
            'name' => 'Indie',
            'slug' => 'indie',
            'size' => 'medium',
            'group' => 'Hound',
        ]);

        $response = $this->actingAs($user)->post('/dashboard/adoptions', [
            'breed_id' => $breed->id,
            'gender' => 'female',
            'title' => 'Gentle Indie Rescue Puppy Needs Forever Home',
            'description' => 'Vaccinated, playful and sweet.',
            'state_id' => $state->id,
            'city_id' => $city->id,
        ]);

        $response->assertRedirect('/dashboard/adoptions');
        Mail::assertQueued(AdoptionCreatedMail::class, function ($mail) {
            return $mail->hasTo('pooja@rescue.org');
        });
    }
}
