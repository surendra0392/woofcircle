<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // General
            [
                'key' => 'site_name',
                'label' => 'Site Name',
                'value' => 'WoofCircle',
                'type' => 'text',
                'group' => 'general',
            ],
            [
                'key' => 'site_description',
                'label' => 'Site Description',
                'value' => 'The quintessential canine ecosystem for discerning pet patrons, ethical breeders, and certified specialists. Elevating companion care through verified pedigree lineage, digital QR identity passports, master training networks, bespoke boarding retreats, and comprehensive veterinary healthcare across India.',
                'type' => 'textarea',
                'group' => 'general',
            ],
            [
                'key' => 'site_logo',
                'label' => 'Site Logo URL',
                'value' => '/images/logo.png',
                'type' => 'image',
                'group' => 'general',
            ],
            [
                'key' => 'site_favicon',
                'label' => 'Site Favicon',
                'value' => '/images/favicon.png',
                'type' => 'image',
                'group' => 'general',
            ],
            [
                'key' => 'site_logo_icon',
                'label' => 'Site Logo Icon',
                'value' => '/images/logo-icon.png',
                'type' => 'image',
                'group' => 'general',
            ],
            [
                'key' => 'site_logo_text',
                'label' => 'Site Logo Text',
                'value' => '/images/logo-text.png',
                'type' => 'image',
                'group' => 'general',
            ],
            [
                'key' => 'site_footer_logo',
                'label' => 'Site Footer Logo (Stacked)',
                'value' => '/images/logo-stacked.png',
                'type' => 'image',
                'group' => 'general',
            ],

            // Contact
            [
                'key' => 'contact_email',
                'label' => 'Contact Email',
                'value' => 'hello@woofcircle.in',
                'type' => 'email',
                'group' => 'contact',
            ],
            [
                'key' => 'contact_phone',
                'label' => 'Contact Phone',
                'value' => '+1 (555) 000-0000',
                'type' => 'text',
                'group' => 'contact',
            ],
            [
                'key' => 'contact_address',
                'label' => 'Physical Address',
                'value' => '123 Puppy Lane, Dogtown, CA 90210',
                'type' => 'textarea',
                'group' => 'contact',
            ],
            [
                'key' => 'contact_hours',
                'label' => 'Contact Hours',
                'value' => 'Mon - Sat: 9am - 6pm',
                'type' => 'text',
                'group' => 'contact',
            ],

            // Social
            [
                'key' => 'social_facebook',
                'label' => 'Facebook URL',
                'value' => 'https://facebook.com/woofcircle',
                'type' => 'text',
                'group' => 'social',
            ],
            [
                'key' => 'social_instagram',
                'label' => 'Instagram URL',
                'value' => 'https://instagram.com/woofcircle',
                'type' => 'text',
                'group' => 'social',
            ],
            [
                'key' => 'social_twitter',
                'label' => 'Twitter/X URL',
                'value' => 'https://twitter.com/woofcircle',
                'type' => 'text',
                'group' => 'social',
            ],

            // SEO
            [
                'key' => 'seo_meta_title',
                'label' => 'Global Meta Title',
                'value' => 'WoofCircle | Find Your Perfect Companion',
                'type' => 'text',
                'group' => 'seo',
            ],
            [
                'key' => 'seo_meta_description',
                'label' => 'Global Meta Description',
                'value' => 'Connect with registered breeders and verified pet service providers on WoofCircle.',
                'type' => 'textarea',
                'group' => 'seo',
            ],
            [
                'key' => 'seo_keywords',
                'label' => 'Global Keywords',
                'value' => 'dogs, breeds, breeders, puppies, vets, trainers, boarding, welfare',
                'type' => 'text',
                'group' => 'seo',
            ],
            
            // Payments - Razorpay Gateway
            [
                'key' => 'razorpay_key_id',
                'label' => 'Razorpay Key ID',
                'value' => '',
                'type' => 'text',
                'group' => 'payment',
            ],
            [
                'key' => 'razorpay_key_secret',
                'label' => 'Razorpay Key Secret',
                'value' => '',
                'type' => 'text',
                'group' => 'payment',
            ],
            [
                'key' => 'razorpay_webhook_secret',
                'label' => 'Razorpay Webhook Secret',
                'value' => '',
                'type' => 'text',
                'group' => 'payment',
            ],
            [
                'key' => 'razorpay_active',
                'label' => 'Enable Razorpay Gateway',
                'value' => '0',
                'type' => 'boolean',
                'group' => 'payment',
            ],

            // Pricing Models
            [
                'key' => 'pricing_premium_monthly',
                'label' => 'Premium Tier Price (Monthly)',
                'value' => '999',
                'type' => 'text',
                'group' => 'pricing',
            ],
            [
                'key' => 'pricing_premium_yearly',
                'label' => 'Premium Tier Price (Yearly)',
                'value' => '9999',
                'type' => 'text',
                'group' => 'pricing',
            ],
            [
                'key' => 'pricing_elite_monthly',
                'label' => 'Elite Tier Price (Monthly)',
                'value' => '2499',
                'type' => 'text',
                'group' => 'pricing',
            ],
            [
                'key' => 'pricing_elite_yearly',
                'label' => 'Elite Tier Price (Yearly)',
                'value' => '24999',
                'type' => 'text',
                'group' => 'pricing',
            ],

            // WhatsApp Business API (Meta Cloud API)
            [
                'key' => 'whatsapp_enabled',
                'label' => 'Enable WhatsApp Notifications',
                'value' => '0',
                'type' => 'boolean',
                'group' => 'whatsapp',
            ],
            [
                'key' => 'whatsapp_phone_number_id',
                'label' => 'Meta Phone Number ID',
                'value' => '',
                'type' => 'text',
                'group' => 'whatsapp',
            ],
            [
                'key' => 'whatsapp_business_account_id',
                'label' => 'Meta WhatsApp Business Account ID (WABA ID)',
                'value' => '',
                'type' => 'text',
                'group' => 'whatsapp',
            ],
            [
                'key' => 'whatsapp_access_token',
                'label' => 'Meta Permanent Access Token',
                'value' => '',
                'type' => 'textarea',
                'group' => 'whatsapp',
            ],
            [
                'key' => 'whatsapp_sender_phone',
                'label' => 'Sender WhatsApp Phone Number (e.g. +91 9876543210)',
                'value' => '',
                'type' => 'text',
                'group' => 'whatsapp',
            ],

            // Push Notifications (OneSignal & Firebase)
            [
                'key' => 'push_enabled',
                'label' => 'Enable Push Notifications',
                'value' => '0',
                'type' => 'boolean',
                'group' => 'push_notifications',
            ],
            [
                'key' => 'push_provider',
                'label' => 'Push Service Provider (onesignal or firebase)',
                'value' => 'onesignal',
                'type' => 'text',
                'group' => 'push_notifications',
            ],
            [
                'key' => 'onesignal_app_id',
                'label' => 'OneSignal App ID',
                'value' => '',
                'type' => 'text',
                'group' => 'push_notifications',
            ],
            [
                'key' => 'onesignal_rest_api_key',
                'label' => 'OneSignal REST API Key',
                'value' => '',
                'type' => 'text',
                'group' => 'push_notifications',
            ],
            [
                'key' => 'firebase_project_id',
                'label' => 'Firebase Project ID',
                'value' => '',
                'type' => 'text',
                'group' => 'push_notifications',
            ],
            [
                'key' => 'firebase_server_key',
                'label' => 'Firebase Server Key / VAPID Key',
                'value' => '',
                'type' => 'textarea',
                'group' => 'push_notifications',
            ],

        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
