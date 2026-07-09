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
    users: 0,
    pendingBookings: 0,
    recentBookings: [],
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
          users: data.users || 0,
          pendingBookings: data.pendingBookings || 0,
          recentBookings: data.recentBookings || [],
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
    { label: "Total Places", value: stats.places, to: "/admin/places", color: "bg-blue-50 text-blue-700" },
    { label: "Total Tours", value: stats.tours, to: "/admin/tours", color: "bg-green-50 text-green-700" },
    { label: "Total Bookings", value: stats.bookings, to: "/admin/bookings", color: "bg-purple-50 text-purple-700" },
    { label: "Pending Bookings", value: stats.pendingBookings, to: "/admin/bookings", color: "bg-yellow-50 text-yellow-700" },
    { label: "Total Users", value: stats.users, to: "/admin/dashboard", color: "bg-indigo-50 text-indigo-700" },
    { label: "Total Feedback", value: stats.feedback, to: "/admin/feedback", color: "bg-pink-50 text-pink-700" },
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
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {cards.map((card) => (
              <Link
                key={card.label}
                to={card.to}
                className={`${card.color} border rounded-lg p-5 shadow-sm hover:shadow-md transition`}
              >
                <p className="text-sm font-medium">{card.label}</p>
                <p className="text-3xl font-bold mt-2">{card.value}</p>
              </Link>
            ))}
          </div>

          {stats.recentBookings.length > 0 && (
            <div className="bg-white border rounded-lg p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h2>
              <div className="space-y-2">
                {stats.recentBookings.map((booking) => (
                  <div key={booking._id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <span className="font-medium text-gray-900">{booking.name || "Guest"}</span>
                      <span className="text-gray-500 text-sm ml-2">{booking.tour?.name || "Unknown Tour"}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      booking.status === "confirmed" ? "bg-green-100 text-green-800" :
                      booking.status === "cancelled" ? "bg-red-100 text-red-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white border rounded-lg p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="flex flex-wrap gap-3">
              <Link to="/admin/places/add" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Add Place</Link>
              <Link to="/admin/tours/add" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Add Tour</Link>
              <Link to="/admin/bookings" className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800">Review Bookings</Link>
              <Link to="/admin/reviews" className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800">Moderate Reviews</Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
