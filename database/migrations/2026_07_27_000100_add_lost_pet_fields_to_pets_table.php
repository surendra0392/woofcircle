<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pets', function (Blueprint $table) {
            $table->boolean('is_lost')->default(false)->after('adoption_count');
            $table->timestamp('lost_at')->nullable()->after('is_lost');
            $table->text('lost_description')->nullable()->after('lost_at');
            $table->string('lost_location')->nullable()->after('lost_description');
        });
    }

    public function down(): void
    {
        Schema::table('pets', function (Blueprint $table) {
            $table->dropColumn(['is_lost', 'lost_at', 'lost_description', 'lost_location']);
        });
    }
};
