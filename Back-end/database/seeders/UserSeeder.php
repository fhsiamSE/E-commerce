<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
            'address' => 'Dhaka, Bangladesh',
            'phone_number' => '01700000000',
        ]);

        User::create([
            'name' => 'Siam Hossain',
            'email' => 'siam@example.com',
            'password' => Hash::make('password123'),
            'address' => 'Dhaka, Bangladesh',
            'phone_number' => '01800000000',
        ]);

        User::create([
            'name' => 'Demo User',
            'email' => 'demo@example.com',
            'password' => Hash::make('password123'),
            'address' => 'Chittagong, Bangladesh',
            'phone_number' => '01900000000',
        ]);
    }
}