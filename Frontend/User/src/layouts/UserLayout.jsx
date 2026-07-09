import React, { useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const Footer = () => (
  <footer className="bg-gray-900 text-gray-200 py-6 text-center text-sm">
    <p>Tourist Places Guide - Explore Pakistan with confidence.</p>
  </footer>
);

const UserLayout = () => {
  const [regionFilter, setRegionFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [places, setPlaces] = useState([]);
  const [loadingPlaces, setLoadingPlaces] = useState(true);
  const [placesError, setPlacesError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoadingPlaces(true);
        setPlacesError("");
        const { data } = await api.get("/places");
        const placesArray = Array.isArray(data) ? data : data.places || [];
        setPlaces(placesArray);
      } catch (error) {
        setPlacesError(
          error.response?.data?.message || "Unable to load tourist places."
        );
      } finally {
        setLoadingPlaces(false);
      }
    };

    fetchPlaces();
  }, []);

  const regions = useMemo(
    () => ["All", ...new Set(places.map((p) => p.region).filter(Boolean))],
    [places]
  );
  const categories = useMemo(
    () => ["All", ...new Set(places.map((p) => p.category).filter(Boolean))],
    [places]
  );

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(searchInput);
    setSearchInput("");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar
        regions={regions}
        categories={categories}
        regionFilter={regionFilter}
        setRegionFilter={setRegionFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        handleSearch={handleSearch}
        setQuery={setQuery}
      />
      <main className="flex-grow">
        <Outlet
          context={{
            places,
            loadingPlaces,
            placesError,
            regionFilter,
            categoryFilter,
            query,
          }}
        />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
