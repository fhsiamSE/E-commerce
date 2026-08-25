<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

use App\Http\Middleware\AdminMiddleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {

        /*
        |--------------------------------------------------------------------------
        | Admin Middleware
        |--------------------------------------------------------------------------
        */

        $middleware->alias([
            'admin' => AdminMiddleware::class,
        ]);

        /*
        |--------------------------------------------------------------------------
        | API Authentication
        |--------------------------------------------------------------------------
        |
        | Do not redirect unauthenticated API requests to /login.
        |
        */

        $middleware->redirectGuestsTo(function ($request) {
            return null;
        });

    })
    ->withExceptions(function (Exceptions $exceptions) {

        /*
        |--------------------------------------------------------------------------
        | API requests should return JSON
        |--------------------------------------------------------------------------
        */

        $exceptions->shouldRenderJsonWhen(function ($request, $input) {
            return $request->is('api/*') || $request->expectsJson();
        });

    })
    ->create();