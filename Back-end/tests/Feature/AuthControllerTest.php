<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_creates_a_user_with_valid_data(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Ali',
            'email' => 'ali@example.com',
            'password' => '12345678',
            'confirm_password' => '12345678',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('message', 'User registered successfully');

        $this->assertDatabaseHas('users', [
            'email' => 'ali@example.com',
        ]);
    }
}
