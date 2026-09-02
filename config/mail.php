<?php

return [

    // Default Mailer
    'default' => env('MAIL_MAILER', 'smtp'),

    // Mailer Configurations (supported: "smtp", "sendmail", "mailgun", "ses", "ses-v2", "postmark", "resend", "log", "array", "failover", "roundrobin")
    'mailers' => [

        'smtp' => [
            'transport' => 'smtp',
            'url' => env('MAIL_URL'),
            'host' => env('MAIL_HOST', 'mail.woofcircle.in'),
            'port' => env('MAIL_PORT', 465),
            'encryption' => env('MAIL_ENCRYPTION', 'ssl'),
            'username' => env('MAIL_USERNAME', 'no-reply@woofcircle.in'),
            'password' => env('MAIL_PASSWORD'),
            'timeout' => null,
            'local_domain' => env('MAIL_EHLO_DOMAIN', parse_url(env('APP_URL', 'https://woofcircle.in'), PHP_URL_HOST)),
            'stream' => [
                'ssl' => [
                    'allow_self_signed' => true,
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                ],
            ],
        ],

        'support' => [
            'transport' => 'smtp',
            'host' => env('MAIL_HOST', 'mail.woofcircle.in'),
            'port' => env('MAIL_PORT', 465),
            'encryption' => env('MAIL_ENCRYPTION', 'ssl'),
            'username' => env('MAIL_SUPPORT_USERNAME', 'support@woofcircle.in'),
            'password' => env('MAIL_SUPPORT_PASSWORD', env('MAIL_PASSWORD')),
            'timeout' => null,
            'stream' => [
                'ssl' => [
                    'allow_self_signed' => true,
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                ],
            ],
        ],

        'info' => [
            'transport' => 'smtp',
            'host' => env('MAIL_HOST', 'mail.woofcircle.in'),
            'port' => env('MAIL_PORT', 465),
            'encryption' => env('MAIL_ENCRYPTION', 'ssl'),
            'username' => env('MAIL_INFO_USERNAME', 'info@woofcircle.in'),
            'password' => env('MAIL_INFO_PASSWORD', env('MAIL_PASSWORD')),
            'timeout' => null,
            'stream' => [
                'ssl' => [
                    'allow_self_signed' => true,
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                ],
            ],
        ],

        'hello' => [
            'transport' => 'smtp',
            'host' => env('MAIL_HOST', 'mail.woofcircle.in'),
            'port' => env('MAIL_PORT', 465),
            'encryption' => env('MAIL_ENCRYPTION', 'ssl'),
            'username' => env('MAIL_HELLO_USERNAME', 'hello@woofcircle.in'),
            'password' => env('MAIL_HELLO_PASSWORD', env('MAIL_PASSWORD')),
            'timeout' => null,
            'stream' => [
                'ssl' => [
                    'allow_self_signed' => true,
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                ],
            ],
        ],

        'log' => [
            'transport' => 'log',
            'channel' => env('MAIL_LOG_CHANNEL'),
        ],

        'array' => [
            'transport' => 'array',
        ],

        'failover' => [
            'transport' => 'failover',
            'mailers' => [
                'smtp',
                'log',
            ],
        ],

    ],

    // Global "From" Address
    'from' => [
        'address' => env('MAIL_FROM_ADDRESS', 'no-reply@woofcircle.in'),
        'name' => env('MAIL_FROM_NAME', 'WoofCircle'),
    ],

];
