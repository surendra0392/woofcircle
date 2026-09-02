<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pets', function (Blueprint $table) {
            $table->string('passport_number', 30)->nullable()->unique()->after('microchip_number');
        });

        // Generate passport numbers for existing pets
        $pets = DB::table('pets')->get();
        foreach ($pets as $pet) {
            $digits = str_pad((string) mt_rand(100000000000, 999999999999), 12, '0', STR_PAD_LEFT);
            // Format: WCTG 1578 5792 57985
            $formatted = 'WCTG ' . substr($digits, 0, 4) . ' ' . substr($digits, 4, 4) . ' ' . substr($digits, 8, 4);
            
            DB::table('pets')->where('id', $pet->id)->update([
                'passport_number' => $formatted,
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pets', function (Blueprint $table) {
            $table->dropColumn('passport_number');
        });
    }
};
