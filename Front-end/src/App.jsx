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

import Header from "./components/user/Header";
import Footer from "./components/user/Footer";

import ContactUs from "./pages/users/companyInfo/ContactUs";
import Profile from "./pages/users/user/Profile";
import WishList from "./pages/users/user/WishList";
import Cart from "./pages/users/product/Cart";
import OrderList from "./pages/users/user/OrderList";

import Login from "./pages/users/auth/Login";
import Register from "./pages/users/auth/Register";

/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/

import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard/Dashboard";


/*
|--------------------------------------------------------------------------
| Protected User Route
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
| Admin Route
|--------------------------------------------------------------------------
|
| For now we only check login.
|
| Later we will change this to:
|
| user.role === "admin"
|
|--------------------------------------------------------------------------
*/

function AdminRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem("token");

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
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
  | Admin Page?
  |--------------------------------------------------------------------------
  */

  const isAdminPage =
    location.pathname.startsWith("/admin");


  /*
  |--------------------------------------------------------------------------
  | Hide User Header/Footer
  |--------------------------------------------------------------------------
  |
  | Admin has its own layout.
  |
  */

  const hideUserLayout =
    isAdminPage ||
    location.pathname === "/login" ||
    location.pathname === "/register";


  return (
    <div className="min-h-screen">

      {/* =========================================================
          USER HEADER
      ========================================================== */}

      {!hideUserLayout && <Header />}


      {/* =========================================================
          USER / ADMIN ROUTES
      ========================================================== */}

      <Routes>

        {/* =====================================================
            USER WEBSITE
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


        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <ContactUs />
            </ProtectedRoute>
          }
        />


        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />


        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <WishList />
            </ProtectedRoute>
          }
        />


        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />


        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderList />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            ADMIN PANEL
        ====================================================== */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >

          {/* Dashboard */}
          <Route
            index
            element={<Dashboard />}
          />

          {/* We will add these later */}

        </Route>


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


      {/* =========================================================
          USER FOOTER
      ========================================================== */}

      {!hideUserLayout && <Footer />}

    </div>
  );
}

export default App;