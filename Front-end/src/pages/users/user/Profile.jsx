function Profile() {
  const user = {
    name: 'Amina Noor',
    email: 'amina.noor@example.com',
    phone: '+1 (555) 123-4567',
    address: '451 Market Street, San Francisco, CA 94105',
    memberSince: 'March 2024',
    orders: 14,
    wishlist: 8,
    savedCards: 2,
    avatar: 'AN',
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-28 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-stone-200">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-500 to-fuchsia-600 text-3xl font-bold text-white shadow-lg shadow-rose-200/50">
                {user.avatar}
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-stone-500">Profile</p>
                <h1 className="mt-2 text-3xl font-semibold text-stone-900">{user.name}</h1>
                <p className="mt-2 text-sm text-stone-600">Member since {user.memberSince}</p>
              </div>
            </div>
            <button className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-900">
              Edit profile
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <section className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-stone-200">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-stone-900">Account details</h2>
                  <p className="mt-2 text-sm text-stone-500">Manage your personal information and account preferences.</p>
                </div>
                <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                  Active
                </span>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">Email</p>
                  <p className="mt-3 text-sm text-stone-900">{user.email}</p>
                </div>
                <div className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">Phone</p>
                  <p className="mt-3 text-sm text-stone-900">{user.phone}</p>
                </div>
                <div className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">Address</p>
                  <p className="mt-3 text-sm text-stone-900">{user.address}</p>
                </div>
                <div className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">Member since</p>
                  <p className="mt-3 text-sm text-stone-900">{user.memberSince}</p>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-stone-200">
              <div>
                <h2 className="text-xl font-semibold text-stone-900">Recent activity</h2>
                <p className="mt-2 text-sm text-stone-500">A quick overview of your latest actions and orders.</p>
              </div>

              <ul className="mt-6 space-y-4">
                <li className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-stone-900">Order #1428 placed</p>
                      <p className="text-sm text-stone-500">Apr 21 · Delivered to 451 Market Street</p>
                    </div>
                    <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-600 ring-1 ring-stone-200">
                      Delivered
                    </span>
                  </div>
                </li>
                <li className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-stone-900">Saved 5 new items to wishlist</p>
                      <p className="text-sm text-stone-500">Apr 18 · Browse your wishlist anytime</p>
                    </div>
                    <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-600 ring-1 ring-stone-200">
                      Wishlist
                    </span>
                  </div>
                </li>
              </ul>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-stone-200">
              <h3 className="text-lg font-semibold text-stone-900">Account summary</h3>
              <div className="mt-6 grid gap-4">
                <div className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-5">
                  <p className="text-sm font-semibold text-stone-900">Orders</p>
                  <p className="mt-3 text-3xl font-bold text-stone-900">{user.orders}</p>
                </div>
                <div className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-5">
                  <p className="text-sm font-semibold text-stone-900">Wishlist</p>
                  <p className="mt-3 text-3xl font-bold text-stone-900">{user.wishlist}</p>
                </div>
                <div className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-5">
                  <p className="text-sm font-semibold text-stone-900">Saved cards</p>
                  <p className="mt-3 text-3xl font-bold text-stone-900">{user.savedCards}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-stone-200">
              <h3 className="text-lg font-semibold text-stone-900">Saved address</h3>
              <p className="mt-4 text-sm text-stone-600">{user.address}</p>
              <button className="mt-6 w-full rounded-full bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-900">
                Manage addresses
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Profile;
