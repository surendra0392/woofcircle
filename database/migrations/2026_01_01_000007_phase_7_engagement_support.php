<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── Support Tickets ──
        Schema::create('support_tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('subject');
            $table->string('category');
            $table->enum('priority', ['low', 'medium', 'high', 'critical'])->default('low');
            $table->text('message');
            $table->enum('status', ['open', 'in_progress', 'resolved', 'closed'])->default('open');
            $table->string('attachment_path')->nullable();
            $table->timestamps();
        });

        Schema::create('support_ticket_replies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('support_ticket_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('admin_id')->nullable()->constrained('admins')->onDelete('set null');
            $table->text('message');
            $table->string('attachment_path')->nullable();
            $table->timestamps();
        });

        // ── Contact Messages ──
        Schema::create('contact_messages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('subject');
            $table->text('message');
            $table->enum('status', ['new', 'read', 'replied', 'archived'])->default('new');
            $table->timestamps();
        });

        // ── Saved Articles ──
        Schema::create('saved_articles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('article_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['user_id', 'article_id']);
        });

        // ── Saved Items ──
        Schema::create('saved_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('saved_item_id');
            $table->string('saved_item_type');
            $table->timestamps();
            $table->unique(['user_id', 'saved_item_id', 'saved_item_type'], 'saved_items_unique');
        });

        // ── Transfer Requests ──
        Schema::create('transfer_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('litter_id')->constrained('marketplace_listings')->onDelete('cascade');
            $table->foreignId('buyer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('breeder_id')->constrained('users')->onDelete('cascade');
            $table->string('pet_name');
            $table->string('gender');
            $table->date('date_of_birth')->nullable();
            $table->string('status')->default('pending_breeder');
            $table->json('logs')->nullable();
            $table->timestamps();
        });

        // ── Chat / Messaging ──
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
        });

        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->text('body')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });

        Schema::create('message_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('message_id')->constrained()->cascadeOnDelete();
            $table->string('file_path');
            $table->string('file_name');
            $table->string('mime_type');
            $table->integer('size');
            $table->timestamps();
        });

        Schema::create('conversation_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });

        // ── Training Sessions ──
        Schema::create('training_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pet_id')->constrained()->cascadeOnDelete();
            $table->foreignId('trainer_profile_id')->constrained('directory_profiles')->cascadeOnDelete();
            $table->string('session_type');
            $table->datetime('session_date');
            $table->text('notes')->nullable();
            $table->string('status')->default('pending');
            $table->timestamps();
        });

        // ── Boarding Reservations ──
        Schema::create('boarding_reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pet_id')->constrained()->cascadeOnDelete();
            $table->foreignId('boarding_profile_id')->constrained('directory_profiles')->cascadeOnDelete();
            $table->date('check_in_date');
            $table->date('check_out_date');
            $table->text('notes')->nullable();
            $table->string('status')->default('pending');
            $table->timestamps();
        });

        // ── Event Registrations ──
        Schema::create('event_registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('status', ['pending', 'confirmed', 'cancelled'])->default('confirmed');
            $table->text('notes')->nullable();
            $table->unique(['event_id', 'user_id']);
            $table->timestamps();
        });

        // ── Career Positions ──
        Schema::create('career_positions', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('department');
            $table->string('location');
            $table->string('type')->default('full-time');
            $table->text('description');
            $table->text('requirements')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // ── Career Applications ──
        Schema::create('career_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('career_position_id')->constrained('career_positions')->cascadeOnDelete();
            $table->string('full_name');
            $table->string('email');
            $table->string('phone');
            $table->text('cover_letter')->nullable();
            $table->string('resume_path');
            $table->integer('experience_years')->nullable();
            $table->string('current_company')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->string('portfolio_url')->nullable();
            $table->string('status')->default('pending');
            $table->text('admin_notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('career_applications');
        Schema::dropIfExists('career_positions');
        Schema::dropIfExists('event_registrations');
        Schema::dropIfExists('boarding_reservations');
        Schema::dropIfExists('training_sessions');
        Schema::dropIfExists('conversation_user');
        Schema::dropIfExists('message_attachments');
        Schema::dropIfExists('messages');
        Schema::dropIfExists('conversations');
        Schema::dropIfExists('transfer_requests');
        Schema::dropIfExists('saved_items');
        Schema::dropIfExists('saved_articles');
        Schema::dropIfExists('contact_messages');
        Schema::dropIfExists('support_ticket_replies');
        Schema::dropIfExists('support_tickets');
    }
};
