<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReviewController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Get All Reviews For Product
    |--------------------------------------------------------------------------
    */

    public function index($productId)
    {
        $product = Product::find($productId);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found.',
            ], 404);
        }

        $reviews = Review::with([
            'user:id,name,email'
        ])
            ->where('product_id', $productId)
            ->latest()
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Rating Summary
        |--------------------------------------------------------------------------
        */

        $totalReviews = $reviews->count();

        $averageRating = $totalReviews > 0
            ? round($reviews->avg('rating'), 1)
            : 0;

        $ratingCounts = [
            5 => $reviews->where('rating', 5)->count(),
            4 => $reviews->where('rating', 4)->count(),
            3 => $reviews->where('rating', 3)->count(),
            2 => $reviews->where('rating', 2)->count(),
            1 => $reviews->where('rating', 1)->count(),
        ];

        return response()->json([
            'success' => true,
            'message' => 'Reviews fetched successfully.',
            'data' => [
                'reviews' => $reviews,
                'total_reviews' => $totalReviews,
                'average_rating' => $averageRating,
                'rating_counts' => $ratingCounts,
            ],
        ], 200);
    }


    /*
    |--------------------------------------------------------------------------
    | Create Review
    |--------------------------------------------------------------------------
    */

    public function store(Request $request, $productId)
    {
        $user = $request->user();

        /*
        |--------------------------------------------------------------------------
        | Check Product
        |--------------------------------------------------------------------------
        */

        $product = Product::find($productId);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found.',
            ], 404);
        }


        /*
        |--------------------------------------------------------------------------
        | Validate
        |--------------------------------------------------------------------------
        */

        $validated = $request->validate([
            'rating' => [
                'required',
                'integer',
                'min:1',
                'max:5',
            ],

            'comment' => [
                'required',
                'string',
                'min:2',
                'max:1000',
            ],
        ]);


        /*
        |--------------------------------------------------------------------------
        | Prevent Multiple Reviews
        |--------------------------------------------------------------------------
        */

        $existingReview = Review::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->first();

        if ($existingReview) {
            return response()->json([
                'success' => false,
                'message' => 'You have already reviewed this product.',
                'data' => $existingReview,
            ], 409);
        }


        /*
        |--------------------------------------------------------------------------
        | Create Review
        |--------------------------------------------------------------------------
        */

        DB::beginTransaction();

        try {

            $review = Review::create([
                'user_id' => $user->id,
                'product_id' => $productId,
                'rating' => $validated['rating'],
                'comment' => $validated['comment'],
            ]);

            $review->load([
                'user:id,name,email'
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Review submitted successfully.',
                'data' => $review,
            ], 201);

        } catch (\Throwable $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to submit review.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Get Logged-in User Review
    |--------------------------------------------------------------------------
    */

    public function myReview(Request $request, $productId)
    {
        $user = $request->user();

        $review = Review::with([
            'user:id,name,email'
        ])
            ->where('user_id', $user->id)
            ->where('product_id', $productId)
            ->first();

        return response()->json([
            'success' => true,
            'message' => $review
                ? 'Your review fetched successfully.'
                : 'You have not reviewed this product yet.',
            'data' => $review,
        ], 200);
    }


    /*
    |--------------------------------------------------------------------------
    | Update Review
    |--------------------------------------------------------------------------
    */

    public function update(
        Request $request,
        $id
    ) {
        $user = $request->user();

        $review = Review::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$review) {
            return response()->json([
                'success' => false,
                'message' => 'Review not found.',
            ], 404);
        }


        /*
        |--------------------------------------------------------------------------
        | Validate
        |--------------------------------------------------------------------------
        */

        $validated = $request->validate([
            'rating' => [
                'required',
                'integer',
                'min:1',
                'max:5',
            ],

            'comment' => [
                'required',
                'string',
                'min:2',
                'max:1000',
            ],
        ]);


        /*
        |--------------------------------------------------------------------------
        | Update
        |--------------------------------------------------------------------------
        */

        $review->update([
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
        ]);

        $review->load([
            'user:id,name,email'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Review updated successfully.',
            'data' => $review,
        ], 200);
    }


    /*
    |--------------------------------------------------------------------------
    | Delete Review
    |--------------------------------------------------------------------------
    */

    public function destroy(
        Request $request,
        $id
    ) {
        $user = $request->user();

        $review = Review::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$review) {
            return response()->json([
                'success' => false,
                'message' => 'Review not found.',
            ], 404);
        }


        $review->delete();

        return response()->json([
            'success' => true,
            'message' => 'Review deleted successfully.',
        ], 200);
    }
}