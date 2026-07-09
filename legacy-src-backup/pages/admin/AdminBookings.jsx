import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { formatDate, getApiError, statusClassName } from "./adminUtils";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

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

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      setUpdatingId(id);
      setError("");
      const { data } = await api.put(`/bookings/${id}/status`, { status });
      setBookings((prev) =>
        prev.map((booking) => (booking._id === id ? data : booking))
      );
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to update booking status."));
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <p className="text-gray-500">
          Review tour requests and update their status.
        </p>
      </div>

      {loading && <p className="text-gray-600">Loading bookings...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="bg-white border rounded-lg shadow-sm overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Tour</th>
                <th className="text-left px-4 py-3 font-semibold">Visitor</th>
                <th className="text-left px-4 py-3 font-semibold">Contact</th>
                <th className="text-left px-4 py-3 font-semibold">ID</th>
                <th className="text-left px-4 py-3 font-semibold">Created</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {booking.selectedTour || booking.tour?.name || "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    <p>{booking.name || "-"}</p>
                    <p className="capitalize text-gray-500">
                      {booking.userType}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    <p>{booking.email}</p>
                    <p>{booking.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {booking.userType === "pakistani"
                      ? booking.cnic || "-"
                      : booking.passport || "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {formatDate(booking.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClassName(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                      <select
                        value={booking.status}
                        onChange={(e) =>
                          handleStatusChange(booking._id, e.target.value)
                        }
                        disabled={updatingId === booking._id}
                        className="border rounded-md px-2 py-1"
                      >
                        <option value="pending">pending</option>
                        <option value="confirmed">confirmed</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && (
            <p className="text-center text-gray-500 py-6">No bookings yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
