<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;

class HomeController extends Controller
{
    public function index()
    {
        // New Products
        $newProducts = Product::with('images')
            ->latest('created_at')
            ->take(10)
            ->get();

        // Popular Products
        $popularProducts = Product::with('images')
            ->orderByDesc('views_count')
            ->take(10)
            ->get();

        // Top Selling Products
        $topSellingProducts = Product::with('images')
            ->orderByDesc('sales_count')
            ->take(10)
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Home data fetched successfully',

            'data' => [
                'new_products' => $newProducts,
                'popular_products' => $popularProducts,
                'top_selling_products' => $topSellingProducts,
            ]
        ], 200);
    }
}