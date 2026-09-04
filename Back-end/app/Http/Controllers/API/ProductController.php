<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Get All Products
    |--------------------------------------------------------------------------
    |
    | Pagination is used here so we don't fetch every product at once.
    |
    */

    public function index(Request $request)
    {
        $perPage = min(
            max((int) $request->input('per_page', 20), 1),
            50
        );

        $query = Product::with([
            'images',
            'variants',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Category Filter
        |--------------------------------------------------------------------------
        */

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        /*
        |--------------------------------------------------------------------------
        | Search
        |--------------------------------------------------------------------------
        */

        if ($request->filled('search')) {
            $search = trim($request->search);

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Sorting
        |--------------------------------------------------------------------------
        */

        switch ($request->input('sort')) {
            case 'price_low':
                $query->orderBy('price', 'asc');
                break;

            case 'price_high':
                $query->orderBy('price', 'desc');
                break;

            case 'popular':
                $query->orderByDesc('views_count');
                break;

            case 'selling':
                $query->orderByDesc('sales_count');
                break;

            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;

            case 'newest':
            default:
                $query->latest('created_at');
                break;
        }

        /*
        |--------------------------------------------------------------------------
        | Pagination
        |--------------------------------------------------------------------------
        */

        $products = $query->paginate($perPage);

        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return response()->json([
            'success' => true,
            'message' => 'Products fetched successfully',
            'data' => $products,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Store Product
    |--------------------------------------------------------------------------
    */

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',

            'description' => 'nullable|string',

            'price' => 'required|numeric|min:0',

            'category_id' => 'nullable|exists:categories,id',

            /*
            |--------------------------------------------------------------------------
            | Images
            |--------------------------------------------------------------------------
            */

            'images' => 'nullable|array',

            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:2048',

            /*
            |--------------------------------------------------------------------------
            | Variants
            |--------------------------------------------------------------------------
            */

            'variants' => 'required|array|min:1',

            'variants.*.size' => 'nullable|string|max:50',

            'variants.*.color' => 'nullable|string|max:100',

            'variants.*.sku' =>
                'required|string|max:100|unique:product_variants,sku',

            'variants.*.stock' =>
                'required|integer|min:0',

            'variants.*.price' =>
                'nullable|numeric|min:0',
        ]);

        DB::beginTransaction();

        try {

            /*
            |--------------------------------------------------------------------------
            | Create Product
            |--------------------------------------------------------------------------
            */

            $product = Product::create([
                'name' => $validated['name'],

                'description' =>
                    $validated['description'] ?? null,

                'price' =>
                    $validated['price'],

                'category_id' =>
                    $validated['category_id'] ?? null,

                'views_count' => 0,

                'sales_count' => 0,

                'stock' => 0,
            ]);


            /*
            |--------------------------------------------------------------------------
            | Upload Images
            |--------------------------------------------------------------------------
            */

            if ($request->hasFile('images')) {

                foreach (
                    $request->file('images')
                    as $index => $image
                ) {

                    $path = $image->store(
                        'product_images',
                        'public'
                    );

                    $product->images()->create([
                        'image' => $path,

                        'is_primary' =>
                            $index === 0,

                        'sort_order' =>
                            $index,
                    ]);
                }
            }


            /*
            |--------------------------------------------------------------------------
            | Create Variants
            |--------------------------------------------------------------------------
            */

            foreach (
                $validated['variants']
                as $variant
            ) {

                $product->variants()->create([
                    'size' =>
                        $variant['size'] ?? null,

                    'color' =>
                        $variant['color'] ?? null,

                    'sku' =>
                        $variant['sku'],

                    'stock' =>
                        $variant['stock'],

                    'price' =>
                        $variant['price'] ?? null,
                ]);
            }


            /*
            |--------------------------------------------------------------------------
            | Calculate Total Stock
            |--------------------------------------------------------------------------
            */

            $totalStock = $product
                ->variants()
                ->sum('stock');

            $product->update([
                'stock' => $totalStock,
            ]);


            DB::commit();


            /*
            |--------------------------------------------------------------------------
            | Return Product
            |--------------------------------------------------------------------------
            */

            $product->load([
                'images',
                'variants',
            ]);

            return response()->json([
                'success' => true,

                'message' =>
                    'Product created successfully',

                'data' => $product,
            ], 201);


        } catch (\Throwable $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,

                'message' =>
                    'Failed to create product',

                'error' =>
                    $e->getMessage(),
            ], 500);
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Get Single Product
    |--------------------------------------------------------------------------
    */

    public function show($id)
    {
        $product = Product::with([
            'images',
            'variants',
        ])->find($id);


        /*
        |--------------------------------------------------------------------------
        | Check Product
        |--------------------------------------------------------------------------
        */

        if (!$product) {

            return response()->json([
                'success' => false,

                'message' =>
                    'Product not found',
            ], 404);
        }


        /*
        |--------------------------------------------------------------------------
        | Increase View Count
        |--------------------------------------------------------------------------
        */

        $product->increment('views_count');


        /*
        |--------------------------------------------------------------------------
        | Refresh Product
        |--------------------------------------------------------------------------
        */

        $product->refresh();


        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return response()->json([
            'success' => true,

            'message' =>
                'Product fetched successfully',

            'data' => $product,
        ], 200);
    }


    /*
    |--------------------------------------------------------------------------
    | Update Product
    |--------------------------------------------------------------------------
    */

    public function update(Request $request, $id)
    {
        $product = Product::find($id);


        /*
        |--------------------------------------------------------------------------
        | Check Product
        |--------------------------------------------------------------------------
        */

        if (!$product) {

            return response()->json([
                'success' => false,

                'message' =>
                    'Product not found',
            ], 404);
        }


        /*
        |--------------------------------------------------------------------------
        | Validation
        |--------------------------------------------------------------------------
        */

        $validated = $request->validate([
            'name' =>
                'sometimes|required|string|max:255',

            'description' =>
                'nullable|string',

            'price' =>
                'sometimes|required|numeric|min:0',

            'category_id' =>
                'nullable|exists:categories,id',

            /*
            |--------------------------------------------------------------------------
            | Images
            |--------------------------------------------------------------------------
            */

            'images' =>
                'nullable|array',

            'images.*' =>
                'image|mimes:jpg,jpeg,png,webp|max:2048',

            /*
            |--------------------------------------------------------------------------
            | Variants
            |--------------------------------------------------------------------------
            */

            'variants' =>
                'nullable|array',

            'variants.*.id' =>
                'nullable|integer|exists:product_variants,id',

            'variants.*.size' =>
                'nullable|string|max:50',

            'variants.*.color' =>
                'nullable|string|max:100',

            'variants.*.sku' =>
                'required|string|max:100',

            'variants.*.stock' =>
                'required|integer|min:0',

            'variants.*.price' =>
                'nullable|numeric|min:0',
        ]);


        DB::beginTransaction();

        try {

            /*
            |--------------------------------------------------------------------------
            | Update Product
            |--------------------------------------------------------------------------
            */

            $product->update([
                'name' =>
                    $validated['name']
                    ?? $product->name,

                'description' =>
                    array_key_exists(
                        'description',
                        $validated
                    )
                        ? $validated['description']
                        : $product->description,

                'price' =>
                    $validated['price']
                    ?? $product->price,

                'category_id' =>
                    array_key_exists(
                        'category_id',
                        $validated
                    )
                        ? $validated['category_id']
                        : $product->category_id,
            ]);


            /*
            |--------------------------------------------------------------------------
            | Add New Images
            |--------------------------------------------------------------------------
            */

            if ($request->hasFile('images')) {

                $existingImagesCount =
                    $product->images()->count();

                foreach (
                    $request->file('images')
                    as $index => $image
                ) {

                    $path = $image->store(
                        'product_images',
                        'public'
                    );

                    $product->images()->create([
                        'image' => $path,

                        'is_primary' =>
                            $existingImagesCount === 0
                            && $index === 0,

                        'sort_order' =>
                            $existingImagesCount + $index,
                    ]);
                }
            }


            /*
            |--------------------------------------------------------------------------
            | Update / Create Variants
            |--------------------------------------------------------------------------
            */

            if (isset($validated['variants'])) {

                foreach (
                    $validated['variants']
                    as $variant
                ) {

                    /*
                    |--------------------------------------------------------------------------
                    | Existing Variant
                    |--------------------------------------------------------------------------
                    */

                    if (!empty($variant['id'])) {

                        $productVariant =
                            $product
                                ->variants()
                                ->where(
                                    'id',
                                    $variant['id']
                                )
                                ->first();

                        if ($productVariant) {

                            $productVariant->update([
                                'size' =>
                                    $variant['size']
                                    ?? null,

                                'color' =>
                                    $variant['color']
                                    ?? null,

                                'sku' =>
                                    $variant['sku'],

                                'stock' =>
                                    $variant['stock'],

                                'price' =>
                                    $variant['price']
                                    ?? null,
                            ]);
                        }

                    } else {

                        /*
                        |--------------------------------------------------------------------------
                        | New Variant
                        |--------------------------------------------------------------------------
                        */

                        $product->variants()->create([
                            'size' =>
                                $variant['size']
                                ?? null,

                            'color' =>
                                $variant['color']
                                ?? null,

                            'sku' =>
                                $variant['sku'],

                            'stock' =>
                                $variant['stock'],

                            'price' =>
                                $variant['price']
                                ?? null,
                        ]);
                    }
                }
            }


            /*
            |--------------------------------------------------------------------------
            | Update Product Stock
            |--------------------------------------------------------------------------
            */

            $totalStock =
                $product
                    ->variants()
                    ->sum('stock');

            $product->update([
                'stock' => $totalStock,
            ]);


            DB::commit();


            /*
            |--------------------------------------------------------------------------
            | Return Updated Product
            |--------------------------------------------------------------------------
            */

            $product->load([
                'images',
                'variants',
            ]);

            return response()->json([
                'success' => true,

                'message' =>
                    'Product updated successfully',

                'data' => $product,
            ], 200);


        } catch (\Throwable $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,

                'message' =>
                    'Failed to update product',

                'error' =>
                    $e->getMessage(),
            ], 500);
        }
    }


    /*
    |--------------------------------------------------------------------------
    | New Products
    |--------------------------------------------------------------------------
    */

    public function newProducts()
    {
        $products = Product::with([
            'images',
            'variants',
        ])
            ->latest('created_at')
            ->limit(10)
            ->get();


        return response()->json([
            'success' => true,

            'message' =>
                'New products fetched successfully',

            'data' => $products,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Popular Products
    |--------------------------------------------------------------------------
    */

    public function popularProducts()
    {
        $products = Product::with([
            'images',
            'variants',
        ])
            ->orderByDesc('views_count')
            ->limit(10)
            ->get();


        return response()->json([
            'success' => true,

            'message' =>
                'Popular products fetched successfully',

            'data' => $products,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Top Selling Products
    |--------------------------------------------------------------------------
    */

    public function topSellingProducts()
    {
        $products = Product::with([
            'images',
            'variants',
        ])
            ->orderByDesc('sales_count')
            ->limit(10)
            ->get();


        return response()->json([
            'success' => true,

            'message' =>
                'Top selling products fetched successfully',

            'data' => $products,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Delete Product
    |--------------------------------------------------------------------------
    */

    public function destroy($id)
    {
        $product = Product::with([
            'images',
            'variants',
        ])->find($id);


        /*
        |--------------------------------------------------------------------------
        | Check Product
        |--------------------------------------------------------------------------
        */

        if (!$product) {

            return response()->json([
                'success' => false,

                'message' =>
                    'Product not found',
            ], 404);
        }


        DB::beginTransaction();

        try {

            /*
            |--------------------------------------------------------------------------
            | Delete Image Files
            |--------------------------------------------------------------------------
            */

            foreach ($product->images as $image) {

                if (
                    Storage::disk('public')
                        ->exists($image->image)
                ) {

                    Storage::disk('public')
                        ->delete($image->image);
                }
            }


            /*
            |--------------------------------------------------------------------------
            | Delete Product
            |--------------------------------------------------------------------------
            */

            $product->delete();


            DB::commit();


            return response()->json([
                'success' => true,

                'message' =>
                    'Product deleted successfully',
            ], 200);


        } catch (\Throwable $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,

                'message' =>
                    'Failed to delete product',

                'error' =>
                    $e->getMessage(),
            ], 500);
        }
    }
}