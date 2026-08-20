import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Home from "./pages/users/landingPage/Home";

import AllProducts from "./pages/users/product/AllProducts";
import CategoryProducts from "./pages/users/product/CategoryProducts";
import ProductDetails from "./pages/users/product/ProductDetails";

import Header from "./components/Header";
import Footer from "./components/Footer";

import ContactUs from "./pages/users/companyInfo/ContactUs";
import Profile from "./pages/users/user/Profile";
import WishList from "./pages/users/user/WishList";
import Cart from "./pages/users/product/Cart";
import OrderList from "./pages/users/user/OrderList";

import Login from "./pages/users/auth/Login";
import Register from "./pages/users/auth/Register";


/*
|--------------------------------------------------------------------------
| Protected Route
|--------------------------------------------------------------------------
*/

function ProtectedRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem("token");

  return isLoggedIn ? (
    children
  ) : (
    <Navigate
      to="/login"
      replace
    />
  );
}


/*
|--------------------------------------------------------------------------
| App
|--------------------------------------------------------------------------
*/

function App() {
  const location = useLocation();


  /*
  |--------------------------------------------------------------------------
  | Hide Header/Footer On Login/Register
  |--------------------------------------------------------------------------
  */

  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/register";


  return (
    <div className="flex min-h-screen flex-col mt-12">

      {/* =========================================================
          HEADER
      ========================================================== */}

      {!hideLayout && <Header />}


      {/* =========================================================
          MAIN
      ========================================================== */}

      <main className="flex-grow">

        <Routes>

          {/* =====================================================
              PUBLIC ROUTES
          ====================================================== */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />


          {/* =====================================================
              ALL PRODUCTS
          ====================================================== */}

          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <AllProducts />
              </ProtectedRoute>
            }
          />


          {/* =====================================================
              CATEGORY PRODUCTS
              
              Examples:
              /category/men
              /category/women
              /category/shoes
              /category/bags
              /category/watches
              /category/accessories
          ====================================================== */}

          <Route
            path="/category/:category"
            element={
              <ProtectedRoute>
                <CategoryProducts />
              </ProtectedRoute>
            }
          />


          {/* =====================================================
              PRODUCT DETAILS
              
              Example:
              /products/1
          ====================================================== */}

          <Route
            path="/products/:id"
            element={
              <ProtectedRoute>
                <ProductDetails />
              </ProtectedRoute>
            }
          />


          {/* =====================================================
              CONTACT
          ====================================================== */}

          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <ContactUs />
              </ProtectedRoute>
            }
          />


          {/* =====================================================
              PROFILE
          ====================================================== */}

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />


          {/* =====================================================
              WISHLIST
          ====================================================== */}

          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <WishList />
              </ProtectedRoute>
            }
          />


          {/* =====================================================
              CART
          ====================================================== */}

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />


          {/* =====================================================
              ORDERS
          ====================================================== */}

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrderList />
              </ProtectedRoute>
            }
          />


          {/* =====================================================
              FALLBACK
          ====================================================== */}

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>

      </main>


      {/* =========================================================
          FOOTER
      ========================================================== */}

      {!hideLayout && <Footer />}

    </div>
  );
}

export default App;