<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Product 1
        |--------------------------------------------------------------------------
        */

        $product = Product::create([
            'product_name' => 'Premium Cotton T-Shirt',

            'description' => 'Premium quality cotton t-shirt with a comfortable fit.',

            'price' => 1200,

            'category' => 'T-Shirts',

            'stock' => 0,
        ]);


        /*
        |--------------------------------------------------------------------------
        | Images
        |--------------------------------------------------------------------------
        */

        $product->images()->createMany([
            [
                'image' => 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',

                'is_primary' => true,

                'sort_order' => 0,
            ],

            [
                'image' => 'https://images.unsplash.com/photo-1503341504253-dff4815485f1',

                'is_primary' => false,

                'sort_order' => 1,
            ],
        ]);


        /*
        |--------------------------------------------------------------------------
        | Variants
        |--------------------------------------------------------------------------
        */

        $product->variants()->createMany([
            [
                'size' => 'S',
                'color' => 'Black',
                'sku' => 'TS-BLK-S',
                'stock' => 10,
                'price' => 1200,
            ],

            [
                'size' => 'M',
                'color' => 'Black',
                'sku' => 'TS-BLK-M',
                'stock' => 15,
                'price' => 1200,
            ],

            [
                'size' => 'L',
                'color' => 'Black',
                'sku' => 'TS-BLK-L',
                'stock' => 12,
                'price' => 1200,
            ],

            [
                'size' => 'S',
                'color' => 'White',
                'sku' => 'TS-WHT-S',
                'stock' => 8,
                'price' => 1200,
            ],

            [
                'size' => 'M',
                'color' => 'White',
                'sku' => 'TS-WHT-M',
                'stock' => 10,
                'price' => 1200,
            ],
        ]);


        // Total stock
        $product->update([
            'stock' => $product->variants()->sum('stock'),
        ]);


        /*
        |--------------------------------------------------------------------------
        | Product 2
        |--------------------------------------------------------------------------
        */

        $product = Product::create([
            'product_name' => 'Classic Hoodie',

            'description' => 'Soft and warm hoodie for everyday wear.',

            'price' => 2200,

            'category' => 'Hoodies',

            'stock' => 0,
        ]);


        $product->images()->createMany([
            [
                'image' => 'https://images.unsplash.com/photo-1556821840-3a63f95609a7',

                'is_primary' => true,

                'sort_order' => 0,
            ],

            [
                'image' => 'https://images.unsplash.com/photo-1509942774463-acf339cf87d5',

                'is_primary' => false,

                'sort_order' => 1,
            ],
        ]);


        $product->variants()->createMany([
            [
                'size' => 'M',
                'color' => 'Black',
                'sku' => 'HD-BLK-M',
                'stock' => 10,
                'price' => 2200,
            ],

            [
                'size' => 'L',
                'color' => 'Black',
                'sku' => 'HD-BLK-L',
                'stock' => 15,
                'price' => 2200,
            ],

            [
                'size' => 'XL',
                'color' => 'Black',
                'sku' => 'HD-BLK-XL',
                'stock' => 8,
                'price' => 2200,
            ],

            [
                'size' => 'M',
                'color' => 'Gray',
                'sku' => 'HD-GRY-M',
                'stock' => 12,
                'price' => 2300,
            ],

            [
                'size' => 'L',
                'color' => 'Gray',
                'sku' => 'HD-GRY-L',
                'stock' => 10,
                'price' => 2300,
            ],
        ]);


        $product->update([
            'stock' => $product->variants()->sum('stock'),
        ]);


        /*
        |--------------------------------------------------------------------------
        | Product 3
        |--------------------------------------------------------------------------
        */

        $product = Product::create([
            'product_name' => 'Running Sneakers',

            'description' => 'Lightweight running sneakers designed for everyday comfort.',

            'price' => 4500,

            'category' => 'Shoes',

            'stock' => 0,
        ]);


        $product->images()->createMany([
            [
                'image' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',

                'is_primary' => true,

                'sort_order' => 0,
            ],

            [
                'image' => 'https://images.unsplash.com/photo-1549298916-b41d501d3772',

                'is_primary' => false,

                'sort_order' => 1,
            ],
        ]);


        $product->variants()->createMany([
            [
                'size' => '40',
                'color' => 'Red',
                'sku' => 'SN-RED-40',
                'stock' => 5,
                'price' => 4500,
            ],

            [
                'size' => '41',
                'color' => 'Red',
                'sku' => 'SN-RED-41',
                'stock' => 8,
                'price' => 4500,
            ],

            [
                'size' => '42',
                'color' => 'Red',
                'sku' => 'SN-RED-42',
                'stock' => 10,
                'price' => 4500,
            ],

            [
                'size' => '43',
                'color' => 'Black',
                'sku' => 'SN-BLK-43',
                'stock' => 7,
                'price' => 4700,
            ],

            [
                'size' => '44',
                'color' => 'Black',
                'sku' => 'SN-BLK-44',
                'stock' => 6,
                'price' => 4700,
            ],
        ]);


        $product->update([
            'stock' => $product->variants()->sum('stock'),
        ]);
    }
}