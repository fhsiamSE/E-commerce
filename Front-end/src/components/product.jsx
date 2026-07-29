import React from 'react';

// Sample data array simulating database output
const sampleProducts = [
  {
    id: 1,
    title: 'Classic Denim Jacket',
    description: 'Stylish everyday jacket with comfort fit and premium fabric.',
    price: 79.99,
    originalPrice: 99.99,
    tag: 'New Product',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Minimalist Leather Watch',
    description: 'Sleek time-piece featuring premium leather straps and minimal dial.',
    price: 120.00,
    originalPrice: 150.00,
    tag: 'Popular',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'Canvas Everyday Backpack',
    description: 'Durable and spacious backpack built for work, travel, and school.',
    price: 49.99,
    originalPrice: 65.00,
    tag: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    title: 'Urban Running Sneakers',
    description: 'Lightweight, breathable sneakers designed for all-day comfort.',
    price: 89.95,
    originalPrice: 110.00,
    tag: 'New Product',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    title: 'Classic Sunglasses',
    description: 'UV-protected classic frames offering modern design and durability.',
    price: 35.00,
    originalPrice: 50.00,
    tag: 'Hot Deal',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
  },
    {
    id: 6,
    title: 'Elegant Silk Scarf',
    description: 'Luxurious silk scarf with vibrant patterns for a stylish look.',
    price: 45.00,
    originalPrice: 60.00,
    tag: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
  },    
  {
    id: 7,
    title: 'Leather Wallet',
    description: 'Compact and durable wallet made from premium leather.',
    price: 29.99,
    originalPrice: 40.00,
    tag: 'Popular',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 8,
    title: 'Wireless Earbuds',
    description: 'High-quality sound with noise cancellation and long battery life.',
    price: 99.99,
    originalPrice: 129.99,
    tag: 'Hot Deal',
    image: 'https://images.unsplash.com/photo-1580910051070-1c3f5e4b8f6c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 9,
    title: 'Smart Fitness Tracker',
    description: 'Track your health and fitness with this sleek wearable device.',
    price: 79.99,
    originalPrice: 99.99,
    tag: '',
    image: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 10,
    title: 'Travel Duffel Bag',
    description: 'Spacious and stylish duffel bag perfect for weekend getaways.',
    price: 59.99,
    originalPrice: 79.99,
    tag: 'Popular',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=800&q=80',
  }

];

function Products({ products = sampleProducts, productType = 'Products', tag = 'ProductTag' }) {
  const filteredProducts = tag === 'ProductTag'
    ? products
    : products.filter((product) => product.tag === tag);

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{productType}</h1>
        <button className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-black hover:text-black">
          See More
        </button>
      </div>

      {/* Grid: 2 items on mobile, 3 on tablet, 5 on desktop */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-3 sm:p-4 shadow-sm transition hover:shadow-lg"
          >
            {/* Image Container */}
            <div>
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />

                {product.tag && (
                  <span className="absolute left-2 top-2 sm:left-3 sm:top-3 rounded-full bg-black px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-white">
                    {product.tag}
                  </span>
                )}

                <button className="absolute right-2 top-2 sm:right-3 sm:top-3 rounded-full bg-white/70 p-1.5 sm:p-2 text-sm sm:text-lg shadow-sm transition hover:bg-pink-100 hover:text-pink-500">
                    ❤️
                </button>
              </div>

              {/* Product Info */}
              <div className="mt-3 sm:mt-4">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-1">
                  {product.title}
                </h3>
                <p className="mt-1 text-[11px] sm:text-xs text-gray-600 line-clamp-2">
                  {product.description}
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <p className="text-sm sm:text-base font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </p>
                  {product.originalPrice && (
                    <p className="text-xs text-gray-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex flex-col gap-1.5">
              <button className="w-full rounded-full bg-black px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-semibold text-white transition hover:bg-gray-800">
                Show Details
              </button>
              <button className="w-full rounded-full border border-gray-300 px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-semibold text-gray-700 transition hover:border-black hover:text-black">
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Products;