<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Order;
use App\Models\User;
use App\Models\Review;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        /*
        |--------------------------------------------------------------------------
        | BASIC STATISTICS
        |--------------------------------------------------------------------------
        */

        $totalProducts = Product::count();

        $totalUsers = User::count();

        $totalReviews = Review::count();

        $totalOrders = Order::count();


        /*
        |--------------------------------------------------------------------------
        | PRODUCT STATISTICS
        |--------------------------------------------------------------------------
        */

        $lowStockProducts = Product::where('stock', '>', 0)
            ->where('stock', '<=', 5)
            ->count();

        $outOfStockProducts = Product::where('stock', 0)
            ->count();


        /*
        |--------------------------------------------------------------------------
        | ORDER STATISTICS
        |--------------------------------------------------------------------------
        |
        | These assume your orders table has a "status" column.
        |
        */

        $pendingOrders = Order::where('status', 'pending')->count();

        $completedOrders = Order::where('status', 'completed')->count();

        $cancelledOrders = Order::where('status', 'cancelled')->count();


        /*
        |--------------------------------------------------------------------------
        | RECENT ORDERS
        |--------------------------------------------------------------------------
        */

        $recentOrders = Order::with('user')
            ->latest()
            ->take(5)
            ->get();


        /*
        |--------------------------------------------------------------------------
        | RESPONSE
        |--------------------------------------------------------------------------
        */

        return response()->json([
            'success' => true,

            'data' => [

                'statistics' => [

                    'total_products' => $totalProducts,

                    'total_users' => $totalUsers,

                    'total_reviews' => $totalReviews,

                    'total_orders' => $totalOrders,

                    'pending_orders' => $pendingOrders,

                    'completed_orders' => $completedOrders,

                    'cancelled_orders' => $cancelledOrders,

                    'low_stock_products' => $lowStockProducts,

                    'out_of_stock_products' => $outOfStockProducts,

                ],

                'recent_orders' => $recentOrders,

            ],
        ]);
    }
}

