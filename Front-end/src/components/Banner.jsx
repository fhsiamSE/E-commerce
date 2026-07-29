import { useEffect, useState } from 'react';

const slides = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1400&q=80',
    title: 'New Season Collection',
    subtitle: 'Discover fresh fashion for every style',
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=80',
    title: 'Big Deals This Week',
    subtitle: 'Save up to 40% on trending items',
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1400&q=80',
    title: 'Shop Premium Styles',
    subtitle: 'Elegant essentials for modern living',
  },
];

function Banner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative mb-8 overflow-hidden rounded-3xl bg-gray-100 shadow-md w-full">
      <div className="relative h-64 overflow-hidden md:h-96">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === current ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ zIndex: index === current ? 1 : 0 }}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-white">
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-white/80">
                  Limited Offer
                </p>
                <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">
                  {slide.title}
                </h2>
                <p className="mt-2 text-sm sm:text-base">{slide.subtitle}</p>
                <button className="mt-5 rounded-full bg-white px-5 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-400 pointer-events-auto relative z-10">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => setCurrent(index)}
            className={`h-2.5 w-2.5 rounded-full transition ${
              index === current ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Banner;