<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\HomeController;
use App\Http\Controllers\API\CartController;
use App\Http\Controllers\API\OrderController;
use App\Http\Controllers\API\WishlistController;
use App\Http\Controllers\API\ReviewController;
use App\Http\Controllers\API\Admin\DashboardController;
use App\Http\Controllers\API\Admin\AdminProductController;
use App\Http\Controllers\API\Admin\AdminOrderController;
use App\Http\Controllers\API\Admin\AdminUserController;

//Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/home', [HomeController::class, 'index']);
Route::get('/products/{productId}/reviews',[ReviewController::class, 'index']);

Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);
    Route::get('/new', [ProductController::class, 'newProducts']);
    Route::get('/popular', [ProductController::class, 'popularProducts']);
    Route::get('/top-selling', [ProductController::class, 'topSellingProducts']);
    Route::get('/{id}', [ProductController::class, 'show']);
});


//Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user', [AuthController::class, 'update']);

    //product CRUD routes
    Route::prefix('products')->group(function () {
    Route::post('/', [ProductController::class, 'store']);
    Route::put('/{id}', [ProductController::class, 'update']);
    Route::delete('/{id}', [ProductController::class, 'destroy']);
    });


    //cart routes
    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'index']);
        Route::post('/', [CartController::class, 'store']);
        Route::put('/{id}', [CartController::class, 'update']);
        Route::delete('/{id}', [CartController::class, 'destroy']);
    });

    //wish list routes
    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist', [WishlistController::class, 'store']);
    Route::delete('/wishlist/{productId}', [WishlistController::class, 'destroy']);
    
    //order routes
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders', [OrderController::class, 'index']);

    //review routes
    Route::post('/products/{productId}/reviews',[ReviewController::class, 'store']);
    Route::get('/products/{productId}/my-review',[ReviewController::class, 'myReview']);
    Route::put('/reviews/{id}',[ReviewController::class, 'update']);
    Route::delete('/reviews/{id}',[ReviewController::class, 'destroy']);
     
});


//Admin routes
Route::middleware(['auth:sanctum', 'admin'])->group(function () {

    Route::get('/admin/test', function (Request $request) {
        return response()->json([
            'success' => true,
            'message' => 'Admin authorization working.',
            'user' => $request->user(),
        ]);
    });

});

Route::middleware(['auth:sanctum', 'admin']) ->prefix('admin') ->group(function () 
{
    Route::get('/dashboard', [DashboardController::class, 'index' ]); 
    Route::get('/products',[AdminProductController::class, 'index']);
    Route::delete('/products/{id}',[AdminProductController::class, 'destroy']);

    //AdminOrder routes
    Route::get('/orders', [AdminOrderController::class,'index']);
    Route::get('/orders/{id}', [AdminOrderController::class,'show']); 
    Route::patch('/orders/{id}/status', [AdminOrderController::class,'updateStatus']);
    Route::patch('/orders/{id}/assignee',[AdminOrderController::class, 'updateAssignee']);
    Route::get('/assignees', [AdminOrderController::class, 'assignees']);
    Route::patch('/orders/{id}/status', [AdminOrderController::class, 'updateStatus']);
    Route::delete('/orders/{id}', [AdminOrderController::class,'destroy']);

    //AdminUser routes
    Route::get('/users', [AdminUserController::class, 'index']);

});