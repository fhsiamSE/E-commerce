<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | GET ALL PRODUCTS
    |--------------------------------------------------------------------------
    */
    public function index(Request $request)
    {
        $query = Product::with(['images', 'variants']);

        // Search
        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('product_name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Category
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Sorting
        switch ($request->get('sort')) {
            case 'price_low':
                $query->orderBy('price', 'asc');
                break;

            case 'price_high':
                $query->orderBy('price', 'desc');
                break;

            case 'popular':
                $query->orderBy('views_count', 'desc');
                break;

            case 'selling':
                $query->orderBy('sales_count', 'desc');
                break;

            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;

            default:
                $query->latest();
                break;
        }

        $perPage = min(
            max((int) $request->get('per_page', 20), 1),
            50
        );

        $products = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Products fetched successfully',
            'data' => $products,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | STORE PRODUCT
    |--------------------------------------------------------------------------
    */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_name' => 'required|string|max:255',

            'description' => 'nullable|string',

            'price' => 'required|numeric|min:0',

            'category_id' => 'required|integer|exists:categories,id',

            'images' => 'nullable|array',

            'images.*' => [
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],

            'variants' => 'required|array|min:1',

            'variants.*.id' => 'nullable|integer',

            'variants.*.size' => 'nullable|string|max:100',

            'variants.*.color' => 'nullable|string|max:100',

            'variants.*.sku' => [
                'required',
                'string',
                'max:255',
                'distinct',
                'unique:product_variants,sku',
            ],

            'variants.*.stock' => 'required|integer|min:0',

            'variants.*.price' => 'nullable|numeric|min:0',
        ]);

        DB::beginTransaction();

        try {

            /*
            |--------------------------------------------------------------------------
            | CREATE PRODUCT
            |--------------------------------------------------------------------------
            */

            $product = Product::create([
                'product_name' => $validated['product_name'],
                'description' => $validated['description'] ?? null,
                'price' => $validated['price'],
                'category_id' => $validated['category_id'],
                'stock' => 0,
            ]);


            /*
            |--------------------------------------------------------------------------
            | UPLOAD IMAGES
            |--------------------------------------------------------------------------
            */

            if ($request->hasFile('images')) {

                $images = $request->file('images');

                foreach ($images as $index => $image) {

                    $path = $image->store(
                        'product_images',
                        'public'
                    );

                    $product->images()->create([
                        'image' => $path,
                        'is_primary' => $index === 0,
                        'sort_order' => $index,
                    ]);
                }
            }


            /*
            |--------------------------------------------------------------------------
            | CREATE VARIANTS
            |--------------------------------------------------------------------------
            */

            $totalStock = 0;

            foreach ($validated['variants'] as $variantData) {

                $variant = $product->variants()->create([
                    'size' => $variantData['size'] ?? null,
                    'color' => $variantData['color'] ?? null,
                    'sku' => $variantData['sku'],
                    'stock' => $variantData['stock'],
                    'price' => $variantData['price'] ?? null,
                ]);

                $totalStock += $variant->stock;
            }


            /*
            |--------------------------------------------------------------------------
            | UPDATE PRODUCT STOCK
            |--------------------------------------------------------------------------
            */

            $product->update([
                'stock' => $totalStock,
            ]);

            DB::commit();

            $product->load([
                'images',
                'variants',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Product created successfully',
                'data' => $product,
            ], 201);

        } catch (\Throwable $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to create product',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    /*
    |--------------------------------------------------------------------------
    | SHOW PRODUCT
    |--------------------------------------------------------------------------
    */
    public function show($id)
    {
        $product = Product::with([
            'images',
            'variants',
        ])->findOrFail($id);

        $product->increment('views_count');

        $product->load([
            'images',
            'variants',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Product fetched successfully',
            'data' => $product,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | UPDATE PRODUCT
    |--------------------------------------------------------------------------
    */
    public function update(Request $request, $id)
    {
        $product = Product::with([
            'images',
            'variants',
        ])->findOrFail($id);


        /*
        |--------------------------------------------------------------------------
        | VALIDATION
        |--------------------------------------------------------------------------
        */

        $validated = $request->validate([

            'product_name' => 'sometimes|required|string|max:255',

            'description' => 'nullable|string',

            'price' => 'sometimes|required|numeric|min:0',

            'category_id' => 'sometimes|required|integer|exists:categories,id',

            /*
            |--------------------------------------------------------------------------
            | NEW IMAGES
            |--------------------------------------------------------------------------
            */

            'images' => 'nullable|array',

            'images.*' => [
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],

            /*
            |--------------------------------------------------------------------------
            | DELETE EXISTING IMAGES
            |--------------------------------------------------------------------------
            */

            'delete_images' => 'nullable|array',

            'delete_images.*' => [
                'integer',
                'exists:product_images,id',
            ],

            /*
            |--------------------------------------------------------------------------
            | VARIANTS
            |--------------------------------------------------------------------------
            */

            'variants' => 'required|array|min:1',

            'variants.*.id' => 'nullable|integer',

            'variants.*.size' => 'nullable|string|max:100',

            'variants.*.color' => 'nullable|string|max:100',

            'variants.*.sku' => [
                'required',
                'string',
                'max:255',
                'distinct',
            ],

            'variants.*.stock' => 'required|integer|min:0',

            'variants.*.price' => 'nullable|numeric|min:0',
        ]);


        /*
        |--------------------------------------------------------------------------
        | CHECK SKU DUPLICATES
        |--------------------------------------------------------------------------
        */

        foreach ($validated['variants'] as $variantData) {

            $query = ProductVariant::where(
                'sku',
                $variantData['sku']
            );

            if (!empty($variantData['id'])) {
                $query->where(
                    'id',
                    '!=',
                    $variantData['id']
                );
            }

            if ($query->exists()) {

                return response()->json([
                    'success' => false,
                    'message' => "SKU {$variantData['sku']} already exists.",
                ], 422);
            }
        }


        DB::beginTransaction();

        try {

            /*
            |--------------------------------------------------------------------------
            | UPDATE PRODUCT INFORMATION
            |--------------------------------------------------------------------------
            */

            $productData = [];

            if ($request->has('product_name')) {
                $productData['product_name'] =
                    $validated['product_name'];
            }

            if ($request->has('description')) {
                $productData['description'] =
                    $validated['description'];
            }

            if ($request->has('price')) {
                $productData['price'] =
                    $validated['price'];
            }

            if ($request->has('category_id')) {
                $productData['category_id'] =
                    $validated['category_id'];
            }

            if (!empty($productData)) {
                $product->update($productData);
            }


            /*
            |--------------------------------------------------------------------------
            | DELETE SELECTED EXISTING IMAGES
            |--------------------------------------------------------------------------
            */

            if ($request->filled('delete_images')) {

                $deleteImageIds =
                    $request->input('delete_images', []);

                $imagesToDelete = $product
                    ->images()
                    ->whereIn('id', $deleteImageIds)
                    ->get();

                foreach ($imagesToDelete as $image) {

                    /*
                    |--------------------------------------------------------------------------
                    | DELETE PHYSICAL FILE
                    |--------------------------------------------------------------------------
                    */

                    if (
                        $image->image &&
                        Storage::disk('public')->exists(
                            $image->image
                        )
                    ) {
                        Storage::disk('public')->delete(
                            $image->image
                        );
                    }

                    /*
                    |--------------------------------------------------------------------------
                    | DELETE DATABASE RECORD
                    |--------------------------------------------------------------------------
                    */

                    $image->delete();
                }
            }


            /*
            |--------------------------------------------------------------------------
            | UPLOAD NEW IMAGES
            |--------------------------------------------------------------------------
            */

            if ($request->hasFile('images')) {

                $currentImageCount =
                    $product->images()->count();

                $newImages =
                    $request->file('images');

                foreach ($newImages as $index => $image) {

                    $path = $image->store(
                        'product_images',
                        'public'
                    );

                    $product->images()->create([
                        'image' => $path,

                        'is_primary' =>
                            $currentImageCount === 0 &&
                            $index === 0,

                        'sort_order' =>
                            $currentImageCount + $index,
                    ]);
                }
            }


            /*
            |--------------------------------------------------------------------------
            | MAKE SURE ONE IMAGE IS PRIMARY
            |--------------------------------------------------------------------------
            */

            $hasPrimaryImage = $product
                ->images()
                ->where('is_primary', true)
                ->exists();

            if (!$hasPrimaryImage) {

                $firstImage = $product
                    ->images()
                    ->orderBy('sort_order')
                    ->first();

                if ($firstImage) {

                    $firstImage->update([
                        'is_primary' => true,
                    ]);
                }
            }


            /*
            |--------------------------------------------------------------------------
            | UPDATE / CREATE VARIANTS
            |--------------------------------------------------------------------------
            */

            $submittedVariantIds = [];

            foreach ($validated['variants'] as $variantData) {

                /*
                |--------------------------------------------------------------------------
                | EXISTING VARIANT
                |--------------------------------------------------------------------------
                */

                if (!empty($variantData['id'])) {

                    $variant = $product
                        ->variants()
                        ->where(
                            'id',
                            $variantData['id']
                        )
                        ->first();

                    /*
                    |--------------------------------------------------------------------------
                    | If variant belongs to this product
                    |--------------------------------------------------------------------------
                    */

                    if ($variant) {

                        $variant->update([
                            'size' =>
                                $variantData['size'] ?? null,

                            'color' =>
                                $variantData['color'] ?? null,

                            'sku' =>
                                $variantData['sku'],

                            'stock' =>
                                $variantData['stock'],

                            'price' =>
                                $variantData['price'] ?? null,
                        ]);

                        $submittedVariantIds[] =
                            $variant->id;
                    }

                }

                /*
                |--------------------------------------------------------------------------
                | NEW VARIANT
                |--------------------------------------------------------------------------
                */

                else {

                    $variant =
                        $product->variants()->create([
                            'size' =>
                                $variantData['size'] ?? null,

                            'color' =>
                                $variantData['color'] ?? null,

                            'sku' =>
                                $variantData['sku'],

                            'stock' =>
                                $variantData['stock'],

                            'price' =>
                                $variantData['price'] ?? null,
                        ]);

                    $submittedVariantIds[] =
                        $variant->id;
                }
            }


            /*
            |--------------------------------------------------------------------------
            | DELETE REMOVED VARIANTS
            |--------------------------------------------------------------------------
            */

            if (!empty($submittedVariantIds)) {

                $product
                    ->variants()
                    ->whereNotIn(
                        'id',
                        $submittedVariantIds
                    )
                    ->delete();
            }


            /*
            |--------------------------------------------------------------------------
            | RECALCULATE PRODUCT STOCK
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
            | RETURN UPDATED PRODUCT
            |--------------------------------------------------------------------------
            */

            $product->load([
                'images',
                'variants',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Product updated successfully',
                'data' => $product,
            ]);

        } catch (\Throwable $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to update product',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    /*
    |--------------------------------------------------------------------------
    | NEW PRODUCTS
    |--------------------------------------------------------------------------
    */
    public function newProducts()
    {
        $products = Product::with([
            'images',
            'variants',
        ])
            ->latest()
            ->take(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | POPULAR PRODUCTS
    |--------------------------------------------------------------------------
    */
    public function popularProducts()
    {
        $products = Product::with([
            'images',
            'variants',
        ])
            ->orderByDesc('views_count')
            ->take(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | TOP SELLING PRODUCTS
    |--------------------------------------------------------------------------
    */
    public function topSellingProducts()
    {
        $products = Product::with([
            'images',
            'variants',
        ])
            ->orderByDesc('sales_count')
            ->take(10)
            ->get();

        return response()->json([
            'success' => true,
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
        $product = Product::with('images')
            ->findOrFail($id);

        DB::beginTransaction();

        try {

            /*
            |--------------------------------------------------------------------------
            | DELETE ALL PRODUCT IMAGE FILES
            |--------------------------------------------------------------------------
            */

            foreach ($product->images as $image) {

                if (
                    $image->image &&
                    Storage::disk('public')->exists(
                        $image->image
                    )
                ) {
                    Storage::disk('public')->delete(
                        $image->image
                    );
                }
            }


            /*
            |--------------------------------------------------------------------------
            | DELETE PRODUCT
            |--------------------------------------------------------------------------
            |
            | If relationships use cascadeOnDelete(),
            | variants and images DB records will also be deleted.
            |
            */

            $product->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Product deleted successfully',
            ]);

        } catch (\Throwable $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete product',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}