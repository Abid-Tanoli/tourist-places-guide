import React from "react";
import { useOutletContext } from "react-router-dom";
import PlaceList from "../components/PlaceList";

const Home = (props) => {
  const context = useOutletContext() || {};
  const {
    places = [],
    loadingPlaces: loading = false,
    placesError: error = "",
    regionFilter = "All",
    categoryFilter = "All",
    query = "",
  } = { ...context, ...props };

  const filteredPlaces = places.filter((place) => {
    const matchesRegion =
      regionFilter === "All" || place.region === regionFilter;
    const matchesCategory =
      categoryFilter === "All" || place.category === categoryFilter;
    const matchesSearch =
      query === "" ||
      (place.name && place.name.toLowerCase().includes(query.toLowerCase())) ||
      (place.description &&
        place.description.toLowerCase().includes(query.toLowerCase()));
    return matchesRegion && matchesCategory && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <h1 className="flex justify-center text-4xl md:text-5xl font-extrabold mb-8 text-gray-800 text-center md:text-left">
        Tourist Places Guide
      </h1>

      {loading && (
        <div className="text-center text-gray-500 text-lg mt-8">
          Loading tourist places...
        </div>
      )}
      {error && (
        <div className="text-center text-red-600 text-lg mt-8">{error}</div>
      )}
      {!loading && !error && <PlaceList places={filteredPlaces} />}
    </div>
  );
};

export default Home;
