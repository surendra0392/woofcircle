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
        Schema::table('pets', function (Blueprint $table) {
            if (!Schema::hasColumn('pets', 'transfer_count')) {
                $table->unsignedInteger('transfer_count')->default(1)->after('is_champion');
            }
            if (!Schema::hasColumn('pets', 'sale_count')) {
                $table->unsignedInteger('sale_count')->default(1)->after('transfer_count');
            }
            if (!Schema::hasColumn('pets', 'adoption_count')) {
                $table->unsignedInteger('adoption_count')->default(0)->after('sale_count');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pets', function (Blueprint $table) {
            $table->dropColumn(['transfer_count', 'sale_count', 'adoption_count']);
        });
    }
};
