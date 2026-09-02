<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Vaccination Reminder</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #212121; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; color: #c4a163; text-transform: uppercase; letter-spacing: 2px;">Woof Circle</h1>
    </div>
    
    <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
        <h2 style="color: #212121;">Health Reminder for {{ $petName }}</h2>
        
        <p>Hello,</p>
        <p>This is a friendly reminder that <strong>{{ $petName }}</strong> has an upcoming vaccination due soon.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-left: 4px solid #c4a163;">
            <p style="margin: 5px 0;"><strong>Vaccine:</strong> {{ $vaccineName }}</p>
            <p style="margin: 5px 0;"><strong>Due Date:</strong> {{ $dueDate }}</p>
            @if($vetName)
            <p style="margin: 5px 0;"><strong>Veterinarian:</strong> {{ $vetName }}</p>
            @endif
        </div>
        
        <p>Keeping your pet's vaccinations up to date is crucial for their health and well-being. Please schedule an appointment with your veterinarian if you haven't already.</p>
        
        <div style="text-align: center; margin-top: 30px;">
            <a href="{{ $dashboardUrl }}" style="background-color: #c4a163; color: #212121; text-decoration: none; padding: 12px 24px; font-weight: bold; display: inline-block; text-transform: uppercase; letter-spacing: 1px;">View Health Records</a>
        </div>
    </div>
    
    <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #777;">
        <p>&copy; {{ date('Y') }} Woof Circle. All rights reserved.</p>
    </div>
</body>
</html>
