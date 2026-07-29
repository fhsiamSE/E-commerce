import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [showHeader, setShowHeader] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;

      if (current < 10) {
        setShowHeader(true);
      } else {
        setShowHeader(current < lastScrollY.current);
      }

      lastScrollY.current = current;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg transition-transform duration-300 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-lg font-bold text-white">
            E
          </div>

          <a href="#" className="text-lg font-bold tracking-wide text-gray-900 sm:text-xl">
            E-Commerce
          </a>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden items-center gap-6 text-sm font-semibold text-gray-700 md:flex">
          <Link to="/" className="hover:text-black">Home</Link>

          <div className="group relative">
            <Link to="/products" className="hover:text-black">Products</Link>

            {/* <div className="absolute left-0 top-full mt-2 hidden w-44 rounded-md border border-gray-200 bg-white p-2 shadow-lg group-hover:block">
              <a href="#" className="block rounded px-3 py-2 hover:bg-gray-100">
                Men
              </a>

              <a href="#" className="block rounded px-3 py-2 hover:bg-gray-100">
                Women
              </a>

              <a href="#" className="block rounded px-3 py-2 hover:bg-gray-100">
                Kids
              </a>
            </div> */}
          </div>

          <a href="#" className="flex items-center gap-1 hover:text-black">
            <span>Hot Deals</span>
            <span>🔥</span>
          </a>

          <a href="#" className="hover:text-black">
            Contact us
          </a>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <label className="hidden items-center gap-2 rounded-full border border-gray-300 bg-gray-50 px-3 py-2 text-sm md:flex">
            🔍
            <input
              type="text"
              placeholder="Search"
              className="w-28 bg-transparent outline-none"
            />
          </label>

          <button className="rounded-full p-2 hover:bg-gray-100">❤</button>
          <button className="rounded-full p-2 hover:bg-gray-100">🛒</button>
          <button className="rounded-full p-2 hover:bg-gray-100">👤</button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="rounded-md p-2 hover:bg-gray-100 md:hidden"
          >
            {mobileMenu ? (
              <span className="text-2xl">✕</span>
            ) : (
              <span className="text-2xl">☰</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden bg-white transition-all duration-300 md:hidden ${
          mobileMenu ? "max-h-96 border-t" : "max-h-0"
        }`}
      >
        <div className="space-y-2 p-4">
          {/* Mobile Search */}
          <input
            type="text"
            placeholder="Search products..."
            className="w-full rounded-lg border p-2 outline-none"
          />

          <a
            href="#"
            onClick={() => setMobileMenu(false)}
            className="block rounded px-2 py-2 hover:bg-gray-100"
          >
            Home
          </a>

          <div>
            <p className="px-2 py-2 font-semibold">Products</p>

            <div className="ml-4 space-y-1">
              <a
                href="#"
                onClick={() => setMobileMenu(false)}
                className="block rounded px-2 py-2 hover:bg-gray-100"
              >
                Men
              </a>

              <a
                href="#"
                onClick={() => setMobileMenu(false)}
                className="block rounded px-2 py-2 hover:bg-gray-100"
              >
                Women
              </a>

              <a
                href="#"
                onClick={() => setMobileMenu(false)}
                className="block rounded px-2 py-2 hover:bg-gray-100"
              >
                Kids
              </a>
            </div>
          </div>

          <a
            href="#"
            onClick={() => setMobileMenu(false)}
            className="block rounded px-2 py-2 hover:bg-gray-100"
          >
            Hot Deal
          </a>

          <a
            href="#"
            onClick={() => setMobileMenu(false)}
            className="block rounded px-2 py-2 hover:bg-gray-100"
          >
            Contact
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
