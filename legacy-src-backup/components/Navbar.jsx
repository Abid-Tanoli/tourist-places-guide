import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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

  const handleHomeClick = () => {
    setRegionFilter("All");
    setCategoryFilter("All");
    setQuery("");
    setSearchInput("");
    navigate("/");
  };

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
            location.pathname === "/tours"
              ? "text-white underline"
              : "text-gray-100 hover:text-white"
          }`}
        >
          Tours
        </Link>

        <Link
          to="/booking"
          className={`font-medium transition-colors ${
            location.pathname === "/booking"
              ? "text-white underline"
              : "text-gray-100 hover:text-white"
          }`}
        >
          Book Tour
        </Link>

        <Link
          to="/feedback"
          className={`font-medium transition-colors ${
            location.pathname === "/feedback"
              ? "text-white underline"
              : "text-gray-100 hover:text-white"
          }`}
        >
          Feedback
        </Link>

        <Link
          to="/about"
          className={`font-medium transition-colors ${
            location.pathname === "/about"
              ? "text-white underline"
              : "text-gray-100 hover:text-white"
          }`}
        >
          About
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
