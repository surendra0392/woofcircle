<?php

namespace App\Console\Commands;

use App\Models\Setting;
use App\Services\WhatsAppService;
use Illuminate\Console\Command;

class SendTestWhatsAppCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'whatsapp:test {phone? : The recipient phone number in international format}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send a test WhatsApp message using Meta Cloud API settings from Admin';

    /**
     * Execute the console command.
     */
    public function handle(WhatsAppService $whatsAppService): int
    {
        $phone = $this->argument('phone') ?? Setting::get('contact_phone', '919876543210');

        $this->info("--- Meta WhatsApp Cloud API Diagnostic ---");
        $this->info("Enabled: " . (Setting::get('whatsapp_enabled') ? 'YES' : 'NO (Disabled in Admin Settings)'));
        $this->info("Phone Number ID: " . (Setting::get('whatsapp_phone_number_id') ?: 'Not configured'));
        $this->info("Business Account ID: " . (Setting::get('whatsapp_business_account_id') ?: 'Not configured'));
        $this->info("Target Phone: {$phone}");

        if (!Setting::get('whatsapp_enabled')) {
            $this->warn("⚠️ WhatsApp is currently set to Disabled in Admin Settings (/admin/settings). Please enable it and set credentials.");
            return Command::FAILURE;
        }

        $this->info("Sending test WhatsApp message to: {$phone}...");

        $message = "🐾 *WoofCircle Test Notification*\n\nHello! Your Meta WhatsApp Cloud API is successfully connected to WoofCircle India.\n\nTime: " . now()->toDayDateTimeString();

        $result = $whatsAppService->sendTextMessage($phone, $message);

        if ($result['success']) {
            $this->info("✅ WhatsApp test message sent successfully!");
            $this->line(json_encode($result['data'], JSON_PRETTY_PRINT));
            return Command::SUCCESS;
        }

        $this->error("❌ WhatsApp Error: " . json_encode($result['error'] ?? $result['reason'] ?? 'Unknown error'));
        return Command::FAILURE;
    }
}
