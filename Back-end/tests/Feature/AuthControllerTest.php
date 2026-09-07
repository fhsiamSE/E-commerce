<?php

namespace Tests\Feature;

use App\Models\Product;
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

    public function test_products_are_filtered_by_category_slug(): void
    {
        Product::create([
            'product_name' => 'Men Shirt',
            'description' => 'A men product',
            'price' => 99.99,
            'category' => 'Men',
            'stock' => 10,
        ]);

        Product::create([
            'product_name' => 'Women Shirt',
            'description' => 'A women product',
            'price' => 129.99,
            'category' => 'Woman',
            'stock' => 10,
        ]);

        $response = $this->getJson('/api/products?category=men');

        $response->assertOk();
        $this->assertCount(1, $response->json('data.data'));
        $this->assertSame('Men Shirt', $response->json('data.data.0.product_name'));
    }
}
