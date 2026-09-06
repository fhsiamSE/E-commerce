<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
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
        /*
        |--------------------------------------------------------------------------
        | Get all orders
        |--------------------------------------------------------------------------
        */

        $orders = Order::with([
            'user',
            'assignee',
            'items.product.images',
            'items.variant',
        ])
        ->latest()
        ->get();


        /*
        |--------------------------------------------------------------------------
        | Calculate Revenue
        |--------------------------------------------------------------------------
        |
        | Only delivered orders are counted as revenue.
        |
        */

        $revenue = Order::where('status', 'delivered')
            ->sum('total');


        /*
        |--------------------------------------------------------------------------
        | Order Statistics
        |--------------------------------------------------------------------------
        */

        $totalOrders = Order::count();

        $pendingOrders = Order::where('status', 'pending')
            ->count();

        $processingOrders = Order::where('status', 'processing')
            ->count();

        $shippedOrders = Order::where('status', 'shipped')
            ->count();

        $deliveredOrders = Order::where('status', 'delivered')
            ->count();

        $cancelledOrders = Order::where('status', 'cancelled')
            ->count();


        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return response()->json([
            'success' => true,
            'message' => 'All orders fetched successfully.',

            'data' => $orders,

            'statistics' => [
                'total_orders' => $totalOrders,
                'pending_orders' => $pendingOrders,
                'processing_orders' => $processingOrders,
                'shipped_orders' => $shippedOrders,
                'delivered_orders' => $deliveredOrders,
                'cancelled_orders' => $cancelledOrders,

                // Only delivered orders
                'revenue' => $revenue,
            ],
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
            'assignee',
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
    | Get Assignees
    |--------------------------------------------------------------------------
    |
    | Only Admin and Employee users will be returned.
    |
    */

    public function assignees()
    {
        $users = User::whereIn('role', [
            'admin',
            'employee',
        ])
        ->select(
            'id',
            'name',
            'email',
            'role'
        )
        ->orderBy('name')
        ->get();


        return response()->json([
            'success' => true,
            'message' => 'Assignees fetched successfully.',
            'data' => $users,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Update Order Status
    |--------------------------------------------------------------------------
    */

    public function updateStatus(Request $request, $id)
    {
        /*
        |--------------------------------------------------------------------------
        | Validate status
        |--------------------------------------------------------------------------
        */

        $validated = $request->validate([
            'status' => [
                'required',
                'in:pending,processing,shipped,delivered,cancelled',
            ],
        ]);


        /*
        |--------------------------------------------------------------------------
        | Find order
        |--------------------------------------------------------------------------
        */

        $order = Order::find($id);


        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found.',
            ], 404);
        }


        /*
        |--------------------------------------------------------------------------
        | Update status
        |--------------------------------------------------------------------------
        */

        $order->update([
            'status' => $validated['status'],
        ]);


        /*
        |--------------------------------------------------------------------------
        | Reload order with relationships
        |--------------------------------------------------------------------------
        */

        $order->load([
            'user',
            'assignee',
            'items.product.images',
            'items.variant',
        ]);


        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return response()->json([
            'success' => true,
            'message' => 'Order status updated successfully.',
            'data' => $order,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Update Order Assignee
    |--------------------------------------------------------------------------
    */

    public function updateAssignee(Request $request, $id)
    {
        /*
        |--------------------------------------------------------------------------
        | Validate assignee
        |--------------------------------------------------------------------------
        */

        $validated = $request->validate([
            'assigned_to' => [
                'nullable',
                'integer',
                'exists:users,id',
            ],
        ]);


        /*
        |--------------------------------------------------------------------------
        | Find order
        |--------------------------------------------------------------------------
        */

        $order = Order::find($id);


        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found.',
            ], 404);
        }


        /*
        |--------------------------------------------------------------------------
        | Assign user
        |--------------------------------------------------------------------------
        */

        if ($validated['assigned_to'] !== null) {

            /*
            |--------------------------------------------------------------------------
            | Make sure selected user is Admin or Employee
            |--------------------------------------------------------------------------
            */

            $assignee = User::whereIn('role', [
                'admin',
                'employee',
            ])
            ->find($validated['assigned_to']);


            if (!$assignee) {
                return response()->json([
                    'success' => false,
                    'message' => 'Selected user is not an admin or employee.',
                ], 422);
            }


            /*
            |--------------------------------------------------------------------------
            | Set assignee
            |--------------------------------------------------------------------------
            */

            $order->assigned_to = $assignee->id;

        } else {

            /*
            |--------------------------------------------------------------------------
            | Unassign order
            |--------------------------------------------------------------------------
            */

            $order->assigned_to = null;
        }


        /*
        |--------------------------------------------------------------------------
        | Save
        |--------------------------------------------------------------------------
        */

        $order->save();


        /*
        |--------------------------------------------------------------------------
        | Reload relationships
        |--------------------------------------------------------------------------
        */

        $order->load([
            'user',
            'assignee',
            'items.product.images',
            'items.variant',
        ]);


        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return response()->json([
            'success' => true,

            'message' => $order->assigned_to
                ? 'Order assigned successfully.'
                : 'Order unassigned successfully.',

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
        /*
        |--------------------------------------------------------------------------
        | Find order
        |--------------------------------------------------------------------------
        */

        $order = Order::find($id);


        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found.',
            ], 404);
        }


        /*
        |--------------------------------------------------------------------------
        | Delete order
        |--------------------------------------------------------------------------
        */

        $order->delete();


        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return response()->json([
            'success' => true,
            'message' => 'Order deleted successfully.',
        ]);
    }
}