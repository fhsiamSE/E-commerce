import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/auth/authSlice.js";
import { getCart } from "../store/cartSlice.js";

const Header = () => {
  const [showHeader, setShowHeader] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);

  const lastScrollY = useRef(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | Auth State
  |--------------------------------------------------------------------------
  */

  const { isAuthenticated } = useSelector(
    (state) => state.auth
  );

  /*
  |--------------------------------------------------------------------------
  | Cart State
  |--------------------------------------------------------------------------
  */

  const cartItems = useSelector(
    (state) => state.cart.items
  );

  /*
  |--------------------------------------------------------------------------
  | Get Cart When User Is Logged In
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCart());
    }
  }, [dispatch, isAuthenticated]);

  /*
  |--------------------------------------------------------------------------
  | Cart Count
  |--------------------------------------------------------------------------
  |
  | Example:
  |
  | T-shirt quantity = 2
  | Hoodie quantity = 1
  |
  | Cart count = 3
  |
  |--------------------------------------------------------------------------
  */

  const cartCount = cartItems.reduce(
    (total, item) => {
      return total + Number(item.quantity || 0);
    },
    0
  );

  /*
  |--------------------------------------------------------------------------
  | Hide Header On Scroll
  |--------------------------------------------------------------------------
  */

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

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Logout
  |--------------------------------------------------------------------------
  */

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();

      setProfileMenu(false);
      setMobileMenu(false);

      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);

      /*
      |--------------------------------------------------------------------------
      | Remove Local Authentication Data
      |--------------------------------------------------------------------------
      */

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setProfileMenu(false);
      setMobileMenu(false);

      navigate("/login");
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-white/95 shadow-lg backdrop-blur-md transition-transform duration-300 ${
        showHeader
          ? "translate-y-0"
          : "-translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">

        {/* =========================================================
            LOGO
        ========================================================= */}

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

        {/* =========================================================
            DESKTOP MENU
        ========================================================= */}

        <nav className="hidden items-center gap-6 text-sm font-semibold text-gray-700 md:flex">

          <Link
            to="/"
            className="hover:text-black"
          >
            Home
          </Link>

          <Link
            to="/products"
            className="hover:text-black"
          >
            Products
          </Link>

          <a
            href="#"
            className="flex items-center gap-1 hover:text-black"
          >
            <span>Hot Deals</span>
            <span>🔥</span>
          </a>

          <Link
            to="/contact"
            className="hover:text-black"
          >
            Contact
          </Link>

        </nav>

        {/* =========================================================
            RIGHT SIDE
        ========================================================= */}

        <div className="flex items-center gap-2">

          {/* =======================================================
              SEARCH
          ======================================================= */}

          <label className="hidden items-center gap-2 rounded-full border border-gray-300 bg-gray-50 px-3 py-2 text-sm md:flex">

            🔍

            <input
              type="text"
              placeholder="Search"
              className="w-28 bg-transparent outline-none"
            />

          </label>

          {/* =======================================================
              WISHLIST
          ======================================================= */}

          <Link
            to="/wishlist"
            className="rounded-full p-2 hover:bg-gray-100"
          >
            ❤
          </Link>

          {/* =======================================================
              CART
          ======================================================= */}

          <Link
            to="/cart"
            className="relative rounded-full p-2 hover:bg-gray-100"
          >

            {/* Cart Icon */}

            <span className="text-xl">
              🛒
            </span>

            {/* =====================================================
                CART BADGE
            ===================================================== */}

            {cartCount > 0 && (
              <span
                className="
                  absolute
                  -right-1
                  -top-1
                  flex
                  h-5
                  min-w-5
                  items-center
                  justify-center
                  rounded-full
                  bg-red-500
                  px-1
                  text-[10px]
                  font-bold
                  leading-none
                  text-white
                "
              >
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}

          </Link>

          {/* =======================================================
              PROFILE DROPDOWN
          ======================================================= */}

          <div className="relative">

            <button
              type="button"
              onClick={() =>
                setProfileMenu(!profileMenu)
              }
              className="rounded-full p-2 hover:bg-gray-100"
            >
              👤
            </button>

            {profileMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-md border bg-white py-2 shadow-lg">

                <Link
                  to="/profile"
                  onClick={() =>
                    setProfileMenu(false)
                  }
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  View Profile
                </Link>

                
                <Link
                  to="/orders"
                  onClick={() =>
                    setProfileMenu(false)
                  }
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Order List
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>

              </div>
            )}

          </div>

          {/* =======================================================
              MOBILE MENU BUTTON
          ======================================================= */}

          <button
            type="button"
            onClick={() =>
              setMobileMenu(!mobileMenu)
            }
            className="rounded-md p-2 hover:bg-gray-100 md:hidden"
          >
            {mobileMenu ? (
              <span className="text-2xl">
                ✕
              </span>
            ) : (
              <span className="text-2xl">
                ☰
              </span>
            )}
          </button>

        </div>
      </div>

      {/* =========================================================
          MOBILE MENU
      ========================================================= */}

      <div
        className={`overflow-hidden bg-white transition-all duration-300 md:hidden ${
          mobileMenu
            ? "max-h-96 border-t"
            : "max-h-0"
        }`}
      >

        <div className="space-y-2 p-4">

          {/* Mobile Search */}

          <input
            type="text"
            placeholder="Search products..."
            className="w-full rounded-lg border p-2 outline-none"
          />

          {/* Home */}

          <Link
            to="/"
            onClick={() =>
              setMobileMenu(false)
            }
            className="block rounded px-2 py-2 hover:bg-gray-100"
          >
            Home
          </Link>

          {/* Products */}

          <Link
            to="/products"
            onClick={() =>
              setMobileMenu(false)
            }
            className="block rounded px-2 py-2 hover:bg-gray-100"
          >
            Products
          </Link>

          {/* Cart */}

          <Link
            to="/cart"
            onClick={() =>
              setMobileMenu(false)
            }
            className="flex items-center justify-between rounded px-2 py-2 hover:bg-gray-100"
          >

            <span>
              Cart
            </span>

            {cartCount > 0 && (
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-2 text-xs font-bold text-white">
                {cartCount > 99
                  ? "99+"
                  : cartCount}
              </span>
            )}

          </Link>

          {/* Wishlist */}

          <Link
            to="/wishlist"
            onClick={() =>
              setMobileMenu(false)
            }
            className="block rounded px-2 py-2 hover:bg-gray-100"
          >
            Wishlist
          </Link>

          {/* Profile */}

          <Link
            to="/profile"
            onClick={() =>
              setMobileMenu(false)
            }
            className="block rounded px-2 py-2 hover:bg-gray-100"
          >
            Profile
          </Link>

          {/* Logout */}

          <button
            type="button"
            onClick={handleLogout}
            className="block w-full rounded px-2 py-2 text-left hover:bg-gray-100"
          >
            Logout
          </button>

          {/* Contact */}

          <Link
            to="/contact"
            onClick={() =>
              setMobileMenu(false)
            }
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