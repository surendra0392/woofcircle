<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Agent Portal Roles
    |--------------------------------------------------------------------------
    |
    | ROLES that can access the Agent portal and receive profile transfers.
    | Referenced by CheckFieldAgent middleware, AgentDashboardController,
    | and InternalTicketController.
    |
    */
    'agent' => [
        'state_head',
        'district_head',
        'area_manager',
        'team_leader',
        'field_agent',
        'superadmin',
    ],

    /*
    |--------------------------------------------------------------------------
    | Support Portal Roles
    |--------------------------------------------------------------------------
    |
    | Roles that can access the Support portal and receive ticket transfers.
    | Referenced by CheckSupportAgent middleware and SupportTicketController.
    |
    */
    'support' => [
        'support_agent',
        'support_team_leader',
        'support_manager',
        'superadmin',
    ],

    /*
    |--------------------------------------------------------------------------
    | HR Portal Roles
    |--------------------------------------------------------------------------
    |
    | Roles that can access the HR portal, process payouts, and receive
    | escalated support tickets. Referenced by CheckHr middleware,
    | PayoutController, and SupportTicketController (for escalation).
    |
    */
    'hr' => [
        'hr_director',
        'hr_manager',
        'hr_executive',
        'superadmin',
    ],

    /*
    |--------------------------------------------------------------------------
    | General Admin Panel Roles
    |--------------------------------------------------------------------------
    |
    | Roles that can access the main admin console (not role-specific portals).
    | Referenced by CheckAdmin middleware.
    |
    */
    'support_management' => [
        'support_manager',
        'support_team_leader',
        'superadmin',
    ],

    /*
    |--------------------------------------------------------------------------
    | General Admin Panel Roles
    |--------------------------------------------------------------------------
    |
    | Roles that can access the main admin console (not role-specific portals).
    | Referenced by CheckAdmin middleware.
    |
    */
    'admin' => [
        'superadmin',
        'admin',
        'editor',
        'moderator',
        'viewer',
    ],
];
