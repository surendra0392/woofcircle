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
        if (Schema::hasTable('profile_views') && !Schema::hasColumn('profile_views', 'interaction_type')) {
            Schema::table('profile_views', function (Blueprint $table) {
                $table->string('interaction_type')->default('view')->after('ip_address');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('profile_views') && Schema::hasColumn('profile_views', 'interaction_type')) {
            Schema::table('profile_views', function (Blueprint $table) {
                $table->dropColumn('interaction_type');
            });
        }
    }
};
