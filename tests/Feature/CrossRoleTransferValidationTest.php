<?php

use App\Models\Admin;
use App\Models\SupportTicket;
use App\Models\InternalTicket;
use App\Models\Payout;
use App\Models\DirectoryProfile;
use App\Models\User;
use App\Models\State;
use App\Models\City;

/**
 * These tests verify that every transfer/assign endpoint validates BOTH
 * hierarchy AND role — preventing the cross-role assignment bug where
 * a support ticket could be transferred to an HR executive who had no
 * workspace to process it.
 *
 * Each test follows the same pattern:
 *   1. Create an admin with role A (the "current" admin)
 *   2. Create an admin with role B (the "target" — different role)
 *   3. Set up hierarchy so the hierarchy check passes (target is manager)
 *   4. Create the entity to transfer
 *   5. Attempt the transfer → expect validation error
 */

// ──────────────────────────────────────────────
// Support Portal: Ticket Transfer
// ──────────────────────────────────────────────

beforeEach(function () {
    // Create a support-role admin as the current user
    $this->supportAdmin = Admin::create([
        'name' => 'Support Agent',
        'email' => 'support@test.com',
        'password' => bcrypt('password'),
        'role' => 'support_agent',
        'is_active' => true,
    ]);

    // Create a non-support admin who should NOT receive support tickets
    $this->hrAdmin = Admin::create([
        'name' => 'HR Executive',
        'email' => 'hr@test.com',
        'password' => bcrypt('password'),
        'role' => 'hr_executive',
        'is_active' => true,
        // Make them the support admin's manager so hierarchy check passes
        'manager_id' => null,
    ]);

    // Set up hierarchy: HR admin is the support admin's manager
    $this->supportAdmin->update(['manager_id' => $this->hrAdmin->id]);

    // Create an unassigned support ticket (external)
    $user = User::factory()->create();
    $this->ticket = SupportTicket::create([
        'user_id' => $user->id,
        'subject' => 'Test Ticket',
        'category' => 'general',
        'priority' => 'medium',
        'message' => 'Need help',
        'status' => 'open',
    ]);
});

test('support ticket transfer rejects cross-role assignment to HR admin', function () {
    $ticket = $this->ticket;

    // First claim the ticket so it's assigned to the support admin
    $ticket->update(['assigned_to' => $this->supportAdmin->id]);

    $this->actingAs($this->supportAdmin, 'admin')
        ->post(route('support.tickets.transfer', ['type' => 'external', 'id' => $ticket->id]), [
            'assigned_to' => $this->hrAdmin->id,
        ])
        ->assertSessionHasErrors('assigned_to');

    // Verify the ticket is still assigned to the original support admin
    $this->assertDatabaseHas('support_tickets', [
        'id' => $ticket->id,
        'assigned_to' => $this->supportAdmin->id,
    ]);
});

test('support ticket transfer rejects cross-role assignment to agent admin', function () {
    $ticket = $this->ticket;

    // Create an agent-role admin as the manager
    $agentAdmin = Admin::create([
        'name' => 'Field Agent',
        'email' => 'agent@test.com',
        'password' => bcrypt('password'),
        'role' => 'field_agent',
        'is_active' => true,
    ]);
    $this->supportAdmin->update(['manager_id' => $agentAdmin->id]);

    $ticket->update(['assigned_to' => $this->supportAdmin->id]);

    $this->actingAs($this->supportAdmin, 'admin')
        ->post(route('support.tickets.transfer', ['type' => 'external', 'id' => $ticket->id]), [
            'assigned_to' => $agentAdmin->id,
        ])
        ->assertSessionHasErrors('assigned_to');
});

// ──────────────────────────────────────────────
// Agent Portal: Internal Ticket Transfer
// ──────────────────────────────────────────────

beforeEach(function () {
    $this->agentAdmin = Admin::create([
        'name' => 'Field Agent',
        'email' => 'agent-portal@test.com',
        'password' => bcrypt('password'),
        'role' => 'field_agent',
        'is_active' => true,
    ]);

    $this->supportAdminForAgent = Admin::create([
        'name' => 'Support Staff',
        'email' => 'support-agent@test.com',
        'password' => bcrypt('password'),
        'role' => 'support_agent',
        'is_active' => true,
    ]);

    // Hierarchy: support admin is the agent admin's manager
    $this->agentAdmin->update(['manager_id' => $this->supportAdminForAgent->id]);

    $this->internalTicket = InternalTicket::create([
        'admin_id' => $this->agentAdmin->id,
        'subject' => 'Internal Issue',
        'priority' => 'medium',
        'message' => 'Team coordination required',
        'status' => 'open',
    ]);

    // Claim the ticket first
    $this->internalTicket->update(['assigned_to' => $this->agentAdmin->id]);
});

test('agent internal ticket transfer rejects cross-role assignment to support admin', function () {
    $this->actingAs($this->agentAdmin, 'admin')
        ->post(route('agent.support.transfer', $this->internalTicket->id), [
            'assigned_to' => $this->supportAdminForAgent->id,
        ])
        ->assertSessionHasErrors('assigned_to');

    $this->assertDatabaseHas('internal_tickets', [
        'id' => $this->internalTicket->id,
        'assigned_to' => $this->agentAdmin->id,
    ]);
});

test('agent internal ticket transfer rejects cross-role assignment to HR admin', function () {
    $hrAdmin = Admin::create([
        'name' => 'HR Manager',
        'email' => 'hr-manager@test.com',
        'password' => bcrypt('password'),
        'role' => 'hr_manager',
        'is_active' => true,
    ]);

    $this->agentAdmin->update(['manager_id' => $hrAdmin->id]);

    $this->actingAs($this->agentAdmin, 'admin')
        ->post(route('agent.support.transfer', $this->internalTicket->id), [
            'assigned_to' => $hrAdmin->id,
        ])
        ->assertSessionHasErrors('assigned_to');
});

// ──────────────────────────────────────────────
// Agent Portal: Profile Transfer
// ──────────────────────────────────────────────

beforeEach(function () {
    $this->fieldAgent = Admin::create([
        'name' => 'Field Agent',
        'email' => 'field-agent-profile@test.com',
        'password' => bcrypt('password'),
        'role' => 'field_agent',
        'is_active' => true,
    ]);

    $this->nonAgentAdmin = Admin::create([
        'name' => 'Support Staff',
        'email' => 'support-staff@test.com',
        'password' => bcrypt('password'),
        'role' => 'support_agent',
        'is_active' => true,
    ]);

    // Hierarchy: non-agent admin is the field agent's manager
    $this->fieldAgent->update(['manager_id' => $this->nonAgentAdmin->id]);

    // State and city are required for DirectoryProfile foreign keys
    $state = State::create([
        'name' => 'Test State',
        'code' => 'TS',
        'slug' => 'test-state-' . uniqid(),
    ]);
    $city = City::create([
        'name' => 'Test City',
        'state_id' => $state->id,
        'slug' => 'test-city-' . uniqid(),
        'latitude' => 0,
        'longitude' => 0,
    ]);

    // Create a DirectoryProfile tied to the field agent
    $profileUser = User::factory()->create();
    $this->profile = DirectoryProfile::create([
        'user_id' => $profileUser->id,
        'agent_id' => $this->fieldAgent->id,
        'type' => 'vet',
        'name' => 'Test Vet Clinic',
        'slug' => 'test-vet-clinic-' . uniqid(),
        'phone' => '1234567890',
        'address' => '123 Main St',
        'state_id' => $state->id,
        'city_id' => $city->id,
        'is_active' => true,
    ]);
});

test('agent profile transfer rejects cross-role assignment to support admin', function () {
    $this->actingAs($this->fieldAgent, 'admin')
        ->post(route('agent.profiles.transfer', $this->profile->id), [
            'agent_id' => $this->nonAgentAdmin->id,
        ])
        ->assertSessionHasErrors('agent_id');

    // Verify the profile is still assigned to the original agent
    $this->assertDatabaseHas('directory_profiles', [
        'id' => $this->profile->id,
        'agent_id' => $this->fieldAgent->id,
    ]);
});

test('agent profile transfer rejects cross-role assignment to HR admin', function () {
    $hrAdmin = Admin::create([
        'name' => 'HR Director',
        'email' => 'hr-director@test.com',
        'password' => bcrypt('password'),
        'role' => 'hr_director',
        'is_active' => true,
    ]);

    $this->fieldAgent->update(['manager_id' => $hrAdmin->id]);

    $this->actingAs($this->fieldAgent, 'admin')
        ->post(route('agent.profiles.transfer', $this->profile->id), [
            'agent_id' => $hrAdmin->id,
        ])
        ->assertSessionHasErrors('agent_id');
});

// ──────────────────────────────────────────────
// HR Portal: Payout Transfer
// ──────────────────────────────────────────────

beforeEach(function () {
    $this->hrAdminForPayout = Admin::create([
        'name' => 'HR Manager',
        'email' => 'hr-payout@test.com',
        'password' => bcrypt('password'),
        'role' => 'hr_manager',
        'is_active' => true,
    ]);

    $this->nonHrAdmin = Admin::create([
        'name' => 'Support Agent',
        'email' => 'support-payout@test.com',
        'password' => bcrypt('password'),
        'role' => 'support_agent',
        'is_active' => true,
    ]);

    // Hierarchy: support admin is the HR admin's manager
    $this->hrAdminForPayout->update(['manager_id' => $this->nonHrAdmin->id]);

    $this->payout = Payout::create([
        'admin_id' => $this->hrAdminForPayout->id,
        'amount' => 5000.00,
        'type' => 'salary',
        'period_start' => '2026-06-01',
        'period_end' => '2026-06-30',
        'status' => 'pending',
    ]);

    // Claim the payout first
    $this->payout->update(['assigned_to' => $this->hrAdminForPayout->id]);
});

test('payout transfer rejects cross-role assignment to support admin', function () {
    $this->actingAs($this->hrAdminForPayout, 'admin')
        ->post(route('hr.payouts.transfer', $this->payout->id), [
            'assigned_to' => $this->nonHrAdmin->id,
        ])
        ->assertSessionHasErrors('assigned_to');

    $this->assertDatabaseHas('payouts', [
        'id' => $this->payout->id,
        'assigned_to' => $this->hrAdminForPayout->id,
    ]);
});

test('payout transfer rejects cross-role assignment to agent admin', function () {
    $agentAdmin = Admin::create([
        'name' => 'Field Agent',
        'email' => 'agent-payout@test.com',
        'password' => bcrypt('password'),
        'role' => 'field_agent',
        'is_active' => true,
    ]);

    $this->hrAdminForPayout->update(['manager_id' => $agentAdmin->id]);

    $this->actingAs($this->hrAdminForPayout, 'admin')
        ->post(route('hr.payouts.transfer', $this->payout->id), [
            'assigned_to' => $agentAdmin->id,
        ])
        ->assertSessionHasErrors('assigned_to');
});

// ──────────────────────────────────────────────
// Positive: same-role transfers should succeed
// ──────────────────────────────────────────────

