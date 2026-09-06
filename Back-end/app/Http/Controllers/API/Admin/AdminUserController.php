<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AdminUserController extends Controller
{
    /**
     * Get all users for admin panel
     */
    public function index(): JsonResponse
    {
        $users = User::withCount('orders')
            ->withSum('orders', 'total')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Users fetched successfully.',
            'data' => $users,
        ]);
    }
}