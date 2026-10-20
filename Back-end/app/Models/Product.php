<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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

    public function countries(): BelongsToMany
    {
        return $this->belongsToMany(Country::class, 'product_country');
    }
     public function carts(): HasMany
    {
        return $this->hasMany(Cart::class);
    }
    public function wishlists(): HasMany
    {
        return $this->hasMany(Wishlist::class);
    }
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
