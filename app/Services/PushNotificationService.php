<?php

namespace App\Services;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PushNotificationService
{
    /**
     * Check if Push notifications are enabled and configured.
     */
    public function isEnabled(): bool
    {
        if (!(bool) Setting::get('push_enabled', false)) {
            return false;
        }

        $provider = Setting::get('push_provider', 'onesignal');
        if ($provider === 'onesignal') {
            $appId = Setting::get('onesignal_app_id') ?: env('ONESIGNAL_APP_ID', '6d38b531-5245-432b-b902-b1171e1ce056');
            $apiKey = Setting::get('onesignal_rest_api_key') ?: env('ONESIGNAL_REST_API_KEY');
            return !empty($appId) && !empty($apiKey);
        }

        return !empty(Setting::get('firebase_server_key'));
    }

    /**
     * Send push notification to a specific user by their User ID.
     */
    public function sendToUser(int|User $user, string $title, string $message, ?string $url = null, array $data = []): array
    {
        if (!$this->isEnabled()) {
            return ['success' => false, 'skipped' => true, 'reason' => 'Push notifications disabled or API key missing'];
        }

        $userId = $user instanceof User ? $user->id : $user;
        $provider = Setting::get('push_provider', 'onesignal');

        if ($provider === 'onesignal') {
            return $this->sendOneSignal([
                'include_aliases' => [
                    'external_id' => [(string) $userId],
                ],
                'target_channel' => 'push',
                'include_external_user_ids' => [(string) $userId],
                'headings' => ['en' => $title],
                'contents' => ['en' => $message],
                'url' => $url ?? config('app.url', 'https://woofcircle.in'),
                'data' => array_merge(['user_id' => $userId], $data),
            ]);
        }

        return $this->sendFirebaseLegacy((string) $userId, $title, $message, $url, $data);
    }

    /**
     * Broadcast push notification to all subscribed users.
     */
    public function sendBroadcast(string $title, string $message, ?string $url = null, array $data = []): array
    {
        if (!$this->isEnabled()) {
            return ['success' => false, 'skipped' => true, 'reason' => 'Push notifications disabled'];
        }

        $provider = Setting::get('push_provider', 'onesignal');

        if ($provider === 'onesignal') {
            return $this->sendOneSignal([
                'included_segments' => ['Total Subscriptions', 'Active Subscriptions', 'Subscribed Users'],
                'headings' => ['en' => $title],
                'contents' => ['en' => $message],
                'url' => $url ?? config('app.url', 'https://woofcircle.in'),
                'data' => $data,
            ]);
        }

        return ['success' => false, 'reason' => 'Broadcast only supported via OneSignal currently'];
    }

    /**
     * Send geolocation-targeted push notification to users within a specific radius (e.g. Lost Dog Radar).
     */
    public function broadcastNearby(float $lat, float $lng, float $radiusKm, string $title, string $message, ?string $url = null, array $data = []): array
    {
        if (!$this->isEnabled()) {
            return ['success' => false, 'skipped' => true, 'reason' => 'Push notifications disabled'];
        }

        $radiusMeters = (int) ($radiusKm * 1000);
        $provider = Setting::get('push_provider', 'onesignal');

        if ($provider === 'onesignal') {
            return $this->sendOneSignal([
                'filters' => [
                    [
                        'field' => 'location',
                        'lat' => $lat,
                        'long' => $lng,
                        'radius' => $radiusMeters,
                    ],
                ],
                'headings' => ['en' => $title],
                'contents' => ['en' => $message],
                'url' => $url ?? config('app.url', 'https://woofcircle.in'),
                'data' => array_merge(['lat' => $lat, 'lng' => $lng, 'radius_km' => $radiusKm], $data),
            ]);
        }

        return ['success' => false, 'reason' => 'Geo-radius push only supported via OneSignal'];
    }

    /**
     * Internal: Dispatch OneSignal API request.
     */
    protected function sendOneSignal(array $payload): array
    {
        $appId = Setting::get('onesignal_app_id') ?: env('ONESIGNAL_APP_ID', '6d38b531-5245-432b-b902-b1171e1ce056');
        $apiKey = Setting::get('onesignal_rest_api_key') ?: env('ONESIGNAL_REST_API_KEY');

        $payload['app_id'] = $appId;

        if (isset($payload['data'])) {
            if (empty($payload['data'])) {
                unset($payload['data']);
            } else {
                $payload['data'] = (object) $payload['data'];
            }
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Basic ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(10)->post('https://onesignal.com/api/v1/notifications', $payload);

            if ($response->successful()) {
                Log::info('OneSignal Push Success: ' . json_encode($response->json()));
                return ['success' => true, 'data' => $response->json()];
            }

            Log::error('OneSignal Push Error: ' . $response->body());
            return ['success' => false, 'error' => $response->json() ?? $response->body()];
        } catch (\Throwable $e) {
            Log::error('OneSignal Push Exception: ' . $e->getMessage());
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Internal: Fallback Firebase Cloud Messaging request.
     */
    protected function sendFirebaseLegacy(string $topicOrToken, string $title, string $message, ?string $url = null, array $data = []): array
    {
        $serverKey = Setting::get('firebase_server_key');

        try {
            $response = Http::withHeaders([
                'Authorization' => 'key=' . $serverKey,
                'Content-Type' => 'application/json',
            ])->timeout(10)->post('https://fcm.googleapis.com/fcm/send', [
                'to' => $topicOrToken,
                'notification' => [
                    'title' => $title,
                    'body' => $message,
                    'click_action' => $url,
                ],
                'data' => $data,
            ]);

            return ['success' => $response->successful(), 'data' => $response->json()];
        } catch (\Throwable $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
}
