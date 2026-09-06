<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminProductController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | GET PRODUCTS
    |--------------------------------------------------------------------------
    */

    public function index(Request $request): JsonResponse
    {
        /*
        |--------------------------------------------------------------------------
        | PRODUCT QUERY
        |--------------------------------------------------------------------------
        */

        $query = Product::with([
            'images',
            'variants',
        ]);

        /*
        |--------------------------------------------------------------------------
        | SEARCH
        |--------------------------------------------------------------------------
        */

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('product_name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        /*
        |--------------------------------------------------------------------------
        | CATEGORY
        |--------------------------------------------------------------------------
        */

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        /*
        |--------------------------------------------------------------------------
        | STOCK FILTER
        |--------------------------------------------------------------------------
        */

        if ($request->filled('stock')) {

            switch ($request->stock) {

                case 'in_stock':
                    $query->where('stock', '>', 0);
                    break;

                case 'low_stock':
                    $query->whereBetween('stock', [1, 5]);
                    break;

                case 'out_of_stock':
                    $query->where('stock', '<=', 0);
                    break;
            }
        }

        /*
        |--------------------------------------------------------------------------
        | SORT
        |--------------------------------------------------------------------------
        */

        switch ($request->sort) {

            case 'oldest':
                $query->oldest();
                break;

            case 'price_low':
                $query->orderBy('price', 'asc');
                break;

            case 'price_high':
                $query->orderBy('price', 'desc');
                break;

            case 'popular':
                $query->orderByDesc('views_count');
                break;

            case 'sales':
                $query->orderByDesc('sales_count');
                break;

            default:
                $query->latest();
                break;
        }

        /*
        |--------------------------------------------------------------------------
        | PAGINATION
        |--------------------------------------------------------------------------
        */

        $perPage = $request->integer('per_page', 10);

        $products = $query
            ->paginate($perPage)
            ->withQueryString();

        /*
        |--------------------------------------------------------------------------
        | GLOBAL PRODUCT STATISTICS
        |--------------------------------------------------------------------------
        |
        | IMPORTANT:
        | এগুলো pagination-এর উপর নির্ভর করবে না।
        | পুরো products table থেকে calculate হবে।
        |
        */

        $totalProducts = Product::count();

        $inStockProducts = Product::where('stock', '>', 0)
            ->count();

        $outOfStockProducts = Product::where('stock', '<=', 0)
            ->count();

        $totalStock = Product::sum('stock');

        /*
        |--------------------------------------------------------------------------
        | RESPONSE
        |--------------------------------------------------------------------------
        */

        return response()->json([
            'success' => true,

            'message' => 'Admin products fetched successfully.',

            'data' => $products->items(),

            'pagination' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
                'from' => $products->firstItem(),
                'to' => $products->lastItem(),
            ],

            /*
            |--------------------------------------------------------------------------
            | GLOBAL STATISTICS
            |--------------------------------------------------------------------------
            */

            'statistics' => [
                'total_products' => $totalProducts,
                'in_stock_products' => $inStockProducts,
                'out_of_stock_products' => $outOfStockProducts,
                'total_stock' => $totalStock,
            ],
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | DELETE PRODUCT
    |--------------------------------------------------------------------------
    */

    public function destroy($id): JsonResponse
    {
        $product = Product::findOrFail($id);

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully.',
        ]);
    }
}