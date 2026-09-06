import { useLocation } from "react-router-dom";

import UserRoutes from "./routes/UserRoutes";
import AdminRoutes from "./routes/AdminRoutes";

import Header from "./components/user/Header";
import Footer from "./components/user/Footer";

function App() {
  const location = useLocation();

  const isAdminPage =
    location.pathname.startsWith("/admin");

  /*
  |--------------------------------------------------------------------------
  | USER AUTH PAGES
  |--------------------------------------------------------------------------
  */

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  /*
  |--------------------------------------------------------------------------
  | HIDE USER LAYOUT
  |--------------------------------------------------------------------------
  */

  const hideUserLayout =
    isAdminPage ||
    isAuthPage;

  /*
  |--------------------------------------------------------------------------
  | USER PAGE CLASS
  |--------------------------------------------------------------------------
  |
  | mt-18 flex flex-col bg-stone-50
  | will only apply to normal user pages.
  |
  */

  const userPageClass =
    !hideUserLayout
      ? "mt-18 flex flex-col bg-stone-50"
      : "";

  return (
    <div className="min-h-screen">

      {/* =====================================================
          USER HEADER
      ====================================================== */}

      {!hideUserLayout && (
        <Header />
      )}

      {/* =====================================================
          ROUTES
      ====================================================== */}

      <main className={userPageClass}>

        {isAdminPage ? (
          <AdminRoutes />
        ) : (
          <UserRoutes />
        )}

      </main>

      {/* =====================================================
          USER FOOTER
      ====================================================== */}

      {!hideUserLayout && (
        <Footer />
      )}

    </div>
  );
}

export default App;