<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

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

        if (!$user) {
            return $this->storeGuest($request);
        }

        /*
        |--------------------------------------------------------------------------
        | Validate Request
        |--------------------------------------------------------------------------
        */

        $validated = $request->validate([
            'shipping' => 'nullable|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
        ]);


        /*
        |--------------------------------------------------------------------------
        | Start Database Transaction
        |--------------------------------------------------------------------------
        */

        DB::beginTransaction();

        try {

            /*
            |--------------------------------------------------------------------------
            | Get User Cart
            |--------------------------------------------------------------------------
            */

            $cartItems = Cart::with([
                'product',
                'variant',
            ])
                ->where('user_id', $user->id)
                ->get();


            /*
            |--------------------------------------------------------------------------
            | Check Cart
            |--------------------------------------------------------------------------
            */

            if ($cartItems->isEmpty()) {

                DB::rollBack();

                return response()->json([
                    'success' => false,
                    'message' => 'Your cart is empty.',
                ], 400);
            }


            /*
            |--------------------------------------------------------------------------
            | Calculate Subtotal
            |--------------------------------------------------------------------------
            */

            $subtotal = 0;


            foreach ($cartItems as $item) {

                /*
                |--------------------------------------------------------------------------
                | Check Product
                |--------------------------------------------------------------------------
                */

                if (!$item->product) {

                    throw new \Exception(
                        "Product not found for cart item ID: {$item->id}"
                    );
                }


                /*
                |--------------------------------------------------------------------------
                | Check Variant
                |--------------------------------------------------------------------------
                */

                if ($item->variant_id && !$item->variant) {

                    throw new \Exception(
                        "Variant not found for cart item ID: {$item->id}"
                    );
                }


                /*
                |--------------------------------------------------------------------------
                | Get Price
                |--------------------------------------------------------------------------
                |
                | Variant price has priority.
                | If variant has no price, use product price.
                |
                */

                $price = $item->variant?->price
                    ?? $item->product->price;


                /*
                |--------------------------------------------------------------------------
                | Calculate Item Total
                |--------------------------------------------------------------------------
                */

                $subtotal += $price * $item->quantity;
            }


            /*
            |--------------------------------------------------------------------------
            | Shipping
            |--------------------------------------------------------------------------
            */

            $shipping = $validated['shipping'] ?? 0;


            /*
            |--------------------------------------------------------------------------
            | Discount
            |--------------------------------------------------------------------------
            */

            $discount = $validated['discount'] ?? 0;


            /*
            |--------------------------------------------------------------------------
            | Calculate Total
            |--------------------------------------------------------------------------
            */

            $total = $subtotal + $shipping - $discount;


            /*
            |--------------------------------------------------------------------------
            | Prevent Negative Total
            |--------------------------------------------------------------------------
            */

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
            | Create Order Items + Update Stock
            |--------------------------------------------------------------------------
            */

            foreach ($cartItems as $item) {

                /*
                |--------------------------------------------------------------------------
                | Get Price
                |--------------------------------------------------------------------------
                */

                $price = $item->variant?->price
                    ?? $item->product->price;


                /*
                |--------------------------------------------------------------------------
                | Check Quantity
                |--------------------------------------------------------------------------
                */

                if ($item->quantity < 1) {

                    throw new \Exception(
                        "Invalid quantity for cart item ID: {$item->id}"
                    );
                }


                /*
                |--------------------------------------------------------------------------
                | Variant Product
                |--------------------------------------------------------------------------
                */

                if ($item->variant_id) {

                    /*
                    |--------------------------------------------------------------------------
                    | Lock Variant Row
                    |--------------------------------------------------------------------------
                    |
                    | Prevents two customers from buying the
                    | same last stock at the same time.
                    |
                    */

                    $variant = $item->product
                        ->variants()
                        ->where('id', $item->variant_id)
                        ->lockForUpdate()
                        ->first();


                    /*
                    |--------------------------------------------------------------------------
                    | Variant Not Found
                    |--------------------------------------------------------------------------
                    */

                    if (!$variant) {

                        throw new \Exception(
                            "Variant not found for product: {$item->product->id}"
                        );
                    }


                    /*
                    |--------------------------------------------------------------------------
                    | Check Variant Stock
                    |--------------------------------------------------------------------------
                    */

                    if ($variant->stock < $item->quantity) {

                        throw new \Exception(
                            "Insufficient stock for SKU: {$variant->sku}. "
                            . "Available: {$variant->stock}, "
                            . "Requested: {$item->quantity}"
                        );
                    }


                    /*
                    |--------------------------------------------------------------------------
                    | Decrease Variant Stock
                    |--------------------------------------------------------------------------
                    */

                    $variant->decrement(
                        'stock',
                        $item->quantity
                    );


                    /*
                    |--------------------------------------------------------------------------
                    | Decrease Product Stock
                    |--------------------------------------------------------------------------
                    */

                    $item->product->decrement(
                        'stock',
                        $item->quantity
                    );
                }


                /*
                |--------------------------------------------------------------------------
                | Product Without Variant
                |--------------------------------------------------------------------------
                */

                else {

                    /*
                    |--------------------------------------------------------------------------
                    | Lock Product Row
                    |--------------------------------------------------------------------------
                    */

                    $product = $item->product
                        ->newQuery()
                        ->where('id', $item->product_id)
                        ->lockForUpdate()
                        ->first();


                    /*
                    |--------------------------------------------------------------------------
                    | Check Product Stock
                    |--------------------------------------------------------------------------
                    */

                    if (!$product) {

                        throw new \Exception(
                            "Product not found: {$item->product_id}"
                        );
                    }


                    if ($product->stock < $item->quantity) {

                        throw new \Exception(
                            "Insufficient stock for product: "
                            . "{$product->name}. "
                            . "Available: {$product->stock}, "
                            . "Requested: {$item->quantity}"
                        );
                    }


                    /*
                    |--------------------------------------------------------------------------
                    | Decrease Product Stock
                    |--------------------------------------------------------------------------
                    */

                    $product->decrement(
                        'stock',
                        $item->quantity
                    );
                }


                /*
                |--------------------------------------------------------------------------
                | Create Order Item
                |--------------------------------------------------------------------------
                */

                $order->items()->create([
                    'product_id' => $item->product_id,
                    'variant_id' => $item->variant_id,
                    'quantity' => $item->quantity,
                    'price' => $price,
                ]);


                /*
                |--------------------------------------------------------------------------
                | Update Sales Count
                |--------------------------------------------------------------------------
                |
                | Example:
                |
                | Current sales_count = 5
                | Customer buys quantity = 3
                |
                | New sales_count = 8
                |
                */

                $item->product->increment(
                    'sales_count',
                    $item->quantity
                );
            }


            /*
            |--------------------------------------------------------------------------
            | Empty User Cart
            |--------------------------------------------------------------------------
            */

            Cart::where('user_id', $user->id)
                ->delete();


            /*
            |--------------------------------------------------------------------------
            | Commit Transaction
            |--------------------------------------------------------------------------
            */

            DB::commit();


            /*
            |--------------------------------------------------------------------------
            | Load Complete Order
            |--------------------------------------------------------------------------
            */

            $order->load([
                'user',
                'items.product.images',
                'items.variant',
            ]);


            /*
            |--------------------------------------------------------------------------
            | Return Success Response
            |--------------------------------------------------------------------------
            */

            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully.',
                'data' => $order,
            ], 201);


        } catch (\Throwable $e) {

            /*
            |--------------------------------------------------------------------------
            | Rollback Transaction
            |--------------------------------------------------------------------------
            */

            DB::rollBack();


            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function storeGuest(Request $request)
    {
        $validated = $request->validate([
            'shipping' => 'nullable|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'guest_email' => 'required|email|max:255',
            'delivery_address' => 'required|string|max:500',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.variant_id' => 'nullable|integer|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();

        try {
            $guestEmail = strtolower(trim($validated['guest_email']));

            $guestUser = User::firstOrCreate(
                ['email' => $guestEmail],
                [
                    'name' => 'Guest',
                    'password' => bcrypt(Str::random(24)),
                    'address' => $validated['delivery_address'],
                ]
            );

            if ($guestUser->address !== $validated['delivery_address']) {
                $guestUser->update(['address' => $validated['delivery_address']]);
            }

            $subtotal = 0;
            $cartItems = [];

            foreach ($validated['items'] as $itemData) {
                $product = Product::with('variants')->findOrFail($itemData['product_id']);
                $variant = null;

                if (!empty($itemData['variant_id'])) {
                    $variant = ProductVariant::where('id', $itemData['variant_id'])
                        ->where('product_id', $product->id)
                        ->firstOrFail();
                }

                $price = $variant?->price ?? $product->price;
                $quantity = (int) $itemData['quantity'];

                if ($variant) {
                    if ($variant->stock < $quantity) {
                        throw new \Exception("Insufficient stock for product: {$product->name}.");
                    }
                    $variant->decrement('stock', $quantity);
                    $product->decrement('stock', $quantity);
                } else {
                    if ($product->stock < $quantity) {
                        throw new \Exception("Insufficient stock for product: {$product->name}.");
                    }
                    $product->decrement('stock', $quantity);
                }

                $subtotal += $price * $quantity;
                $cartItems[] = ['product_id' => $product->id, 'variant_id' => $variant?->id, 'quantity' => $quantity, 'price' => $price];
            }

            $shipping = $validated['shipping'] ?? 0;
            $discount = $validated['discount'] ?? 0;
            $total = max(0, $subtotal + $shipping - $discount);

            $order = Order::create([
                'user_id' => $guestUser->id,
                'subtotal' => $subtotal,
                'shipping' => $shipping,
                'discount' => $discount,
                'total' => $total,
                'status' => 'pending',
            ]);

            foreach ($cartItems as $item) {
                $order->items()->create([
                    'product_id' => $item['product_id'],
                    'variant_id' => $item['variant_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);

                $product = Product::find($item['product_id']);
                if ($product) {
                    $product->increment('sales_count', $item['quantity']);
                }
            }

            DB::commit();

            $order->load(['user', 'items.product.images', 'items.variant']);

            return response()->json([
                'success' => true,
                'message' => 'Guest order placed successfully.',
                'data' => $order,
            ], 201);
        } catch (\Throwable $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }
}

