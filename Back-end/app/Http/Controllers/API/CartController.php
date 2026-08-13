<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\ProductVariant;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | GET CART
    |--------------------------------------------------------------------------
    */

    public function index(Request $request)
    {
        $cartItems = $request->user()
            ->carts()
            ->with([
                'product',
                'product.images',
                'variant',
            ])
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Cart fetched successfully',
            'data' => $cartItems,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | ADD TO CART
    |--------------------------------------------------------------------------
    */

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => [
                'required',
                'integer',
                'exists:products,id',
            ],

            'variant_id' => [
                'required',
                'integer',
                'exists:product_variants,id',
            ],

            'quantity' => [
                'required',
                'integer',
                'min:1',
            ],
        ]);


        /*
        |--------------------------------------------------------------------------
        | Get Variant
        |--------------------------------------------------------------------------
        */

        $variant = ProductVariant::where('id', $validated['variant_id'])
            ->where('product_id', $validated['product_id'])
            ->first();


        if (!$variant) {
            return response()->json([
                'success' => false,
                'message' => 'Selected variant does not belong to this product.',
            ], 422);
        }


        /*
        |--------------------------------------------------------------------------
        | Stock Check
        |--------------------------------------------------------------------------
        */

        if ($variant->stock < $validated['quantity']) {
            return response()->json([
                'success' => false,
                'message' => "Only {$variant->stock} item(s) are available.",
            ], 422);
        }


        /*
        |--------------------------------------------------------------------------
        | Existing Cart Item
        |--------------------------------------------------------------------------
        */

        $cartItem = Cart::where('user_id', $request->user()->id)
            ->where('variant_id', $variant->id)
            ->first();


        /*
        |--------------------------------------------------------------------------
        | Already In Cart
        |--------------------------------------------------------------------------
        */

        if ($cartItem) {

            $newQuantity =
                $cartItem->quantity + $validated['quantity'];


            if ($newQuantity > $variant->stock) {
                return response()->json([
                    'success' => false,
                    'message' =>
                        "Only {$variant->stock} item(s) are available.",
                ], 422);
            }


            $cartItem->update([
                'quantity' => $newQuantity,
            ]);
        }


        /*
        |--------------------------------------------------------------------------
        | New Cart Item
        |--------------------------------------------------------------------------
        */

        else {

            $cartItem = Cart::create([
                'user_id' => $request->user()->id,
                'product_id' => $validated['product_id'],
                'variant_id' => $validated['variant_id'],
                'quantity' => $validated['quantity'],
            ]);
        }


        /*
        |--------------------------------------------------------------------------
        | Return
        |--------------------------------------------------------------------------
        */

        $cartItem->load([
            'product',
            'product.images',
            'variant',
        ]);


        return response()->json([
            'success' => true,
            'message' => 'Product added to cart successfully',
            'data' => $cartItem,
        ], 201);
    }


    /*
    |--------------------------------------------------------------------------
    | UPDATE CART
    |--------------------------------------------------------------------------
    */

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'quantity' => [
                'required',
                'integer',
                'min:1',
            ],
        ]);


        $cartItem = Cart::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->with('variant')
            ->first();


        if (!$cartItem) {
            return response()->json([
                'success' => false,
                'message' => 'Cart item not found.',
            ], 404);
        }


        /*
        |--------------------------------------------------------------------------
        | Stock Check
        |--------------------------------------------------------------------------
        */

        if ($validated['quantity'] > $cartItem->variant->stock) {
            return response()->json([
                'success' => false,
                'message' =>
                    "Only {$cartItem->variant->stock} item(s) are available.",
            ], 422);
        }


        $cartItem->update([
            'quantity' => $validated['quantity'],
        ]);


        $cartItem->load([
            'product',
            'product.images',
            'variant',
        ]);


        return response()->json([
            'success' => true,
            'message' => 'Cart quantity updated successfully',
            'data' => $cartItem,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | DELETE CART ITEM
    |--------------------------------------------------------------------------
    */

    public function destroy(Request $request, $id)
    {
        $cartItem = Cart::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();


        if (!$cartItem) {
            return response()->json([
                'success' => false,
                'message' => 'Cart item not found.',
            ], 404);
        }


        $cartItem->delete();


        return response()->json([
            'success' => true,
            'message' => 'Product removed from cart successfully',
        ]);
    }
}