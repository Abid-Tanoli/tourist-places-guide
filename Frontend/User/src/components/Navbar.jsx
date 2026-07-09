import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SearchBar from "./SearchBar";

const Navbar = ({
  regions = [],
  categories = [],
  regionFilter,
  setRegionFilter,
  categoryFilter,
  setCategoryFilter,
  searchInput,
  setSearchInput,
  handleSearch,
  setQuery,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleHomeClick = () => {
    setRegionFilter("All");
    setCategoryFilter("All");
    setQuery("");
    setSearchInput("");
    navigate("/");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-800 px-6 py-4 flex flex-col md:flex-row md:justify-between md:items-center sticky top-0 z-50 shadow-md">
      <div
        className="text-3xl font-bold text-white cursor-pointer mb-3 md:mb-0"
        onClick={handleHomeClick}
      >
        Tourist Guide
      </div>

      <div className="mb-3 md:mb-0">
        <SearchBar
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          handleSearch={handleSearch}
        />
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-center md:justify-end">
        <Link
          to="/"
          onClick={handleHomeClick}
          className={`font-medium transition-colors ${
            location.pathname === "/"
              ? "text-white"
              : "text-gray-100 hover:text-white"
          }`}
        >
          Home
        </Link>

        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          className="p-2 rounded shadow-sm border focus:outline-none focus:ring-2 focus:ring-white bg-white text-gray-800"
        >
          {regions.map((region) => (
            <option key={region} value={region}>
              {region === "All" ? "Region" : region}
            </option>
          ))}
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="p-2 rounded shadow-sm border focus:outline-none focus:ring-2 focus:ring-white bg-white text-gray-800"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "All" ? "Places" : cat}
            </option>
          ))}
        </select>

        <Link
          to="/tours"
          className={`font-medium transition-colors ${
            isActive("/tours")
              ? "text-white underline"
              : "text-gray-100 hover:text-white"
          }`}
        >
          Tours
        </Link>

        <Link
          to="/booking"
          className={`font-medium transition-colors ${
            isActive("/booking")
              ? "text-white underline"
              : "text-gray-100 hover:text-white"
          }`}
        >
          Book Tour
        </Link>

        <Link
          to="/feedback"
          className={`font-medium transition-colors ${
            isActive("/feedback")
              ? "text-white underline"
              : "text-gray-100 hover:text-white"
          }`}
        >
          Feedback
        </Link>

        <Link
          to="/about"
          className={`font-medium transition-colors ${
            isActive("/about")
              ? "text-white underline"
              : "text-gray-100 hover:text-white"
          }`}
        >
          About
        </Link>

        {isAuthenticated ? (
          <div className="relative group">
            <button className="font-medium text-gray-100 hover:text-white transition-colors flex items-center gap-1">
              {user?.name?.split(" ")[0] || "Account"}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                My Profile
              </Link>
              <Link
                to="/my-bookings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                My Bookings
              </Link>
              <Link
                to="/wishlist"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Wishlist
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <Link
            to="/login"
            className={`font-medium transition-colors ${
              isActive("/login")
                ? "text-white underline"
                : "text-gray-100 hover:text-white"
            }`}
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
