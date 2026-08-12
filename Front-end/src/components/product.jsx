import React from "react";

function Products({
  products = [],
  productType = "Products",
}) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {productType}
        </h1>

        <button className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-black hover:text-black">
          See More
        </button>
      </div>

      {/* Grid: 2 items on mobile, 3 on tablet, 5 on desktop */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition hover:shadow-lg sm:p-4"
          >

            {/* Image Container */}
            <div>
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
                
                <img
                  src={
                    product.image ||
                    product.images?.[0]?.image ||
                    "https://via.placeholder.com/500"
                  }
                  alt={product.product_name}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />

                {/* Product Tag */}
                {product.tag && (
                  <span className="absolute left-2 top-2 rounded-full bg-black px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white sm:left-3 sm:top-3 sm:px-3 sm:py-1 sm:text-xs">
                    {product.tag}
                  </span>
                )}

                {/* Wishlist */}
                <button className="absolute right-2 top-2 rounded-full bg-white/70 p-1.5 text-sm shadow-sm transition hover:bg-pink-100 hover:text-pink-500 sm:right-3 sm:top-3 sm:p-2 sm:text-lg">
                  ❤️
                </button>
              </div>

              {/* Product Info */}
              <div className="mt-3 sm:mt-4">
                
                <h3 className="line-clamp-1 text-xs font-semibold text-gray-900 sm:text-sm">
                  {product.product_name || product.name}
                </h3>

                <p className="mt-1 line-clamp-2 text-[11px] text-gray-600 sm:text-xs">
                  {product.description}
                </p>

                {/* Price */}
                <div className="mt-3 flex items-center justify-between">
                  
                  <p className="text-sm font-bold text-gray-900 sm:text-base">
                    ${Number(product.price || 0).toFixed(2)}
                  </p>

                  {/* Original Price */}
                  {product.originalPrice && (
                    <p className="text-xs text-gray-400 line-through">
                      ${Number(product.originalPrice).toFixed(2)}
                    </p>
                  )}

                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex flex-col gap-1.5">
              
              <button className="w-full rounded-full bg-black px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-gray-800 sm:px-4 sm:py-2 sm:text-xs">
                Show Details
              </button>

              <button className="w-full rounded-full border border-gray-300 px-3 py-1.5 text-[11px] font-semibold text-gray-700 transition hover:border-black hover:text-black sm:px-4 sm:py-2 sm:text-xs">
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