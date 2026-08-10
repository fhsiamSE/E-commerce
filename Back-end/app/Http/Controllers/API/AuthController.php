<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validateUser = validator::make(
            $request->all(),
            [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
                'confirm_password' => 'required|string|same:password',
            ]
        );
        if($validateUser->fails()){
            return response()->json([
                'status' => false,
                'message' => 'Validation error',
                'errors' => $validateUser->errors()
            ], 401);
        }
        $user = User::create([
            'name'=>$request->name,
            'email'=>$request->email,
            'password'=>$request->password,
        ]);

         return response()->json([
                'status' => true,
                'message' => 'User created successfully',
                'user'=> $user,
            ], 200);
    }

     public function login(Request $request)
    {
         $validateUser = validator::make(
            $request->all(),
            [
                'email' => 'required|string|email|max:255',
                'password' => 'required|string|min:8',
            ]
        );
         if($validateUser->fails()){
            return response()->json([
                'status' => false,
                'message' => 'Authentication Fails',
                'errors' => $validateUser->errors()
            ], 404);
        }
        if(Auth::attempt([ 'email' => $request->email, 'password' => $request->password])){
            $authUser = Auth::user();
            return response()->json([
                'status' => true,
                'message' => 'User logged in successfully',
                'token' => $authUser->createToken('MyApp')->plainTextToken,
                'token_type' => 'bearer'
            ], 200);
        }else{
             return response()->json([
                'status' => false,
                'message' => 'Email id and password dose not matched',
                'errors' => $validateUser->errors()
            ], 404);
        }

    }
     public function logout(Request $request)
    {
        $user = $request->user();
        $user->tokens()->delete();

        return response()->json([
            'status' => true,
            'message' => 'User logged out successfully'
        ], 200);
    }

    public function user(Request $request)
    {
        return response()->json([
            'status' => true,
            'user' => $request->user()
        ], 200);
    }
}
