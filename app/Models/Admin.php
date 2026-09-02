<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class Admin extends Authenticatable
{
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'role',
        'is_active',
        'state_id',
        'city_id',
    ];

    protected $hidden = [
        'password',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === 'superadmin';
    }

    public function hasRole(string $role): bool
    {
        return $this->role === $role || $this->isSuperAdmin();
    }

    public function onboardedProfiles()
    {
        return $this->hasMany(DirectoryProfile::class, 'agent_id');
    }

    public function adPlacements()
    {
        return $this->hasMany(AdPlacement::class, 'agent_id');
    }

    public function manager()
    {
        return $this->belongsTo(Admin::class, 'manager_id');
    }

    public function subordinates()
    {
        return $this->hasMany(Admin::class, 'manager_id');
    }

    public function allSubordinates()
    {
        $all = new \Illuminate\Database\Eloquent\Collection();
        $subordinates = $this->subordinates()->get();

        foreach ($subordinates as $sub) {
            $all->push($sub);
            $all = $all->merge($sub->allSubordinates());
        }

        return $all;
    }

    public function payouts()
    {
        return $this->hasMany(Payout::class);
    }

    public function resolvedInternalTickets()
    {
        return $this->hasMany(InternalTicket::class, 'assigned_to')->where('status', 'closed');
    }

    public function resolvedSupportTickets()
    {
        return $this->hasMany(SupportTicket::class, 'assigned_to')->where('status', 'closed');
    }

    public function state()
    {
        return $this->belongsTo(State::class);
    }

    public function documents()
    {
        return $this->hasMany(EmployeeDocument::class);
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }
}
