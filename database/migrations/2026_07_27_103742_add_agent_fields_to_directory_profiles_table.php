<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('directory_profiles', function (Blueprint $table) {
            $table->foreignId('agent_id')->nullable()->constrained('admins')->nullOnDelete();
            $table->timestamp('claimed_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('directory_profiles', function (Blueprint $table) {
            //
        });
    }
};
