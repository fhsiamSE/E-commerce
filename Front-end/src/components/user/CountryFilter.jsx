import { Link } from "react-router-dom";
import { COUNTRIES } from "../../utils/countries.js";

const HOME_COUNTRIES = COUNTRIES.slice(0, 4);

function CountryFilter() {
  return (
    <section className="mx-auto my-8 w-full max-w-6xl px-4" aria-labelledby="country-filter-title">
      <div className="mb-5 text-center sm:text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-stone-500">
          Explore products by origin
        </p>
        <h2 id="country-filter-title" className="mt-1 text-xl font-bold text-stone-900 sm:text-2xl">
          Shop by Country
        </h2>
      </div>

      <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
        {HOME_COUNTRIES.map((country) => (
          <Link
            key={country.code}
            to={`/country/${country.code}`}
            className="group flex min-h-20 min-w-0 flex-col items-center justify-center rounded-xl border border-stone-200 bg-white p-1.5 text-center shadow-sm transition hover:-translate-y-1 hover:border-stone-400 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-500 sm:min-h-32 sm:rounded-2xl sm:p-3 md:min-h-36 md:p-4"
          >
            <img
              src={country.flag}
              alt={`${country.name} flag`}
              className="h-7 w-10 rounded object-cover shadow-sm transition group-hover:scale-105 sm:h-12 sm:w-16 sm:rounded-md"
              loading="lazy"
            />
            <span className="mt-1 w-full break-words text-[9px] font-semibold leading-tight text-stone-800 sm:mt-3 sm:text-sm">
              {country.name}
            </span>
          </Link>
        ))}

        <Link
          to="/country/all"
          className="group flex min-h-20 min-w-0 flex-col items-center justify-center rounded-xl border border-stone-200 bg-white p-1.5 text-center shadow-sm transition hover:-translate-y-1 hover:border-stone-400 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-500 sm:min-h-32 sm:rounded-2xl sm:p-3 md:min-h-36 md:p-4"
        >
          <div className="grid h-7 w-10 grid-cols-3 gap-0.5 overflow-hidden rounded shadow-sm transition group-hover:scale-105 sm:h-12 sm:w-16 sm:rounded-md">
            {COUNTRIES.map((country) => (
              <img
                key={country.code}
                src={country.flag}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ))}
          </div>
          <span className="mt-1 w-full break-words text-[9px] font-semibold leading-tight text-stone-800 sm:mt-3 sm:text-sm">
            All
          </span>
        </Link>
      </div>
    </section>
  );
}

export default CountryFilter;
