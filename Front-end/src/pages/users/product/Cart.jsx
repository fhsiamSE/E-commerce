function Cart() {
  const cartItems = [
    {
      id: 1,
      name: 'Classic Leather Jacket',
      price: 149.99,
      qty: 1,
      image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=500&q=60',
      color: 'Black',
      size: 'M',
    },
    {
      id: 2,
      name: 'Modern Runner Sneakers',
      price: 89.99,
      qty: 2,
      image: 'https://images.unsplash.com/photo-1528701800489-20e969d71f62?auto=format&fit=crop&w=500&q=60',
      color: 'White',
      size: '42',
    },
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0)
  const shipping = 12.5
  const discount = 15.0
  const total = subtotal + shipping - discount

  return (
    <div className="min-h-screen bg-stone-50 pt-8 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-stone-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-stone-500">Shopping cart</p>
              <h1 className="mt-2 text-3xl font-semibold text-stone-900">Your cart</h1>
              <p className="mt-2 text-sm text-stone-600">Review items, update quantity, and proceed to checkout.</p>
            </div>
            <span className="inline-flex rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">
              {cartItems.length} items in cart
            </span>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.65fr_0.95fr]">
          <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-stone-200">
            <div className="overflow-hidden rounded-[1.75rem] border border-stone-200">
              <div className="bg-stone-100 px-6 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-stone-600">
                Cart items
              </div>
              <div className="divide-y divide-stone-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="h-24 w-24 rounded-3xl object-cover" />
                      <div>
                        <h2 className="text-lg font-semibold text-stone-900">{item.name}</h2>
                        <p className="mt-2 text-sm text-stone-500">Color: {item.color} · Size: {item.size}</p>
                        <p className="mt-2 text-sm font-semibold text-stone-900">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4 sm:w-72">
                      <div className="flex items-center rounded-full border border-stone-200 bg-stone-50 px-3 py-2">
                        <button className="text-stone-500 hover:text-stone-700" type="button">−</button>
                        <span className="mx-4 text-sm font-semibold text-stone-900">{item.qty}</span>
                        <button className="text-stone-500 hover:text-stone-700" type="button">+</button>
                      </div>
                      <button className="rounded-full bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100" type="button">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-stone-200">
              <h2 className="text-xl font-semibold text-stone-900">Order summary</h2>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-sm text-stone-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-stone-600">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-stone-600">
                  <span>Discount</span>
                  <span className="text-emerald-700">-${discount.toFixed(2)}</span>
                </div>
                <div className="border-t border-stone-200 pt-4 text-lg font-semibold text-stone-900 flex items-center justify-between">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <button className="mt-6 w-full rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-900">
                Proceed to checkout
              </button>
            </section>

            <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-stone-200">
              <h3 className="text-lg font-semibold text-stone-900">Promo code</h3>
              <p className="mt-2 text-sm text-stone-500">Apply a discount code to your order before checkout.</p>
              <div className="mt-4 flex gap-3">
                <input type="text" placeholder="Enter code" className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-black" />
                <button className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-900" type="button">
                  Apply
                </button>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Cart;
