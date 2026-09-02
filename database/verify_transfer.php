<?php

use App\Models\Pet;
use App\Models\User;

$user = User::where('email', 'demo_buyer@example.com')->first();
if (! $user) {
    echo "User not found\n";
    exit;
}

$pet = Pet::where('user_id', $user->id)->where('name', 'Demo Pup')->first();
if ($pet) {
    echo 'Pet Demo Pup found. ID: '.$pet->id."\n";
    $vaccines = $pet->vaccinations->count();
    $meds = $pet->medicalRecords->count();
    echo 'Vaccinations: '.$vaccines.', Medical Records: '.$meds."\n";
} else {
    echo "Pet Demo Pup NOT found.\n";
}
