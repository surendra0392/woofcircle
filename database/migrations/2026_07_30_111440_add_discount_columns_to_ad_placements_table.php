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
            $table->decimal('discount_requested', 10, 2)->nullable()->after('amount_collected');
            $table->string('discount_reason')->nullable()->after('discount_requested');
            $table->enum('approval_status', ['none', 'pending', 'approved', 'rejected'])->default('none')->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ad_placements', function (Blueprint $table) {
            $table->dropColumn(['discount_requested', 'discount_reason', 'approval_status']);
        });
    }
};
