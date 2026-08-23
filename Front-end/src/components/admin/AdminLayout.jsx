import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 transition-colors duration-200 dark:bg-gray-950 dark:text-white">

      {/* =========================================================
          SIDEBAR
      ========================================================== */}

      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />


      {/* =========================================================
          MAIN AREA
      ========================================================== */}

      <div className="lg:pl-64">

        {/* =======================================================
            HEADER
        ======================================================== */}

        <AdminHeader
          setSidebarOpen={setSidebarOpen}
        />


        {/* =======================================================
            PAGE CONTENT
        ======================================================== */}

        <main className="min-h-[calc(100vh-64px)] p-4 sm:p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;