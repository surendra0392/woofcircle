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
        Schema::create('ad_pricings', function (Blueprint $table) {
            $table->id();
            $table->string('tier');
            $table->string('duration');
            $table->decimal('price', 10, 2);
            $table->timestamps();
            
            // Ensure unique combination of tier and duration
            $table->unique(['tier', 'duration']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ad_pricings');
    }
};
