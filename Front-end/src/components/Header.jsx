import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

const Header = () => {
  const [showHeader, setShowHeader] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);

  const lastScrollY = useRef(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();


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


  const handleLogout = async () => {
    await dispatch(logout());

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setProfileMenu(false);

    navigate("/login");
  };


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

          <Link
            to="/"
            className="text-lg font-bold tracking-wide text-gray-900 sm:text-xl"
          >
            E-Commerce
          </Link>
        </div>


        {/* Desktop Menu */}
        <nav className="hidden items-center gap-6 text-sm font-semibold text-gray-700 md:flex">

          <Link to="/" className="hover:text-black">
            Home
          </Link>


          <Link to="/products" className="hover:text-black">
            Products
          </Link>


          <a href="#" className="flex items-center gap-1 hover:text-black">
            <span>Hot Deals</span>
            <span>🔥</span>
          </a>


          <Link to="/contact" className="hover:text-black">
            Contact
          </Link>

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



          <Link
            to="/wishlist"
            className="rounded-full p-2 hover:bg-gray-100"
          >
            ❤
          </Link>



          <Link
            to="/cart"
            className="rounded-full p-2 hover:bg-gray-100"
          >
            🛒
          </Link>



          {/* Profile Dropdown */}
          <div className="relative">

            <button
              onClick={() => setProfileMenu(!profileMenu)}
              className="rounded-full p-2 hover:bg-gray-100"
            >
              👤
            </button>


            {profileMenu && (

              <div className="absolute right-0 mt-2 w-48 rounded-md border bg-white py-2 shadow-lg">


                <Link
                  to="/profile"
                  onClick={() => setProfileMenu(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  View Profile
                </Link>



                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>


              </div>

            )}

          </div>



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


          <input
            type="text"
            placeholder="Search products..."
            className="w-full rounded-lg border p-2 outline-none"
          />



          <Link
            to="/"
            onClick={() => setMobileMenu(false)}
            className="block rounded px-2 py-2 hover:bg-gray-100"
          >
            Home
          </Link>



          <Link
            to="/products"
            onClick={() => setMobileMenu(false)}
            className="block rounded px-2 py-2 hover:bg-gray-100"
          >
            Products
          </Link>



          <Link
            to="/profile"
            onClick={() => setMobileMenu(false)}
            className="block rounded px-2 py-2 hover:bg-gray-100"
          >
            Profile
          </Link>



          <button
            onClick={handleLogout}
            className="block w-full rounded px-2 py-2 text-left hover:bg-gray-100"
          >
            Logout
          </button>



          <Link
            to="/contact"
            onClick={() => setMobileMenu(false)}
            className="block rounded px-2 py-2 hover:bg-gray-100"
          >
            Contact
          </Link>


        </div>

      </div>


    </header>
  );
};


export default Header;