import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// User pages
import Home from "../pages/users/landingPage/Home";

import AllProducts from "../pages/users/product/AllProducts";
import CategoryProducts from "../pages/users/product/CategoryProducts";
import ProductDetails from "../pages/users/product/ProductDetails";

import ContactUs from "../pages/users/companyInfo/ContactUs";
import Profile from "../pages/users/user/Profile";
import WishList from "../pages/users/user/WishList";
import Cart from "../pages/users/product/Cart";
import OrderList from "../pages/users/user/OrderList";

import Login from "../pages/users/auth/Login";
import Register from "../pages/users/auth/Register";


// =========================================================
// PROTECTED USER ROUTE
// =========================================================

function ProtectedRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem("token");

  return isLoggedIn ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
}


// =========================================================
// USER ROUTES
// =========================================================

function UserRoutes() {
  return (
    <Routes>

      {/* =====================================================
          HOME
      ====================================================== */}

      <Route
        path="/"
        element={<Home />}
      />


      {/* =====================================================
          AUTH
      ====================================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />


      {/* =====================================================
          PRODUCTS
      ====================================================== */}

      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <AllProducts />
          </ProtectedRoute>
        }
      />


      <Route
        path="/category/:category"
        element={
          <ProtectedRoute>
            <CategoryProducts />
          </ProtectedRoute>
        }
      />


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
  );
}

export default UserRoutes;