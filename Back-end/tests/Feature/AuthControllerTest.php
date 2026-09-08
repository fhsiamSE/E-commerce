<?php

namespace Tests\Feature;

use App\Models\User;
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

        Product::create([
            'product_name' => 'Chicken Breast',
            'description' => 'Fresh chicken',
            'price' => 299.99,
            'category' => 'Chicken',
            'stock' => 10,
        ]);

        Product::create([
            'product_name' => 'Beef Steak',
            'description' => 'Fresh beef',
            'price' => 499.99,
            'category' => 'Beef',
            'stock' => 10,
        ]);

        $groupedResponse = $this->getJson('/api/products?category[]=chicken&category[]=beef&category[]=mutton');

        $groupedResponse->assertOk();
        $this->assertCount(2, $groupedResponse->json('data.data'));
    }

    public function test_authenticated_user_can_create_product_with_category_string_and_variants(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/products', [
            'product_name' => 'Rice 5kg',
            'description' => 'Premium rice',
            'price' => 1200,
            'category' => 'Rice',
            'stock' => 25,
            'variants' => [
                [
                    'size' => '5kg',
                    'sku' => 'RICE-5KG-001',
                    'stock' => 25,
                    'price' => 1200,
                ],
            ],
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('message', 'Product created successfully');

        $this->assertDatabaseHas('products', [
            'product_name' => 'Rice 5kg',
            'category' => 'Rice',
        ]);
    }
}
