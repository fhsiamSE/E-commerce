<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Get Logged-in User Orders
    |--------------------------------------------------------------------------
    */

    public function index(Request $request)
    {
        $user = $request->user();

        $orders = Order::with([
            'items.product.images',
            'items.variant',
        ])
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Orders fetched successfully.',
            'data' => $orders,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Store Order
    |--------------------------------------------------------------------------
    */

    public function store(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'shipping' => 'nullable|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Get User Cart
        |--------------------------------------------------------------------------
        */

        $cartItems = Cart::with([
            'product',
            'variant'
        ])
            ->where('user_id', $user->id)
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Check Cart
        |--------------------------------------------------------------------------
        */

        if ($cartItems->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Your cart is empty.',
            ], 400);
        }

        DB::beginTransaction();

        try {

            /*
            |--------------------------------------------------------------------------
            | Calculate Subtotal
            |--------------------------------------------------------------------------
            */

            $subtotal = 0;

            foreach ($cartItems as $item) {

                $price = $item->variant?->price
                    ?? $item->product->price;

                $subtotal += $price * $item->quantity;
            }


            /*
            |--------------------------------------------------------------------------
            | Shipping / Discount
            |--------------------------------------------------------------------------
            */

            $shipping = $request->shipping ?? 0;

            $discount = $request->discount ?? 0;


            /*
            |--------------------------------------------------------------------------
            | Calculate Total
            |--------------------------------------------------------------------------
            */

            $total = $subtotal + $shipping - $discount;

            if ($total < 0) {
                $total = 0;
            }


            /*
            |--------------------------------------------------------------------------
            | Create Order
            |--------------------------------------------------------------------------
            */

            $order = Order::create([
                'user_id' => $user->id,
                'subtotal' => $subtotal,
                'shipping' => $shipping,
                'discount' => $discount,
                'total' => $total,
                'status' => 'pending',
            ]);


            /*
            |--------------------------------------------------------------------------
            | Create Order Items
            |--------------------------------------------------------------------------
            */

            foreach ($cartItems as $item) {

                $price = $item->variant?->price
                    ?? $item->product->price;

                $order->items()->create([
                    'product_id' => $item->product_id,
                    'variant_id' => $item->variant_id,
                    'quantity' => $item->quantity,
                    'price' => $price,
                ]);
            }


            /*
            |--------------------------------------------------------------------------
            | Empty Cart
            |--------------------------------------------------------------------------
            */

            Cart::where('user_id', $user->id)->delete();


            /*
            |--------------------------------------------------------------------------
            | Commit Transaction
            |--------------------------------------------------------------------------
            */

            DB::commit();


            /*
            |--------------------------------------------------------------------------
            | Load Order Data
            |--------------------------------------------------------------------------
            */

            $order->load([
                'user',
                'items.product.images',
                'items.variant',
            ]);


            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully.',
                'data' => $order,
            ], 201);
        } catch (\Throwable $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to place order.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
