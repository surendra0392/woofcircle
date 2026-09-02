<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ad_placements', function (Blueprint $table) {
            $table->dropForeign(['targeted_state_id']);
            $table->dropForeign(['targeted_city_id']);
            $table->dropColumn(['targeted_state_id', 'targeted_city_id']);
            $table->json('targeted_state_ids')->nullable();
            $table->json('targeted_city_ids')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ad_placements', function (Blueprint $table) {
            $table->dropColumn(['targeted_state_ids', 'targeted_city_ids']);
            $table->unsignedBigInteger('targeted_state_id')->nullable();
            $table->unsignedBigInteger('targeted_city_id')->nullable();
        });
    }
};
