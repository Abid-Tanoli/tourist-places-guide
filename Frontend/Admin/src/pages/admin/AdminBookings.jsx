import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { getApiError } from "./adminUtils";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusUpdating, setStatusUpdating] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/bookings");
      setBookings(data);
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to load bookings."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      setStatusUpdating(id);
      await api.put(`/bookings/${id}/status`, { status });
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status } : b))
      );
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to update booking status."));
    } finally {
      setStatusUpdating("");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this booking?")) return;
    try {
      await api.delete(`/bookings/${id}`);
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to delete booking."));
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <p className="text-gray-500">Review and manage visitor bookings.</p>
      </div>

      {loading && <p className="text-gray-600">Loading bookings...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="bg-white border rounded-lg shadow-sm overflow-x-auto">
          {bookings.length === 0 ? (
            <p className="p-5 text-gray-600">No bookings found.</p>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Name</th>
                  <th className="text-left px-4 py-3 font-semibold">Tour</th>
                  <th className="text-left px-4 py-3 font-semibold">Type</th>
                  <th className="text-left px-4 py-3 font-semibold">Guests</th>
                  <th className="text-left px-4 py-3 font-semibold">Payment</th>
                  <th className="text-left px-4 py-3 font-semibold">Status</th>
                  <th className="text-right px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {bookings.map((booking) => {
                  const statusVal = booking.status || "pending";
                  return (
                    <tr key={booking._id} className="align-middle">
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-900">
                          {booking.name || "Guest"}
                        </span>
                        <span className="block text-gray-500 text-xs">
                          {booking.email || ""}
                        </span>
                        {booking.phone && (
                          <span className="block text-gray-500 text-xs">
                            {booking.phone}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {booking.tour?.name || booking.selectedTour || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          booking.userType === "pakistani" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                        }`}>
                          {booking.userType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {booking.guests?.adults || 1}A
                        {booking.guests?.children > 0 && ` + ${booking.guests.children}C`}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {booking.payment?.amount
                          ? `PKR ${booking.payment.amount.toLocaleString()}`
                          : <span className="text-gray-400">-</span>
                        }
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                            statusVal === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : statusVal === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : statusVal === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {statusVal}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          {statusVal !== "confirmed" && (
                            <button
                              onClick={() => handleStatusUpdate(booking._id, "confirmed")}
                              disabled={statusUpdating === booking._id}
                              className="px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 text-xs"
                            >
                              Confirm
                            </button>
                          )}
                          {statusVal === "confirmed" && (
                            <button
                              onClick={() => handleStatusUpdate(booking._id, "completed")}
                              disabled={statusUpdating === booking._id}
                              className="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 text-xs"
                            >
                              Complete
                            </button>
                          )}
                          {statusVal !== "cancelled" && (
                            <button
                              onClick={() => handleStatusUpdate(booking._id, "cancelled")}
                              disabled={statusUpdating === booking._id}
                              className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400 text-xs"
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(booking._id)}
                            className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
