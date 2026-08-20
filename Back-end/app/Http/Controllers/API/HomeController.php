<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;

class HomeController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Get Home Data
    |--------------------------------------------------------------------------
    */

    public function index()
    {
        /*
        |--------------------------------------------------------------------------
        | New Products
        |--------------------------------------------------------------------------
        */

        $newProducts = Product::with([
            'images',
            'variants',
        ])
            ->latest('created_at')
            ->take(10)
            ->get();


        /*
        |--------------------------------------------------------------------------
        | Popular Products
        |--------------------------------------------------------------------------
        |
        | Based on views_count
        |
        */

        $popularProducts = Product::with([
            'images',
            'variants',
        ])
            ->orderByDesc('views_count')
            ->take(10)
            ->get();


        /*
        |--------------------------------------------------------------------------
        | Top Selling Products
        |--------------------------------------------------------------------------
        |
        | Based on sales_count
        |
        */

        $topSellingProducts = Product::with([
            'images',
            'variants',
        ])
            ->orderByDesc('sales_count')
            ->take(10)
            ->get();


        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return response()->json([
            'success' => true,

            'message' => 'Home data fetched successfully',

            'data' => [

                'new_products' =>
                    $newProducts,

                'popular_products' =>
                    $popularProducts,

                'top_selling_products' =>
                    $topSellingProducts,
            ],
        ]);
    }
}