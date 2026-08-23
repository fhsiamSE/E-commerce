import React from 'react';
// Import Swiper React components & styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const reviews = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    role: 'Verified Buyer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'The quality surpassed my expectations! Fits perfectly and the material feels incredibly premium. Will definitely order again.',
    product: 'Classic Denim Jacket',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Verified Buyer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'Super fast shipping and top-notch packaging. The minimalist design matches everything in my wardrobe.',
    product: 'Minimalist Leather Watch',
  },
  {
    id: 3,
    name: 'Emily Davis',
    role: 'Verified Buyer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'Customer support helped me pick the right size when I was unsure. Excellent shopping experience from start to finish.',
    product: 'Canvas Everyday Backpack',
  },
  {
    id: 4,
    name: 'Alex Rivera',
    role: 'Verified Buyer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 4,
    comment: 'Comfortable right out of the box. Wore them all day on a weekend trip with zero discomfort. Highly recommended!',
    product: 'Urban Running Sneakers',
  },
];

export default function ReviewSlider({ title = "What Our Customers Say" }) {
  return (
    <section className="bg-gray-200 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              {title}
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Real reviews from real shopping experiences
            </p>
          </div>

          {/* Custom Navigation Buttons */}
          <div className="hidden sm:flex gap-2">
            <button id="prev-review" className="p-2.5 rounded-full border border-stone-300 bg-white text-stone-700 hover:bg-stone-900 hover:text-white transition-colors shadow-sm">
              <ChevronLeft size={18} />
            </button>
            <button id="next-review" className="p-2.5 rounded-full border border-stone-300 bg-white text-stone-700 hover:bg-stone-900 hover:text-white transition-colors shadow-sm">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Swiper Slider */}
        <Swiper
          modules={[Pagination, Autoplay, Navigation]}
          spaceBetween={24}
          slidesPerView={1}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true, dynamicBullets: true }}
          navigation={{
            prevEl: '#prev-review',
            nextEl: '#next-review',
          }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id} className="h-full">
              <div className="flex flex-col justify-between h-full bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
                
                {/* Upper Content */}
                <div>
                  {/* Rating Stars & Quote Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          size={16}
                          className={index < review.rating ? "fill-amber-400 text-amber-400" : "fill-stone-200 text-stone-200"}
                        />
                      ))}
                    </div>
                    <Quote className="text-stone-300" size={24} />
                  </div>

                  {/* Comment */}
                  <p className="text-sm text-stone-700 leading-relaxed italic">
                    "{review.comment}"
                  </p>
                </div>

                {/* Footer User Info */}
                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-3">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-10 h-10 rounded-full object-cover border border-stone-200"
                  />
                  <div className="truncate">
                    <p className="text-sm font-semibold text-stone-900 truncate">
                      {review.name}
                    </p>
                    <p className="text-xs text-stone-500">
                      {review.role} • <span className="text-stone-400">{review.product}</span>
                    </p>
                  </div>
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
}