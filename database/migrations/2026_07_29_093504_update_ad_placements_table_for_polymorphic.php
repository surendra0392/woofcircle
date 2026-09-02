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
        Schema::table('ad_placements', function (Blueprint $table) {
            // First drop the old foreign key and column
            $table->dropForeign(['directory_profile_id']);
            $table->dropColumn('directory_profile_id');

            // Add the new polymorphic relation
            $table->string('promotable_type')->after('id');
            $table->unsignedBigInteger('promotable_id')->after('promotable_type');
            $table->index(['promotable_type', 'promotable_id']);

            // Add duration
            $table->enum('duration', ['7d', '15d', '1m', '3m', '6m', '1y'])->default('1m')->after('amount_collected');

            // Add location targeting
            $table->foreignId('targeted_state_id')->nullable()->constrained('states')->nullOnDelete()->after('duration');
            $table->foreignId('targeted_city_id')->nullable()->constrained('cities')->nullOnDelete()->after('targeted_state_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
