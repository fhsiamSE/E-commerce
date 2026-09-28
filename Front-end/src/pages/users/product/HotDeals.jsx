import { Link } from "react-router-dom";

function HotDeals() {
	return (
		<main className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-orange-50 via-white to-rose-50 px-4 py-6 sm:py-8">
			<section className="mx-auto flex min-h-[55vh] max-w-5xl items-center justify-center overflow-hidden rounded-[2rem] border border-orange-100 bg-white px-5 py-9 text-center shadow-xl shadow-orange-950/5 sm:px-10">
				<div className="max-w-2xl">
					<div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-100 text-3xl shadow-inner">
						🔥
					</div>

					<p className="text-xs font-bold uppercase tracking-[0.35em] text-orange-600 sm:text-sm">
						Something exciting is cooking
					</p>

					<h1 className="mt-3 text-3xl font-black tracking-tight text-gray-950 sm:text-5xl">
						Hot Deals
						<span className="mt-2 block bg-gradient-to-r from-orange-500 to-rose-600 bg-clip-text text-transparent">
							Coming Soon
						</span>
					</h1>

					<p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-600 sm:text-base">
						We’re preparing fresh offers and special prices for you. Check back
						soon so you don’t miss out on the best deals.
					</p>

					<Link
						to="/products"
						className="mt-6 inline-flex items-center justify-center rounded-full bg-gray-950 px-7 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-200"
					>
						Explore all products
						<span aria-hidden="true" className="ml-2">→</span>
					</Link>

					<p className="mt-4 text-xs font-medium text-gray-400">
						Great savings are on their way.
					</p>
				</div>
			</section>
		</main>
	);
}

export default HotDeals;
