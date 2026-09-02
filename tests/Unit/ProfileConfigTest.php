<?php

use App\Support\ProfileConfig;

test('all returns config for all 6 profile types', function () {
    $configs = ProfileConfig::all();

    expect($configs)->toHaveKeys(['breeder', 'vet', 'trainer', 'boarding', 'welfare', 'pet-shop']);
    expect($configs)->toHaveCount(6);
});

test('each profile type has required configuration keys', function () {
    $configs = ProfileConfig::all();
    $requiredKeys = ['role', 'model', 'gallery_model', 'gallery_foreign_key', 'name_field', 'logo_path', 'gallery_path', 'validation', 'fillable_fields', 'with_relations'];

    foreach ($configs as $type => $config) {
        expect($config)->toHaveKeys($requiredKeys);
    }
});

test('each profile type has a unique role slug', function () {
    $configs = ProfileConfig::all();
    $roles = array_map(fn ($c) => $c['role'], $configs);

    expect($roles)->toHaveCount(6);
    expect(array_unique($roles))->toHaveCount(6);
});

test('each profile type has a valid model class that exists', function () {
    $configs = ProfileConfig::all();

    foreach ($configs as $type => $config) {
        expect(class_exists($config['model']))->toBeTrue("{$type} model class {$config['model']} does not exist");
        expect(class_exists($config['gallery_model']))->toBeTrue("{$type} gallery model class {$config['gallery_model']} does not exist");
    }
});

test('get returns config for known type', function () {
    $config = ProfileConfig::get('breeder');

    expect($config)->toBeArray();
    expect($config['role'])->toBe('breeder');
    expect($config['name_field'])->toBe('name');
});

test('get returns null for unknown type', function () {
    expect(ProfileConfig::get('unknown-type'))->toBeNull();
});

test('isValid returns true for known types', function () {
    expect(ProfileConfig::isValid('breeder'))->toBeTrue();
    expect(ProfileConfig::isValid('vet'))->toBeTrue();
    expect(ProfileConfig::isValid('trainer'))->toBeTrue();
    expect(ProfileConfig::isValid('boarding'))->toBeTrue();
    expect(ProfileConfig::isValid('welfare'))->toBeTrue();
    expect(ProfileConfig::isValid('pet-shop'))->toBeTrue();
});

test('isValid returns false for unknown types', function () {
    expect(ProfileConfig::isValid('unknown'))->toBeFalse();
    expect(ProfileConfig::isValid(''))->toBeFalse();
});

test('breeder config has verification enabled', function () {
    $config = ProfileConfig::get('breeder');

    expect($config['has_verified'])->toBeTrue();
});

test('non-breeder configs do not have verification enabled', function () {
    foreach (['vet', 'trainer', 'boarding', 'welfare', 'pet-shop'] as $type) {
        $config = ProfileConfig::get($type);
        expect($config['has_verified'])->toBeFalse("{$type} should not have verification enabled");
    }
});

test('vet config has extra_data for services', function () {
    $config = ProfileConfig::get('vet');

    expect($config['extra_data'])->toBe('services');
    expect($config['extra_data_model'])->toBe(\App\Models\VetService::class);
});

test('trainer config has extra_data for specializations', function () {
    $config = ProfileConfig::get('trainer');

    expect($config['extra_data'])->toBe('specializations');
    expect($config['extra_data_model'])->toBe(\App\Models\TrainerSpecialization::class);
});

test('breeder, boarding, welfare, pet-shop configs have no extra_data', function () {
    foreach (['breeder', 'boarding', 'welfare', 'pet-shop'] as $type) {
        $config = ProfileConfig::get($type);
        expect($config['extra_data'])->toBeNull("{$type} should have no extra_data");
    }
});

test('all profile types have validation rules', function () {
    $configs = ProfileConfig::all();

    foreach ($configs as $type => $config) {
        expect($config['validation'])->toBeArray();
        expect($config['validation'])->not->toBeEmpty();
    }
});
