<?php

namespace App\Http\Controllers\Support;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\CannedResponse;

class CannedResponseController extends Controller
{
    public function index()
    {
        return response()->json(CannedResponse::all());
    }
}
