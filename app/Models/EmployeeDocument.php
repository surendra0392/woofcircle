<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmployeeDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'admin_id',
        'name',
        'file_path',
    ];

    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }
}
