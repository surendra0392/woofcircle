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
        Schema::table('support_tickets', function (Blueprint $table) {
            $table->timestamp('escalated_to_hr_at')->nullable()->after('assigned_to');
            $table->timestamp('returned_to_queue_at')->nullable()->after('escalated_to_hr_at');
            $table->timestamp('last_transferred_at')->nullable()->after('returned_to_queue_at');
        });
    }

    public function down(): void
    {
        Schema::table('support_tickets', function (Blueprint $table) {
            $table->dropColumn(['escalated_to_hr_at', 'returned_to_queue_at', 'last_transferred_at']);
        });
    }
};
