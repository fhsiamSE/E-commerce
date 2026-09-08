import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// =========================================================
// ADMIN LAYOUT
// =========================================================

import AdminLayout from "../components/admin/AdminLayout";

// =========================================================
// ADMIN LOGIN
// =========================================================

import AdminLogin from "../pages/admin/auth/AdminLogin";

// =========================================================
// ADMIN PAGES
// =========================================================

import AdminDashboard from "../pages/admin/Dashboard/Dashboard";

import AdminProducts from "../pages/admin/Products/Products";
import AddProduct from "../pages/admin/Products/AddProduct";
import EditProduct from "../pages/admin/Products/EditProduct";

import AdminOrders from "../pages/admin/Orders/Orders";
import OrderDetails from "../pages/admin/Orders/OrderDetails";

import AdminUsers from "../pages/admin/Users/Users";

import AdminReviews from "../pages/admin/Reviews/Reviews";

import AdminSettings from "../pages/admin/Settings/Settings";
import AddAd from "../pages/admin/Ads/AddAd";
import Ads from "../pages/admin/Ads/Ads";



// =========================================================
// ADMIN PROTECTED ROUTE
// =========================================================

function AdminProtectedRoute({ children }) {

  const isLoggedIn = !!localStorage.getItem("token");

  if (!isLoggedIn) {

    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );

  }

  return children;
}


// =========================================================
// ADMIN ROUTES
// =========================================================

function AdminRoutes() {

  return (
    <Routes>

      {/* =====================================================
          ADMIN LOGIN
          PUBLIC ROUTE
      ====================================================== */}

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />


      {/* =====================================================
          ADMIN PANEL
          PROTECTED ROUTES
      ====================================================== */}

      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >

        {/* =================================================
            DASHBOARD

            URL:
            /admin
        ================================================== */}

        <Route
          index
          element={
            <AdminDashboard />
          }
        />


        {/* =================================================
            PRODUCTS

            /admin/products
        ================================================== */}

        <Route
          path="products"
          element={
            <AdminProducts />
          }
        />


        {/* =================================================
            ADD PRODUCT

            /admin/products/add
        ================================================== */}

        <Route
          path="products/add"
          element={
            <AddProduct />
          }
        />

        <Route
          path="ads"
          element={
            <Ads />
          }
        />

        <Route
          path="ads/add"
          element={
            <AddAd />
          }
        />

        <Route
          path="ads/edit/:id"
          element={
            <AddAd />
          }
        />


        {/* =================================================
            EDIT PRODUCT

            /admin/products/edit/1
        ================================================== */}

        <Route
          path="products/edit/:id"
          element={
            <EditProduct />
          }
        />


        {/* =================================================
            ORDERS

            /admin/orders
        ================================================== */}

        <Route
          path="orders"
          element={
            <AdminOrders />
          }
        />


        {/* =================================================
            ORDER DETAILS

            /admin/orders/1
        ================================================== */}

        <Route
          path="orders/:id"
          element={
            <OrderDetails />
          }
        />


        {/* =================================================
            USERS

            /admin/users
        ================================================== */}

        <Route
          path="users"
          element={
            <AdminUsers />
          }
        />


        {/* =================================================
            REVIEWS

            /admin/reviews
        ================================================== */}

        <Route
          path="reviews"
          element={
            <AdminReviews />
          }
        />


        {/* =================================================
            SETTINGS

            /admin/settings
        ================================================== */}

        <Route
          path="settings"
          element={
            <AdminSettings />
          }
        />

      </Route>


      {/* =====================================================
          ADMIN FALLBACK
      ====================================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/admin"
            replace
          />
        }
      />

    </Routes>
  );
}

export default AdminRoutes;