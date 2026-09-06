<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\JsonResponse;

class AdminReviewController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | GET ALL REVIEWS
    |--------------------------------------------------------------------------
    */

    public function index(): JsonResponse
    {
        $reviews = Review::with([
            'user:id,name,email',
            'product:id,product_name',
        ])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Reviews fetched successfully.',
            'data' => $reviews,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | DELETE REVIEW
    |--------------------------------------------------------------------------
    */

    public function destroy($id): JsonResponse
    {
        $review = Review::findOrFail($id);

        $review->delete();

        return response()->json([
            'success' => true,
            'message' => 'Review deleted successfully.',
        ]);
    }
}