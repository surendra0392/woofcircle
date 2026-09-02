<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Migrate existing internal notes from support_ticket_replies to internal_notes table
        $existing = DB::table('support_ticket_replies')
            ->where('is_internal_note', true)
            ->get();

        foreach ($existing as $note) {
            DB::table('internal_notes')->insert([
                'support_ticket_id' => $note->support_ticket_id,
                'admin_id' => $note->admin_id,
                'message' => $note->message,
                'created_at' => $note->created_at,
                'updated_at' => $note->updated_at,
            ]);
        }

        // Remove the internal notes from support_ticket_replies
        DB::table('support_ticket_replies')
            ->where('is_internal_note', true)
            ->delete();

        Schema::table('support_ticket_replies', function (Blueprint $table) {
            $table->dropColumn('is_internal_note');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('support_ticket_replies', function (Blueprint $table) {
            $table->boolean('is_internal_note')->default(false)->after('attachment_path');
        });

        // Migrate internal notes back to support_ticket_replies
        $notes = DB::table('internal_notes')->get();

        foreach ($notes as $note) {
            DB::table('support_ticket_replies')->insert([
                'support_ticket_id' => $note->support_ticket_id,
                'admin_id' => $note->admin_id,
                'message' => $note->message,
                'is_internal_note' => true,
                'created_at' => $note->created_at,
                'updated_at' => $note->updated_at,
            ]);
        }
    }
};
