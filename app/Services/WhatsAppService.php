<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    /**
     * Check if WhatsApp integration is enabled and configured.
     */
    public function isEnabled(): bool
    {
        return (bool) Setting::get('whatsapp_enabled', false) &&
               !empty(Setting::get('whatsapp_phone_number_id')) &&
               !empty(Setting::get('whatsapp_access_token'));
    }

    /**
     * Format phone number to international E.164 without '+' or leading zeros.
     */
    public function formatPhoneNumber(string $phone): string
    {
        $clean = preg_replace('/\D/', '', $phone);

        // If 10 digits, default to India (+91)
        if (strlen($clean) === 10) {
            return '91' . $clean;
        }

        return $clean;
    }

    /**
     * Send a direct text message via Meta WhatsApp Cloud API.
     */
    public function sendTextMessage(string $phone, string $message): array
    {
        if (!$this->isEnabled()) {
            Log::info("WhatsAppService: Notifications disabled or unconfigured. Message skipped to {$phone}.");
            return ['success' => false, 'skipped' => true, 'reason' => 'WhatsApp disabled or unconfigured'];
        }

        $formattedPhone = $this->formatPhoneNumber($phone);
        if (empty($formattedPhone)) {
            return ['success' => false, 'reason' => 'Invalid phone number format'];
        }

        $phoneNumberId = Setting::get('whatsapp_phone_number_id');
        $accessToken = Setting::get('whatsapp_access_token');
        $url = "https://graph.facebook.com/v21.0/{$phoneNumberId}/messages";

        try {
            $response = Http::withToken($accessToken)
                ->timeout(10)
                ->post($url, [
                    'messaging_product' => 'whatsapp',
                    'recipient_type' => 'individual',
                    'to' => $formattedPhone,
                    'type' => 'text',
                    'text' => [
                        'preview_url' => true,
                        'body' => $message,
                    ],
                ]);

            if ($response->successful()) {
                Log::info("WhatsAppService: Message successfully dispatched to {$formattedPhone}.");
                return ['success' => true, 'data' => $response->json()];
            }

            Log::error("WhatsAppService Error response: " . $response->body());
            return ['success' => false, 'error' => $response->json() ?? $response->body()];
        } catch (\Throwable $e) {
            Log::error("WhatsAppService Exception: " . $e->getMessage());
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Send an approved template message via Meta WhatsApp Cloud API.
     */
    public function sendTemplateMessage(string $phone, string $templateName, array $parameters = [], string $language = 'en'): array
    {
        if (!$this->isEnabled()) {
            return ['success' => false, 'skipped' => true, 'reason' => 'WhatsApp disabled or unconfigured'];
        }

        $formattedPhone = $this->formatPhoneNumber($phone);
        $phoneNumberId = Setting::get('whatsapp_phone_number_id');
        $accessToken = Setting::get('whatsapp_access_token');
        $url = "https://graph.facebook.com/v21.0/{$phoneNumberId}/messages";

        $components = [];
        if (!empty($parameters)) {
            $bodyParams = [];
            foreach ($parameters as $param) {
                $bodyParams[] = ['type' => 'text', 'text' => (string) $param];
            }
            $components[] = [
                'type' => 'body',
                'parameters' => $bodyParams,
            ];
        }

        try {
            $payload = [
                'messaging_product' => 'whatsapp',
                'to' => $formattedPhone,
                'type' => 'template',
                'template' => [
                    'name' => $templateName,
                    'language' => ['code' => $language],
                ],
            ];

            if (!empty($components)) {
                $payload['template']['components'] = $components;
            }

            $response = Http::withToken($accessToken)
                ->timeout(10)
                ->post($url, $payload);

            if ($response->successful()) {
                return ['success' => true, 'data' => $response->json()];
            }

            Log::error("WhatsAppService Template Error: " . $response->body());
            return ['success' => false, 'error' => $response->json() ?? $response->body()];
        } catch (\Throwable $e) {
            Log::error("WhatsAppService Template Exception: " . $e->getMessage());
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
}
