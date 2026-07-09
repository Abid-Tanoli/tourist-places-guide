import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/bookings/my-bookings");
      setBookings(data);
    } catch (err) {
      toast.error("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const statusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
      completed: "bg-blue-100 text-blue-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500 text-lg mb-4">You haven&apos;t made any bookings yet.</p>
            <Link
              to="/tours"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Browse Tours
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {booking.tour?.name || booking.selectedTour || "Tour"}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      Booked on {new Date(booking.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                      <span>{booking.userType === "pakistani" ? "Pakistani" : "Foreigner"} Visitor</span>
                      <span>&middot;</span>
                      <span>{booking.guests?.adults || 1} Adult{(booking.guests?.adults || 1) > 1 ? "s" : ""}</span>
                      {booking.guests?.children > 0 && (
                        <>
                          <span>&middot;</span>
                          <span>{booking.guests.children} Child{booking.guests.children > 1 ? "ren" : ""}</span>
                        </>
                      )}
                      {booking.date && (
                        <>
                          <span>&middot;</span>
                          <span>{new Date(booking.date).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                    {booking.notes && (
                      <p className="text-sm text-gray-500 mt-1 italic">&quot;{booking.notes}&quot;</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                    {booking.payment?.amount > 0 && (
                      <span className="text-sm font-medium text-gray-700">
                        PKR {booking.payment.amount.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
