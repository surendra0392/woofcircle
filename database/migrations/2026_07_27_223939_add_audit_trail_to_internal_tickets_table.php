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
        Schema::table('internal_tickets', function (Blueprint $table) {
            $table->timestamp('escalated_at')->nullable()->after('assigned_to');
            $table->timestamp('returned_at')->nullable()->after('escalated_at');
            $table->timestamp('transferred_at')->nullable()->after('returned_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('internal_tickets', function (Blueprint $table) {
            $table->dropColumn(['escalated_at', 'returned_at', 'transferred_at']);
        });
    }
};
