<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LostPetAlertNotification extends Notification
{
    use Queueable;

    public $pet;

    /**
     * Create a new notification instance.
     */
    public function __construct($pet)
    {
        $this->pet = $pet;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
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
