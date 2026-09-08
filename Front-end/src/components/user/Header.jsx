import { useEffect, useRef, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../store/auth/authSlice.js";
import { getCart } from "../../store/cartSlice.js";
import shopLogo from "../../assets/images/shopLogo.png";

const Header = () => {
  const [showHeader, setShowHeader] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const [search, setSearch] = useState("");

  const lastScrollY = useRef(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  /*
  |--------------------------------------------------------------------------
  | Auth State
  |--------------------------------------------------------------------------
  */

  const { isAuthenticated, user } = useSelector(
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

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setProfileMenu(false);
      setMobileMenu(false);

      navigate("/login");
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Login
  |--------------------------------------------------------------------------
  */

  const handleLogin = () => {
    setProfileMenu(false);
    setMobileMenu(false);
    navigate("/login");
  };

  /*
  |--------------------------------------------------------------------------
  | Signup
  |--------------------------------------------------------------------------
  */

  const handleSignup = () => {
    setProfileMenu(false);
    setMobileMenu(false);
    navigate("/register");
  };

  /*
  |--------------------------------------------------------------------------
  | Search Sync
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const searchParam =
      new URLSearchParams(location.search).get("search") || "";

    setSearch(searchParam);
  }, [location.search]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const trimmedSearch = search.trim();

    setProfileMenu(false);
    setMobileMenu(false);

    if (trimmedSearch) {
      navigate(`/products?search=${encodeURIComponent(trimmedSearch)}`);
      return;
    }

    navigate("/products");
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
        ========================================================== */}

        <div className="flex items-center">

          <Link to="/" className="flex items-center">
            <img
              src={shopLogo}
              alt="Shop logo"
              className="h-14 w-16"
            />
          </Link>

          <Link
            to="/"
            className="text-xs font-bold tracking-wide text-gray-900 sm:text-base"
          >
            Sarima Super Mart
          </Link>

        </div>

        {/* =========================================================
            DESKTOP MENU
        ========================================================== */}

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
        ========================================================== */}

        <div className="flex items-center gap-2">

          {/* =======================================================
              SEARCH
          ======================================================= */}

          <form
            onSubmit={handleSearchSubmit}
            className="hidden items-center gap-2 rounded-full border border-gray-300 bg-gray-50 px-3 py-2 text-sm md:flex"
          >

            <button type="submit" className="text-base" aria-label="Search products">
              🔍
            </button>

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search"
              className="w-28 bg-transparent outline-none"
            />

          </form>

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

            <span className="text-xl">
              🛒
            </span>

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
              AUTH / PROFILE
          ======================================================= */}

          {isAuthenticated ? (

            /* =====================================================
                LOGGED IN
            ====================================================== */

            <div className="relative">

              <button
                type="button"
                onClick={() =>
                  setProfileMenu(!profileMenu)
                }
                className="rounded-full p-2 hover:bg-gray-100"
                aria-label="Profile menu"
              >
                👤
              </button>

              {profileMenu && (
                <div className="absolute right-0 mt-2 w-52 rounded-md border bg-white py-2 shadow-lg">

                  {/* User name */}

                  {user?.name && (
                    <div className="border-b px-4 py-3">

                      <p className="text-sm font-semibold text-gray-900">
                        {user.name}
                      </p>

                      {user?.email && (
                        <p className="mt-1 truncate text-xs text-gray-500">
                          {user.email}
                        </p>
                      )}

                    </div>
                  )}

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

          ) : (

            /* =====================================================
                NOT LOGGED IN
            ====================================================== */

            <div className="hidden items-center gap-2 md:flex">

              <button
                type="button"
                onClick={handleLogin}
                className="rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Login
              </button>

            </div>

          )}

          {/* =======================================================
              MOBILE MENU BUTTON
          ======================================================= */}

          <button
            type="button"
            onClick={() =>
              setMobileMenu(!mobileMenu)
            }
            className="rounded-md p-2 hover:bg-gray-100 md:hidden"
            aria-label="Toggle menu"
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
      ========================================================== */}

      <div
        className={`overflow-hidden bg-white transition-all duration-300 md:hidden ${
          mobileMenu
            ? "max-h-[600px] border-t"
            : "max-h-0"
        }`}
      >

        <div className="space-y-2 p-4">

          {/* =====================================================
              Mobile Search
          ====================================================== */}

          <form onSubmit={handleSearchSubmit} className="w-full">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
              className="w-full rounded-lg border p-2 outline-none"
            />
          </form>

          {/* =====================================================
              Home
          ====================================================== */}

          <Link
            to="/"
            onClick={() =>
              setMobileMenu(false)
            }
            className="block rounded px-2 py-2 hover:bg-gray-100"
          >
            Home
          </Link>

          {/* =====================================================
              Products
          ====================================================== */}

          <Link
            to="/products"
            onClick={() =>
              setMobileMenu(false)
            }
            className="block rounded px-2 py-2 hover:bg-gray-100"
          >
            Products
          </Link>

          {/* =====================================================
              Cart
          ====================================================== */}

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

          {/* =====================================================
              Wishlist
          ====================================================== */}

          <Link
            to="/wishlist"
            onClick={() =>
              setMobileMenu(false)
            }
            className="block rounded px-2 py-2 hover:bg-gray-100"
          >
            Wishlist
          </Link>

          {/* =====================================================
              AUTHENTICATED MOBILE MENU
          ====================================================== */}

          {isAuthenticated ? (

            <>
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

              {/* Orders */}

              <Link
                to="/orders"
                onClick={() =>
                  setMobileMenu(false)
                }
                className="block rounded px-2 py-2 hover:bg-gray-100"
              >
                Order List
              </Link>

              {/* Logout */}

              <button
                type="button"
                onClick={handleLogout}
                className="block w-full rounded px-2 py-2 text-left hover:bg-gray-100"
              >
                Logout
              </button>
            </>

          ) : (

            /* =================================================
                NOT AUTHENTICATED
            ================================================== */

            <div className="space-y-2 border-t pt-3">

              <button
                type="button"
                onClick={handleLogin}
                className="block w-full bg-blue-500 text-white rounded border border-gray-300 px-4 py-2 text-left text-sm font-medium hover:bg-blue-600"
              >
                Login
              </button>

            </div>

          )}


        </div>
      </div>
    </header>
  );
};

export default Header;