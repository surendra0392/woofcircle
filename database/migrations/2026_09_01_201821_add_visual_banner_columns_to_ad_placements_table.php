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
            $table->string('promotable_type')->nullable()->change();
            $table->unsignedBigInteger('promotable_id')->nullable()->change();
            $table->string('placement_slot')->default('listing_boost')->after('tier');
            $table->string('title')->nullable()->after('placement_slot');
            $table->string('subtitle')->nullable()->after('title');
            $table->string('banner_image_path')->nullable()->after('subtitle');
            $table->string('target_url')->nullable()->after('banner_image_path');
            $table->string('cta_text')->nullable()->default('Learn More')->after('target_url');
            $table->unsignedBigInteger('impressions_count')->default(0)->after('status');
            $table->unsignedBigInteger('clicks_count')->default(0)->after('impressions_count');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ad_placements', function (Blueprint $table) {
            $table->dropColumn([
                'placement_slot',
                'title',
                'subtitle',
                'banner_image_path',
                'target_url',
                'cta_text',
                'impressions_count',
                'clicks_count',
            ]);
        });
    }
};
