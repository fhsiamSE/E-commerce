<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $json = file_get_contents(
            database_path('data/products.json')
        );

        $products = json_decode($json, true);

        foreach ($products as $data) {

            $product = Product::create([
                'product_name' => $data['product_name'],
                'description' => $data['description'],
                'price' => $data['price'],
                'category' => $data['category'],
                'stock' => 0,
            ]);

            // Create images
            $product->images()->createMany(
                $data['images']
            );

            // Create variants
            $product->variants()->createMany(
                $data['variants']
            );

            // Calculate total stock
            $product->update([
                'stock' => $product->variants()->sum('stock'),
            ]);
        }
    }
}