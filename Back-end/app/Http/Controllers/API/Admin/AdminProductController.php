<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminProductController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | GET ADMIN PRODUCTS
    |--------------------------------------------------------------------------
    */

    public function index(Request $request)
    {
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
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%");

            });
        }


        /*
        |--------------------------------------------------------------------------
        | CATEGORY FILTER
        |--------------------------------------------------------------------------
        */

        if ($request->filled('category')) {

            $query->where(
                'category',
                $request->category
            );
        }


        /*
        |--------------------------------------------------------------------------
        | STOCK FILTER
        |--------------------------------------------------------------------------
        */

        if ($request->filled('stock')) {

            if ($request->stock === 'out_of_stock') {

                $query->where('stock', '<=', 0);

            } elseif ($request->stock === 'low_stock') {

                $query->where('stock', '>', 0)
                    ->where('stock', '<=', 5);

            } elseif ($request->stock === 'in_stock') {

                $query->where('stock', '>', 5);
            }
        }


        /*
        |--------------------------------------------------------------------------
        | SORTING
        |--------------------------------------------------------------------------
        |
        | Default = product name A-Z
        |
        */

        $sort = $request->get('sort', 'name_asc');

        switch ($sort) {

            /*
            |--------------------------------------------------------------
            | NAME A-Z
            |--------------------------------------------------------------
            */

            case 'name_asc':

                $query->orderBy('product_name', 'asc');

                break;


            /*
            |--------------------------------------------------------------
            | NAME Z-A
            |--------------------------------------------------------------
            */

            case 'name_desc':

                $query->orderBy('product_name', 'desc');

                break;


            /*
            |--------------------------------------------------------------
            | LATEST
            |--------------------------------------------------------------
            */

            case 'latest':

                $query->latest();

                break;


            /*
            |--------------------------------------------------------------
            | OLDEST
            |--------------------------------------------------------------
            */

            case 'oldest':

                $query->oldest();

                break;


            /*
            |--------------------------------------------------------------
            | PRICE LOW → HIGH
            |--------------------------------------------------------------
            */

            case 'price_low':

                $query->orderBy('price', 'asc');

                break;


            /*
            |--------------------------------------------------------------
            | PRICE HIGH → LOW
            |--------------------------------------------------------------
            */

            case 'price_high':

                $query->orderBy('price', 'desc');

                break;


            /*
            |--------------------------------------------------------------
            | MOST POPULAR
            |--------------------------------------------------------------
            */

            case 'popular':

                $query->orderByDesc('views_count');

                break;


            /*
            |--------------------------------------------------------------
            | TOP SELLING
            |--------------------------------------------------------------
            */

            case 'sales':

                $query->orderByDesc('sales_count');

                break;


            /*
            |--------------------------------------------------------------
            | DEFAULT
            |--------------------------------------------------------------
            */

            default:

                $query->orderBy('product_name', 'asc');

                break;
        }


        /*
        |--------------------------------------------------------------------------
        | PAGINATION
        |--------------------------------------------------------------------------
        */

        $perPage = $request->get('per_page', 10);

        $products = $query->paginate($perPage);


        /*
        |--------------------------------------------------------------------------
        | RESPONSE
        |--------------------------------------------------------------------------
        */

        return response()->json([
            'success' => true,

            'message' => 'Admin products fetched successfully.',

            'data' => $products,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | DELETE PRODUCT
    |--------------------------------------------------------------------------
    */

    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {

            return response()->json([
                'success' => false,
                'message' => 'Product not found.',
            ], 404);
        }


        DB::beginTransaction();

        try {

            /*
            |--------------------------------------------------------------------------
            | Delete product images
            |--------------------------------------------------------------------------
            */

            $product->images()->delete();


            /*
            |--------------------------------------------------------------------------
            | Delete product variants
            |--------------------------------------------------------------------------
            */

            $product->variants()->delete();


            /*
            |--------------------------------------------------------------------------
            | Delete product
            |--------------------------------------------------------------------------
            */

            $product->delete();


            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Product deleted successfully.',
            ]);

        } catch (\Throwable $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete product.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}