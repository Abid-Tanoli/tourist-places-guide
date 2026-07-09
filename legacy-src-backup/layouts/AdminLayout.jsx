import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearAdminAuth, getAdminUser } from "../utils/auth";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/places", label: "Places" },
  { to: "/admin/tours", label: "Tours" },
  { to: "/admin/bookings", label: "Bookings" },
  { to: "/admin/feedback", label: "Feedback" },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const adminUser = getAdminUser();

  const handleLogout = () => {
    clearAdminAuth();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="w-64 bg-gray-950 text-white hidden md:flex md:flex-col">
        <div className="px-6 py-5 border-b border-gray-800">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <p className="text-xs text-gray-400 mt-1">Tourist Places Guide</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="bg-white border-b px-4 sm:px-6 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Dashboard Workspace
            </h2>
            <p className="text-sm text-gray-500">
              Signed in as {adminUser?.name || "Admin"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="md:hidden flex flex-wrap gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-md px-3 py-2 text-sm font-medium ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
            <button
              onClick={handleLogout}
              className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
