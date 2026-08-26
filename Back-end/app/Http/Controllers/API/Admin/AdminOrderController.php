<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Get All Orders
    |--------------------------------------------------------------------------
    */

    public function index(Request $request)
    {
        $orders = Order::with([
            'user',
            'items.product.images',
            'items.variant',
        ])
        ->latest()
        ->get();

        return response()->json([
            'success' => true,
            'message' => 'All orders fetched successfully.',
            'data' => $orders,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Get Single Order
    |--------------------------------------------------------------------------
    */

    public function show($id)
    {
        $order = Order::with([
            'user',
            'items.product.images',
            'items.variant',
        ])->find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Order fetched successfully.',
            'data' => $order,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Update Order Status
    |--------------------------------------------------------------------------
    */

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
        ]);

        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found.',
            ], 404);
        }

        $order->update([
            'status' => $validated['status'],
        ]);

        $order->load([
            'user',
            'items.product.images',
            'items.variant',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Order status updated successfully.',
            'data' => $order,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Delete Order
    |--------------------------------------------------------------------------
    */

    public function destroy($id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found.',
            ], 404);
        }

        $order->delete();

        return response()->json([
            'success' => true,
            'message' => 'Order deleted successfully.',
        ]);
    }
}