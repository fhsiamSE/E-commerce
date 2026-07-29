function WishList() {
  const wishlistItems = [
    {
      id: 1,
      name: 'Parisian Satin Dress',
      price: 74.99,
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=500&q=60',
      badge: 'Trending',
    },
    {
      id: 2,
      name: 'Retro Aviator Sunglasses',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1518546305923-9bbd840e9fce?auto=format&fit=crop&w=500&q=60',
      badge: 'Best seller',
    },
  ]

  return (
    <div className="min-h-screen bg-stone-50 pt-8 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-stone-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-stone-500">Wishlist</p>
              <h1 className="mt-2 text-3xl font-semibold text-stone-900">Saved favorites</h1>
              <p className="mt-2 text-sm text-stone-600">Keep track of items you love and move them to cart when ready.</p>
            </div>
            <span className="inline-flex rounded-full bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700">
              {wishlistItems.length} saved items
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {wishlistItems.map((item) => (
            <div key={item.id} className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <img src={item.image} alt={item.name} className="h-36 w-full rounded-3xl object-cover sm:w-40" />
                <div className="flex-1">
                  <span className="inline-flex rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-stone-600">
                    {item.badge}
                  </span>
                  <h2 className="mt-4 text-xl font-semibold text-stone-900">{item.name}</h2>
                  <p className="mt-3 text-lg font-semibold text-stone-900">${item.price.toFixed(2)}</p>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <button className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-900" type="button">
                      Add to cart
                    </button>
                    <button className="rounded-full border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:border-black hover:text-black" type="button">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <section className="mt-8 rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-stone-200">
          <h2 className="text-xl font-semibold text-stone-900">Wishlist tips</h2>
          <p className="mt-3 text-sm text-stone-500">Check your favorites before sale events and move items to cart for faster checkout.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-5">
              <h3 className="text-sm font-semibold text-stone-900">Save time</h3>
              <p className="mt-2 text-sm text-stone-600">Keep your preferred items ready for future promotions and restocks.</p>
            </div>
            <div className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-5">
              <h3 className="text-sm font-semibold text-stone-900">Stay organized</h3>
              <p className="mt-2 text-sm text-stone-600">Group your wishlist picks by occasion or price range as you browse.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default WishList;
