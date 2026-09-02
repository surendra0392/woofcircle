<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── Consolidated Marketplace Listings ──
        Schema::create('marketplace_listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('profile_id')->nullable();
            $table->string('profile_type')->nullable();
            $table->foreignId('breed_id')->constrained('breeds')->onDelete('cascade');
            $table->string('type'); // litter, stud, adoption
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('featured_image_path')->nullable();
            $table->text('description');
            $table->decimal('price', 10, 2)->nullable();
            $table->decimal('price_min', 12, 2)->nullable();
            $table->decimal('price_max', 12, 2)->nullable();
            $table->string('age')->nullable();
            $table->string('gender')->nullable(); // mostly for adoptions
            $table->boolean('kci_registered')->default(false);
            $table->boolean('is_champion')->default(false);
            $table->integer('awards_count')->default(0);
            $table->string('sire_name')->nullable();
            $table->string('dam_name')->nullable();
            $table->string('stud_dog_name')->nullable();
            $table->foreignId('state_id')->constrained('states')->onDelete('cascade');
            $table->foreignId('city_id')->constrained('cities')->onDelete('cascade');
            $table->boolean('is_available')->default(true);
            $table->boolean('is_approved')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->integer('featured_position')->nullable();
            $table->timestamp('featured_until')->nullable();
            $table->string('status')->default('published');
            $table->boolean('is_negotiable')->default(false);
            $table->boolean('is_vaccinated')->default(false);
            $table->timestamps();
        });

        Schema::create('listing_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('marketplace_listing_id')->constrained('marketplace_listings')->onDelete('cascade');
            $table->string('image_path');
            $table->string('image_type')->default('gallery');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // ── Pets ──
        Schema::create('pets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('breed_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('gender');
            $table->date('date_of_birth')->nullable();
            $table->string('color')->nullable();
            $table->string('microchip_number')->nullable();
            $table->boolean('is_champion')->default(false);
            $table->integer('awards_count')->default(0);
            $table->string('profile_image_path')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // ── Vaccinations ──
        Schema::create('vaccinations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pet_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('vet_id')->nullable();
            $table->string('vaccine_name');
            $table->date('vaccination_date');
            $table->date('next_due_date')->nullable();
            $table->string('vet_name')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // ── Medical Records ──
        Schema::create('medical_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pet_id')->constrained()->onDelete('cascade');
            $table->string('record_type')->default('general');
            $table->string('title');
            $table->text('description')->nullable();
            $table->date('diagnosis_date')->nullable();
            $table->string('doctor_name')->nullable();
            $table->string('clinic_name')->nullable();
            $table->text('prescription')->nullable();
            $table->text('notes')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });

        // ── Appointments ──
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pet_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('vet_profile_id')->nullable();
            $table->string('appointment_type');
            $table->dateTime('appointment_date');
            $table->string('doctor_name')->nullable();
            $table->string('clinic_name')->nullable();
            $table->text('notes')->nullable();
            $table->string('status')->default('scheduled');
            $table->timestamps();
        });

        // ── Puppy Health Records ──
        Schema::create('puppy_health_records', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('litter_id')->nullable();
            $table->unsignedBigInteger('adoption_id')->nullable();
            $table->string('record_type');
            $table->string('title');
            $table->text('description')->nullable();
            $table->date('administered_date');
            $table->date('next_due_date')->nullable();
            $table->string('vet_name')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('puppy_health_records');
        Schema::dropIfExists('appointments');
        Schema::dropIfExists('medical_records');
        Schema::dropIfExists('vaccinations');
        Schema::dropIfExists('pets');
        Schema::dropIfExists('listing_images');
        Schema::dropIfExists('marketplace_listings');
    }
};
