<?php

use App\Models\Conversation;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('chat.{id}', function ($user, $id) {
    $conversation = Conversation::find($id);

    return $conversation && ($user->hasRole('admin') || $conversation->users->contains($user->id));
});

Broadcast::channel('App.Models.Admin.{id}', function ($admin, $id) {
    return (int) $admin->id === (int) $id;
});

/**
 * Shared channel for broadcasting unassigned ticket counts to all support agents.
 * Any authenticated support-role admin can subscribe to receive real-time updates
 * when tickets are claimed or returned to the queue.
 */
Broadcast::channel('support-ticket-queue', function ($admin) {
    return in_array($admin->role, [
        'support_manager', 'support_team_leader', 'support_agent', 'superadmin',
    ]) ? ['id' => $admin->id, 'name' => $admin->name] : false;
});

/**
 * Shared channel for broadcasting unassigned internal ticket counts to all
 * agent-role field agents. Any authenticated agent-role admin can subscribe
 * to receive real-time updates when internal tickets are created, claimed,
 * or transferred.
 */
Broadcast::channel('internal-ticket-queue', function ($admin) {
    return in_array($admin->role, [
        'state_head', 'district_head', 'area_manager', 'team_leader', 'field_agent', 'superadmin',
    ]) ? ['id' => $admin->id, 'name' => $admin->name] : false;
});
