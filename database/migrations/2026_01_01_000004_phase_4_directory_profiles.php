<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── Consolidated Directory Profiles ──
        Schema::create('directory_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('type'); // breeder, vet, trainer, boarding, welfare, pet_shop
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('phone');
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            $table->integer('experience_years')->nullable();
            $table->enum('service_type', ['boarding', 'daycare', 'both'])->nullable();
            $table->decimal('price_per_day', 10, 2)->nullable();
            $table->integer('capacity')->nullable();
            $table->foreignId('state_id')->constrained()->restrictOnDelete();
            $table->foreignId('city_id')->constrained()->restrictOnDelete();
            $table->string('address');
            $table->string('logo')->nullable();
            $table->string('facebook_url')->nullable();
            $table->string('instagram_url')->nullable();
            $table->string('twitter_url')->nullable();
            $table->string('youtube_url')->nullable();
            $table->boolean('is_verified')->default(true);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('profile_galleries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('directory_profile_id')->constrained('directory_profiles')->cascadeOnDelete();
            $table->string('image');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // Retain specialized pivot tables if needed, or drop them
        Schema::create('vet_services', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('profile_service', function (Blueprint $table) {
            $table->id();
            $table->foreignId('directory_profile_id')->constrained('directory_profiles')->cascadeOnDelete();
            $table->foreignId('vet_service_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profile_service');
        Schema::dropIfExists('vet_services');
        Schema::dropIfExists('profile_galleries');
        Schema::dropIfExists('directory_profiles');
    }
};
