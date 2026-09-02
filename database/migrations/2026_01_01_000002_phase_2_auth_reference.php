<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── Admins ──
        Schema::create('admins', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('avatar')->nullable();
            $table->string('password');
            $table->string('role')->default('admin');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // ── States ──
        Schema::create('states', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('code')->nullable();
            $table->string('slug')->nullable()->unique();
            $table->timestamps();
        });

        // ── Cities ──
        Schema::create('cities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('state_id')->constrained('states')->restrictOnDelete();
            $table->string('name');
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('slug')->nullable();
            $table->timestamps();

            $table->unique(['name', 'state_id']);
        });

        // ── Breeds ──
        Schema::create('breeds', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->text('history')->nullable();
            $table->text('other_names')->nullable();
            $table->text('naming')->nullable();
            $table->text('variants')->nullable();
            $table->text('appearance')->nullable();
            $table->text('health')->nullable();
            $table->text('temperament')->nullable();
            $table->text('behavior')->nullable();
            $table->text('intelligence')->nullable();
            $table->text('use')->nullable();
            $table->string('origin')->nullable();
            $table->string('life_span')->nullable();
            $table->string('male_height')->nullable();
            $table->string('female_height')->nullable();
            $table->string('male_weight')->nullable();
            $table->string('female_weight')->nullable();
            $table->enum('size', ['small', 'medium', 'large']);
            $table->string('breed_group')->nullable();
            $table->string('coat_type')->nullable();
            $table->text('colors')->nullable();
            $table->string('energy_level')->nullable();
            $table->boolean('is_indian')->default(false);
            $table->string('image')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // ── Roles ──
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Seed default roles
        DB::table('roles')->insertOrIgnore([
            ['id' => 1, 'name' => 'User', 'slug' => 'user', 'description' => 'Standard user', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'name' => 'Breeder', 'slug' => 'breeder', 'description' => 'Registered breeder', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'name' => 'Vendor', 'slug' => 'vendor', 'description' => 'Product vendor', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // ── Settings ──
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('label');
            $table->text('value')->nullable();
            $table->string('type')->default('text');
            $table->string('group')->default('general');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
        Schema::dropIfExists('roles');
        Schema::dropIfExists('breeds');
        Schema::dropIfExists('cities');
        Schema::dropIfExists('states');
        Schema::dropIfExists('admins');
    }
};
