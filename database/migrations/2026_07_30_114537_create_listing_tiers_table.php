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
        Schema::create('listing_tiers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('max_listings')->default(-1); // -1 for unlimited
            $table->decimal('price', 8, 2)->default(0);
            $table->timestamps();
        });

        // Insert default tiers
        DB::table('listing_tiers')->insert([
            ['name' => 'Free', 'max_listings' => 1, 'price' => 0, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Bronze', 'max_listings' => 5, 'price' => 0, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Silver', 'max_listings' => 15, 'price' => 0, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Unlimited', 'max_listings' => -1, 'price' => 0, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listing_tiers');
    }
};
