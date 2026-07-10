import React, { useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { Mountain, Mail, Phone, MapPin, Globe, MessageCircle, Send } from "lucide-react";

const Footer = () => (
  <footer className="bg-teal-900 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <Mountain className="size-6 text-terracotta-400" />
            <span className="font-heading text-xl font-bold">Pakistan Explorer</span>
          </Link>
          <p className="text-teal-200 text-sm leading-relaxed">
            Discover the breathtaking beauty of Pakistan through curated tours and travel experiences.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-teal-200">
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/tours" className="hover:text-white transition-colors">Tour Packages</Link></li>
            <li><Link to="/booking" className="hover:text-white transition-colors">Book a Tour</Link></li>
            <li><Link to="/feedback" className="hover:text-white transition-colors">Reviews</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">Destinations</h4>
          <ul className="space-y-2 text-sm text-teal-200">
            <li><span className="hover:text-white transition-colors cursor-default">Hunza Valley</span></li>
            <li><span className="hover:text-white transition-colors cursor-default">Skardu</span></li>
            <li><span className="hover:text-white transition-colors cursor-default">Swat Valley</span></li>
            <li><span className="hover:text-white transition-colors cursor-default">Neelum Valley</span></li>
            <li><span className="hover:text-white transition-colors cursor-default">Lahore Heritage</span></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">Contact Us</h4>
          <ul className="space-y-3 text-sm text-teal-200">
            <li className="flex items-center gap-2">
              <MapPin className="size-4 text-terracotta-400 shrink-0" />
              <span>Islamabad, Pakistan</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 text-terracotta-400 shrink-0" />
              <span>+92 300 1234567</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 text-terracotta-400 shrink-0" />
              <span>info@pakistanexplorer.com</span>
            </li>
          </ul>
          <div className="flex gap-3 mt-4">
            <a href="#" className="size-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <Globe className="size-4" />
            </a>
            <a href="#" className="size-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <MessageCircle className="size-4" />
            </a>
            <a href="#" className="size-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <Send className="size-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-teal-300">
        <p>&copy; {new Date().getFullYear()} Pakistan Explorer. All rights reserved. Made with love for Pakistan tourism.</p>
      </div>
    </div>
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
    <div className="min-h-screen flex flex-col">
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
