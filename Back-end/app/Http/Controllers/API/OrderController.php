<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'shipping' => 'nullable|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
        ]);

        $cartItems = Cart::with([
            'product',
            'variant'
        ])
        ->where('user_id', $user->id)
        ->get();

        if ($cartItems->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Your cart is empty.',
            ], 400);
        }

        DB::beginTransaction();

        try {
            $subtotal = 0;

            foreach ($cartItems as $item) {
                $price = $item->variant?->price
                    ?? $item->product->price;

                $subtotal += $price * $item->quantity;
            }

            $shipping = $request->shipping ?? 0;
            $discount = $request->discount ?? 0;

            $total = $subtotal + $shipping - $discount;

            if ($total < 0) {
                $total = 0;
            }

            $order = Order::create([
                'user_id' => $user->id,
                'subtotal' => $subtotal,
                'shipping' => $shipping,
                'discount' => $discount,
                'total' => $total,
                'status' => 'pending',
            ]);

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

            Cart::where('user_id', $user->id)->delete();

            DB::commit();

            $order->load([
                'user',
                'items.product',
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