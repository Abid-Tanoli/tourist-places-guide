import React, { useEffect, useState } from "react";
import api from "../api/axios";
import TourMap from "../components/TourMap";

const getRoutePlaces = (tour) =>
  (tour.route || []).map((stop) => stop.place).filter(Boolean);

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);
  const [selectedTourName, setSelectedTourName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await api.get("/tours");
        setTours(Array.isArray(data) ? data : data.tours || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load tours.");
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-gray-800 text-center md:text-left">
        Tour Packages
      </h1>

      {loading && (
        <div className="text-center text-gray-500 text-lg">
          Loading tour packages...
        </div>
      )}
      {error && <div className="text-center text-red-600 text-lg">{error}</div>}

      {!loading && !error && tours.length === 0 && (
        <div className="text-center text-gray-500 text-lg">
          No tours available at the moment.
        </div>
      )}

      {!loading && !error && tours.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => {
            const discountedPrice = tour.discount
              ? tour.price * (1 - tour.discount / 100)
              : null;

            return (
              <div
                key={tour._id || tour.id}
                className="border rounded-lg shadow-md bg-white p-5 hover:shadow-lg transition flex flex-col"
              >
                {tour.image && (
                  <img src={tour.image} alt={tour.name} className="w-full h-40 object-cover rounded mb-3" />
                )}

                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {tour.name}
                </h2>
                <p className="text-gray-600 mb-2 text-sm line-clamp-2">{tour.description}</p>

                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm text-gray-700 font-medium">
                    {tour.days} {tour.days > 1 ? "days" : "day"}
                  </span>
                  {tour.featured && (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-medium">
                      Featured
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  {discountedPrice ? (
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-green-600">
                        PKR {Math.round(discountedPrice).toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        PKR {tour.price.toLocaleString()}
                      </span>
                      <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-xs font-semibold">
                        {tour.discount}% OFF
                      </span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-gray-800">
                      PKR {Number(tour.price || 0).toLocaleString()}
                    </span>
                  )}
                </div>

                {tour.included?.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Included:</p>
                    <ul className="text-xs text-gray-600 space-y-0.5">
                      {tour.included.slice(0, 3).map((item, i) => (
                        <li key={i}>✓ {item}</li>
                      ))}
                      {tour.included.length > 3 && (
                        <li className="text-gray-400">+{tour.included.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}

                {tour.route?.length > 0 && (
                  <>
                    <h3 className="font-semibold text-gray-800 mb-2 text-sm">Route:</h3>
                    <ol className="list-decimal list-inside space-y-1 mb-4 text-gray-700 text-sm flex-grow">
                      {tour.route.map((stop, index) => {
                        const place = stop.place;
                        return (
                          <li key={`${tour._id || tour.id}-${place?._id || index}`}>
                            Day {stop.day || index + 1}:{" "}
                            {place?.name || "Unknown Place"}
                          </li>
                        );
                      })}
                    </ol>
                  </>
                )}

                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => {
                      setSelectedTour(getRoutePlaces(tour));
                      setSelectedTourName(tour.name);
                    }}
                    disabled={getRoutePlaces(tour).length === 0}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                  >
                    View on Map
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedTour && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedTourName} - Route Map
            </h2>
            <button
              onClick={() => setSelectedTour(null)}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Close Map
            </button>
          </div>
          <TourMap route={selectedTour} />
        </div>
      )}
    </div>
  );
};

export default Tours;
