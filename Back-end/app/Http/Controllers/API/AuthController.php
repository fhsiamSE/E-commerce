<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $payload = $this->parsePayload($request);

        $validator = Validator::make($payload, [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'confirm_password' => 'required|string|same:password',
        ]);

        if ($validator->fails()) 
            {
            return response()
            ->json
            (['errors' => $validator->errors()], 422);
            }   

        $user = \App\Models\User::create([
            'name' => $payload['name'],
            'email' => $payload['email'],
            'password' => bcrypt($payload['password']),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully',
            'email' => $payload['email'],
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $payload = $this->parsePayload($request);

        $validator = Validator::make($payload, [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if (!Auth::attempt($payload)) {
            return response()->json(['message' => 'Invalid login credentials'], 401);
        }

        $user = Auth::user();
        $token = method_exists($user, 'createToken')
            ? $user->createToken('auth_token')->plainTextToken
            : null;

        return response()->json([
            'message' => 'User logged in successfully',
            'user' => $user,
            'token' => $token,
        ], 200);
    }

    private function parsePayload(Request $request): array
    {
        $content = $request->getContent();

        if (empty(trim($content))) {
            return $request->all();
        }

        $decoded = json_decode($content, true);

        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            return $decoded;
        }

        parse_str($content, $parsed);

        return is_array($parsed) ? $parsed : $request->all();
    }
}
