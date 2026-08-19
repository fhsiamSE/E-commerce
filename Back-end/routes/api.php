<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\HomeController;
use App\Http\Controllers\API\CartController;
use App\Http\Controllers\API\OrderController;
use App\Http\Controllers\API\WishlistController;

//Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/home', [HomeController::class, 'index']);

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


    //cart route
    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'index']);
        Route::post('/', [CartController::class, 'store']);
        Route::put('/{id}', [CartController::class, 'update']);
        Route::delete('/{id}', [CartController::class, 'destroy']);
    });

    //wish list route
     Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist', [WishlistController::class, 'store']);
    Route::delete('/wishlist/{productId}', [WishlistController::class, 'destroy']);
    
    //order route
     Route::post('/orders', [OrderController::class, 'store']);
      Route::get('/orders', [OrderController::class, 'index']);
     
});

