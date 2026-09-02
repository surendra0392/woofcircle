<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\InternalTicket;
use App\Models\Payout;
use App\Models\SupportTicket;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CorporateHierarchySeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('password');

        // --- HR Hierarchy ---
        $hrDirector = Admin::updateOrCreate(['email' => 'hr.director@woofcircle.com'], [
            'name' => 'HR Director',
            'password' => $password,
            'role' => 'hr_director',
            'is_active' => true,
        ]);

        $hrManager = Admin::updateOrCreate(['email' => 'hr.manager@woofcircle.com'], [
            'name' => 'HR Manager',
            'password' => $password,
            'role' => 'hr_manager',
            'manager_id' => $hrDirector->id,
            'is_active' => true,
        ]);

        $hrExecutive = Admin::updateOrCreate(['email' => 'hr.executive@woofcircle.com'], [
            'name' => 'HR Executive',
            'password' => $password,
            'role' => 'hr_executive',
            'manager_id' => $hrManager->id,
            'is_active' => true,
        ]);

        // --- Support Hierarchy ---
        $supportManager = Admin::updateOrCreate(['email' => 'support.manager@woofcircle.com'], [
            'name' => 'Support Manager',
            'password' => $password,
            'role' => 'support_manager',
            'is_active' => true,
        ]);

        $supportTL = Admin::updateOrCreate(['email' => 'support.tl@woofcircle.com'], [
            'name' => 'Support Team Leader',
            'password' => $password,
            'role' => 'support_team_leader',
            'manager_id' => $supportManager->id,
            'is_active' => true,
        ]);

        $supportAgent = Admin::updateOrCreate(['email' => 'support.agent@woofcircle.com'], [
            'name' => 'Support Agent',
            'password' => $password,
            'role' => 'support_agent',
            'manager_id' => $supportTL->id,
            'is_active' => true,
        ]);

        // --- Field Sales Hierarchy ---
        $stateHead = Admin::updateOrCreate(['email' => 'sales.state@woofcircle.com'], [
            'name' => 'State Head (Sales)',
            'password' => $password,
            'role' => 'state_head',
            'is_active' => true,
        ]);

        $districtHead = Admin::updateOrCreate(['email' => 'sales.district@woofcircle.com'], [
            'name' => 'District Head (Sales)',
            'password' => $password,
            'role' => 'district_head',
            'manager_id' => $stateHead->id,
            'is_active' => true,
        ]);

        $areaManager = Admin::updateOrCreate(['email' => 'sales.area@woofcircle.com'], [
            'name' => 'Area Manager (Sales)',
            'password' => $password,
            'role' => 'area_manager',
            'manager_id' => $districtHead->id,
            'is_active' => true,
        ]);

        $teamLeader = Admin::updateOrCreate(['email' => 'sales.tl@woofcircle.com'], [
            'name' => 'Team Leader (Sales)',
            'password' => $password,
            'role' => 'team_leader',
            'manager_id' => $areaManager->id,
            'is_active' => true,
        ]);

        $fieldAgent = Admin::updateOrCreate(['email' => 'sales.agent@woofcircle.com'], [
            'name' => 'Field Agent',
            'password' => $password,
            'role' => 'field_agent',
            'manager_id' => $teamLeader->id,
            'is_active' => true,
        ]);

        // --- Dummy Data generation ---
        
        // 1. Create an internal ticket from field agent to HR
        InternalTicket::create([
            'admin_id' => $fieldAgent->id,
            'assigned_to' => $hrExecutive->id,
            'subject' => 'Need updated marketing flyers',
            'priority' => 'low',
            'status' => 'open',
            'message' => 'Hi HR, I am running out of flyers for new shops.',
        ]);

        // 2. Create an external Support Ticket for the Support Agent
        $user = User::first() ?? User::factory()->create();
        SupportTicket::create([
            'user_id' => $user->id,
            'assigned_to' => $supportAgent->id,
            'subject' => 'Issue claiming my vet profile',
            'category' => 'general',
            'priority' => 'medium',
            'message' => 'I tried claiming but it says error. Help.',
            'status' => 'open',
        ]);

        // 3. Create a Payout by HR for the Field Agent
        Payout::create([
            'admin_id' => $fieldAgent->id,
            'amount' => 500.00,
            'type' => 'commission',
            'status' => 'pending',
            'period_start' => now()->startOfMonth(),
            'period_end' => now()->endOfMonth(),
        ]);
    }
}
