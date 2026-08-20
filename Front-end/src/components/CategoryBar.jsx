import React from "react";
import { Link } from "react-router-dom";

const categories = [
  {
    name: "Men",
    count: "150+ Items",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
    href: "/category/men",
  },
  {
    name: "Women",
    count: "180+ Items",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80",
    href: "/category/women",
  },
  {
    name: "Shoes",
    count: "220+ Items",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    href: "/category/shoes",
  },
  {
    name: "Bags",
    count: "80+ Items",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
    href: "/category/bags",
  },
  {
    name: "Watches",
    count: "65+ Items",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    href: "/category/watches",
  },
  {
    name: "Accessories",
    count: "200+ Items",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    href: "/category/accessories",
  },
];

export default function CategoryBar() {
  return (
    <nav
      aria-label="Category navigation"
      className="mx-auto w-full max-w-6xl px-4 py-8"
    >
      <div className="grid grid-cols-3 justify-items-center gap-8 sm:grid-cols-3 md:grid-cols-6 md:gap-8">

        {categories.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className="group flex cursor-pointer flex-col items-center focus:outline-none"
          >

            {/* Circle */}

            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-stone-100 transition-transform duration-300 ease-out group-hover:scale-105 group-focus-visible:ring-2 group-focus-visible:ring-stone-400 sm:h-28 sm:w-28">

              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />

            </div>

            {/* Name */}

            <span className="mt-3 text-sm font-semibold text-stone-900 transition-colors group-hover:text-stone-600">
              {item.name}
            </span>

            {/* Count */}

            <span className="text-xs text-stone-400">
              {item.count}
            </span>

          </Link>
        ))}

      </div>
    </nav>
  );
}