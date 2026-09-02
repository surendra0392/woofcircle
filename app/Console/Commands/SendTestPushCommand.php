<?php

namespace App\Console\Commands;

use App\Models\Setting;
use App\Models\User;
use App\Services\PushNotificationService;
use Illuminate\Console\Command;

class SendTestPushCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'push:test {userId? : The target user ID}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send a test Web/Mobile Push notification using OneSignal / Firebase settings from Admin';

    /**
     * Execute the console command.
     */
    public function handle(PushNotificationService $pushService): int
    {
        $userId = $this->argument('userId') ?? 1;

        $provider = Setting::get('push_provider', 'onesignal');
        $this->info("--- Push Notification Diagnostic ---");
        $this->info("Enabled: " . (Setting::get('push_enabled') ? 'YES' : 'NO (Disabled in Admin Settings)'));
        $this->info("Provider: " . strtoupper($provider));
        $this->info("OneSignal App ID: " . (Setting::get('onesignal_app_id') ?: 'Not configured'));

        if (!Setting::get('push_enabled')) {
            $this->warn("⚠️ Push notifications are currently Disabled in Admin Settings (/admin/settings). Please enable it and set credentials.");
            return Command::FAILURE;
        }

        $this->info("Dispatching test push notification for User #{$userId}...");

        $title = "WoofCircle Notification 🐾";
        $body = "This is a live test push notification from WoofCircle Sanctuary.";
        $url = config('app.url', 'https://woofcircle.in') . '/dashboard';

        $result = $pushService->sendToUser((int) $userId, $title, $body, $url);

        if ($result['success'] ?? false) {
            $this->info("✅ Push notification dispatched successfully!");
            $this->line(json_encode($result['data'], JSON_PRETTY_PRINT));
            return Command::SUCCESS;
        }

        $this->error("❌ Push Error: " . json_encode($result['error'] ?? $result['reason'] ?? 'Unknown error'));
        return Command::FAILURE;
    }
}
