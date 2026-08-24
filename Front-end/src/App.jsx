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
  |
  | User login/register should not show the normal
  | Header and Footer.
  |
  */

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";


  /*
  |--------------------------------------------------------------------------
  | HIDE USER LAYOUT
  |--------------------------------------------------------------------------
  |
  | Admin pages and user authentication pages do not
  | use the normal user Header/Footer.
  |
  */

  const hideUserLayout =
    isAdminPage ||
    isAuthPage;


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

      <main>

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

