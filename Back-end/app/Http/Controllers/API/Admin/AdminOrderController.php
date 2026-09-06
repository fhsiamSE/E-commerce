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
        $orders = Order::with([
            'user',
            'assignee',
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
    | Only Admin and Employee users will be returned.
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
            'assignee',
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
    | Update Order Assignee
    |--------------------------------------------------------------------------
    */

    public function updateAssignee(Request $request, $id)
    {
        $validated = $request->validate([
            'assigned_to' => [
                'nullable',
                'integer',
                'exists:users,id',
            ],
        ]);

        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found.',
            ], 404);
        }

        /*
        |----------------------------------------------------------------------
        | If an assignee is selected
        |----------------------------------------------------------------------
        */

        if ($validated['assigned_to'] !== null) {

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

            $order->assigned_to = $assignee->id;

        } else {

            /*
            |------------------------------------------------------------------
            | Unassign order
            |------------------------------------------------------------------
            */

            $order->assigned_to = null;
        }

        $order->save();

        $order->load([
            'user',
            'assignee',
            'items.product.images',
            'items.variant',
        ]);

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