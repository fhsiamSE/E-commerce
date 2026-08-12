import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Home from "./pages/users/landingPage/Home";
import AllProducts from "./pages/users/product/AllProducts";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ContactUs from "./pages/users/companyInfo/ContactUs";
import Profile from "./pages/users/user/Profile";
import WishList from "./pages/users/product/WishList";
import Cart from "./pages/users/product/Cart";
import Login from "./pages/users/auth/Login";
import Register from "./pages/users/auth/Register";

function ProtectedRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem("token");

  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function App() {
  const location = useLocation();

  // Pages where Header/Footer should not appear
  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <div className="flex flex-col min-h-screen mt-12">
      
      {!hideLayout && <Header />}

      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <AllProducts />
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

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
}

export default App;