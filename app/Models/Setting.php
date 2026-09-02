<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'type',
        'group'
    ];

    protected static function booted()
    {
        static::saved(function () {
            \Cache::forget('site_settings');
        });
        static::deleted(function () {
            \Cache::forget('site_settings');
        });
    }

    public static function get(string $key, $default = null)
    {
        $setting = self::where('key', $key)->first();
        if (!$setting) {
            return $default;
        }

        if ($setting->type === 'json') {
            return json_decode($setting->value, true);
        }

        if ($setting->type === 'boolean') {
            return (bool) $setting->value;
        }

        return $setting->value;
    }

    public static function set(string $key, $value, string $type = 'string', string $group = 'general')
    {
        if ($type === 'json' && (is_array($value) || is_object($value))) {
            $value = json_encode($value);
        }

        if ($type === 'boolean') {
            $value = $value ? '1' : '0';
        }

        return self::updateOrCreate(
            ['key' => $key],
            [
                'value' => $value,
                'type' => $type,
                'group' => $group
            ]
        );
    }
}
