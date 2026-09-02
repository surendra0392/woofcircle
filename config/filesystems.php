<?php

return [

    // Default Filesystem Disk
    'default' => env('FILESYSTEM_DISK', 'local'),

    // Filesystem Disks (supported: "local", "ftp", "sftp", "s3")
    'disks' => [

        'local' => [
            'driver' => 'local',
            'root' => storage_path('app/private'),
            'serve' => true,
            'throw' => false,
        ],

        'public' => [
            'driver' => 'local',
            'root' => storage_path('app/public'),
            'url' => env('APP_URL').'/storage',
            'visibility' => 'public',
            'throw' => false,
        ],
        

    ],

    // Symbolic Links (for `storage:link` Artisan command)
    'links' => [
        public_path('storage') => storage_path('app/public'),
    ],

];
