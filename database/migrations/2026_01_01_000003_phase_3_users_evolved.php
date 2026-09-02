<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Evolve users table with full column set
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_active')->default(true);
            $table->foreignId('role_id')->default(1)->after('email')->constrained('roles')->onDelete('restrict');
            $table->string('mobile_number')->nullable()->after('email');
            $table->string('avatar')->nullable()->after('email');
            $table->timestamp('suspended_until')->nullable();
        });

        // Role-user pivot (many-to-many)
        Schema::create('role_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('role_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('role_user');
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
            $table->dropColumn(['role_id', 'mobile_number', 'avatar', 'is_active', 'suspended_until']);
        });
    }
};
