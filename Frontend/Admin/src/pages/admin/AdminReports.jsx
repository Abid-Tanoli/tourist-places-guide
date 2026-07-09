import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { getApiError } from "./adminUtils";

const AdminReports = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState("30d");

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get(`/reports?period=${period}`);
      setReports(data);
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to load reports."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, [period]);

  const statCard = (label, value, color = "blue") => (
    <div className={`bg-white rounded-lg shadow-sm p-5 border-l-4 border-${color}-500`}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500">View revenue, bookings, and performance metrics.</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="1y">Last Year</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {loading && <p className="text-gray-600">Loading reports...</p>}

      {!loading && reports && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCard("Total Bookings", reports.totalBookings)}
            {statCard("Total Revenue", `PKR ${(reports.totalRevenue || 0).toLocaleString()}`, "green")}
            {statCard("Total Users", reports.totalUsers, "purple")}
            {statCard("New Users", reports.newUsers, "yellow")}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Bookings by Status</h3>
              <div className="space-y-3">
                {["pending", "confirmed", "cancelled", "completed"].map((status) => {
                  const count = reports.bookingsByStatus?.[status] || 0;
                  const total = reports.totalBookings || 1;
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={status}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize text-gray-700">{status}</span>
                        <span className="text-gray-500">{count} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            status === "confirmed" ? "bg-green-500" :
                            status === "pending" ? "bg-yellow-500" :
                            status === "cancelled" ? "bg-red-500" : "bg-blue-500"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Popular Tours</h3>
              {reports.popularTours?.length === 0 ? (
                <p className="text-gray-500 text-sm">No booking data yet.</p>
              ) : (
                <div className="space-y-3">
                  {reports.popularTours?.map((tour, i) => (
                    <div key={tour._id || i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </span>
                        <span className="text-sm text-gray-800">{tour.name}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-600">{tour.count} bookings</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Monthly Trend</h3>
              {reports.bookingsByMonth?.length === 0 ? (
                <p className="text-gray-500 text-sm">No data yet.</p>
              ) : (
                <div className="space-y-2">
                  {reports.bookingsByMonth?.map((m) => (
                    <div key={m._id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{m._id}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500">{m.count} bookings</span>
                        <span className="font-medium text-green-700">PKR {(m.revenue || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Bookings</h3>
              {reports.recentBookings?.length === 0 ? (
                <p className="text-gray-500 text-sm">No bookings yet.</p>
              ) : (
                <div className="space-y-3">
                  {reports.recentBookings?.map((b) => (
                    <div key={b._id} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium text-gray-800">{b.name || b.email}</p>
                        <p className="text-gray-500">{b.tour?.name || "Tour"}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        b.status === "confirmed" ? "bg-green-100 text-green-700" :
                        b.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                        b.status === "cancelled" ? "bg-red-100 text-red-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {b.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminReports;
