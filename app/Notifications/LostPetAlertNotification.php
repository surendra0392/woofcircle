<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LostPetAlertNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public $pet)
    {
    }

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('🚨 URGENT: Lost Dog Alert Near You - ' . $this->pet->name)
            ->view('emails.lost_pet_alert', [
                'pet' => $this->pet,
                'owner' => $this->pet->user,
                'recipientName' => $notifiable->name ?? 'Community Member',
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'pet_id' => $this->pet->id,
            'message' => "RADAR ALERT: {$this->pet->name} is lost near your location!",
            'lat' => $this->pet->lost_lat,
            'lng' => $this->pet->lost_lng,
            'url' => route('lost-pets.index'),
            'type' => 'radar_alert',
        ];
    }
}
