import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../../api/axios.js";
import Product from "../../../components/user/product";
import { COUNTRIES } from "../../../utils/countries.js";

function CountryProducts() {
  const { country: countryCode } = useParams();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const country = COUNTRIES.find((item) => item.code === countryCode);
  const title = country ? `${country.name} ` : "Select a Country";

  useEffect(() => {
    let active = true;

    if (countryCode === "all") {
      setProducts([]);
      setLoading(false);
      setError("");
      return () => {
        active = false;
      };
    }

    const fetchCountryProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/products", {
          params: {
            ...(countryCode !== "all" ? { country: countryCode } : {}),
            page: currentPage,
            per_page: 20,
          },
        });

        if (!active) return;

        const pagination = response.data?.data;
        setProducts(Array.isArray(pagination?.data) ? pagination.data : []);
        setCurrentPage(pagination?.current_page || 1);
        setLastPage(pagination?.last_page || 1);
      } catch (requestError) {
        if (active) {
          setError(requestError.response?.data?.message || "Unable to load products.");
          setProducts([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchCountryProducts();

    return () => {
      active = false;
    };
  }, [countryCode, currentPage]);

  const changePage = (page) => {
    if (page < 1 || page > lastPage || loading) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (countryCode !== "all" && !country) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-stone-900">Country not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-[50vh] bg-white">
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-stone-500">Browse by country</p>
          <h1 className="mt-1 text-2xl font-bold text-stone-900">{title}</h1>
        </div>
      </div>

      {countryCode === "all" ? (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <p className="mb-5 text-sm text-stone-600">
            Select a country to browse products from that country.
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {COUNTRIES.map((item) => (
              <Link
                key={item.code}
                to={`/country/${item.code}`}
                className="group flex min-h-40 flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-stone-400 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-500"
              >
                <img
                  src={item.flag}
                  alt={`${item.name} flag`}
                  className="h-14 w-20 rounded-md object-cover shadow-sm transition group-hover:scale-105"
                  loading="lazy"
                />
                <span className="mt-4 text-sm font-semibold text-stone-800">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : loading && products.length === 0 ? (
        <div className="flex min-h-64 items-center justify-center text-sm text-stone-500">Loading products…</div>
      ) : error ? (
        <div className="mx-auto max-w-2xl px-4 py-16 text-center text-sm text-red-600">{error}</div>
      ) : products.length === 0 ? (
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <p className="text-4xl">🛍️</p>
          <h2 className="mt-4 text-xl font-semibold text-stone-900">No products found</h2>
          <p className="mt-2 text-sm text-stone-500">No products are currently assigned to this country.</p>
        </div>
      ) : (
        <>
          <Product products={products} slider={false} />
          {lastPage > 1 && (
            <div className="flex items-center justify-center gap-3 py-8">
              <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1 || loading} className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50">Previous</button>
              <span className="text-sm text-stone-600">Page {currentPage} of {lastPage}</span>
              <button onClick={() => changePage(currentPage + 1)} disabled={currentPage === lastPage || loading} className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CountryProducts;
