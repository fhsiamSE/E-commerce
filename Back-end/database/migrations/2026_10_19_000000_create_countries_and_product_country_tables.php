<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('countries', function (Blueprint $table) {
            $table->id();
            $table->string('code', 2)->unique();
            $table->string('name')->unique();
            $table->timestamps();
        });

        Schema::create('product_country', function (Blueprint $table) {
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('country_id')->constrained()->cascadeOnDelete();
            $table->primary(['product_id', 'country_id']);
        });

        $now = now();
        DB::table('countries')->insert([
            ['code' => 'bd', 'name' => 'Bangladesh', 'created_at' => $now, 'updated_at' => $now],
            ['code' => 'in', 'name' => 'India', 'created_at' => $now, 'updated_at' => $now],
            ['code' => 'pk', 'name' => 'Pakistan', 'created_at' => $now, 'updated_at' => $now],
            ['code' => 'np', 'name' => 'Nepal', 'created_at' => $now, 'updated_at' => $now],
            ['code' => 'mm', 'name' => 'Myanmar', 'created_at' => $now, 'updated_at' => $now],
            ['code' => 'vn', 'name' => 'Vietnam', 'created_at' => $now, 'updated_at' => $now],
            ['code' => 'kh', 'name' => 'Cambodia', 'created_at' => $now, 'updated_at' => $now],
            ['code' => 'id', 'name' => 'Indonesia', 'created_at' => $now, 'updated_at' => $now],
            ['code' => 'br', 'name' => 'Brazil', 'created_at' => $now, 'updated_at' => $now],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('product_country');
        Schema::dropIfExists('countries');
    }
};