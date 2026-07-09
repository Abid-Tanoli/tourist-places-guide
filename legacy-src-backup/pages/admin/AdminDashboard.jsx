import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { getApiError } from "./adminUtils";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    places: 0,
    tours: 0,
    bookings: 0,
    feedback: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await api.get("/auth/dashboard-stats");

        setStats({
          places: data.places || 0,
          tours: data.tours || 0,
          bookings: data.bookings || 0,
          feedback: data.feedback || 0,
        });
      } catch (requestError) {
        setError(getApiError(requestError, "Unable to load dashboard stats."));
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    { label: "Total Places", value: stats.places, to: "/admin/places" },
    { label: "Total Tours", value: stats.tours, to: "/admin/tours" },
    { label: "Total Bookings", value: stats.bookings, to: "/admin/bookings" },
    { label: "Total Feedback", value: stats.feedback, to: "/admin/feedback" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Monitor and manage tourist guide content from one workspace.
        </p>
      </div>

      {loading && <p className="text-gray-600">Loading dashboard...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {cards.map((card) => (
            <Link
              key={card.label}
              to={card.to}
              className="bg-white border rounded-lg p-5 shadow-sm hover:shadow-md transition"
            >
              <p className="text-sm font-medium text-gray-500">{card.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {card.value}
              </p>
            </Link>
          ))}
        </div>
      )}

      <div className="bg-white border rounded-lg p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/places/add"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Place
          </Link>
          <Link
            to="/admin/tours/add"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Tour
          </Link>
          <Link
            to="/admin/bookings"
            className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800"
          >
            Review Bookings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
