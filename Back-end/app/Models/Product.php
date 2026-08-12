<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $guarded = [];

     public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }
   public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }
}
