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
        Schema::table('users', function (Blueprint $table) {
            $table->integer('current_login_streak')->default(0)->after('karma_points');
            $table->integer('highest_login_streak')->default(0)->after('current_login_streak');
            $table->date('last_login_date')->nullable()->after('highest_login_streak');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['current_login_streak', 'highest_login_streak', 'last_login_date']);
        });
    }
};
