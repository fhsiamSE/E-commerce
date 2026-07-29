import React from 'react';

const categories = [
  { name: 'Men', count: '150+ Items', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80', href: '/category/men' },
  { name: 'Women', count: '180+ Items', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80', href: '/category/women' },
  { name: 'Shoes', count: '220+ Items', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80', href: '/category/shoes' },
  { name: 'Bags', count: '80+ Items', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80', href: '/category/bags' },
  { name: 'Watches', count: '65+ Items', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80', href: '/category/watches' },
  { name: 'Accessories', count: '200+ Items', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80', href: '/category/accessories' },
];

export default function CategoryBar() {
  return (
    <nav aria-label="Category navigation" className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-32 justify-items-center">
        {categories.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="flex flex-col items-center group cursor-pointer focus:outline-none"
          >
            {/* Circle Wrapper */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-stone-100 flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-105 group-focus-visible:ring-2 group-focus-visible:ring-stone-400">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Content */}
            <span className="mt-3 text-sm font-semibold text-stone-900 group-hover:text-stone-600 transition-colors">
              {item.name}
            </span>
            <span className="text-xs text-stone-400">
              {item.count}
            </span>
          </a>
        ))}
      </div>
    </nav>
  );
}