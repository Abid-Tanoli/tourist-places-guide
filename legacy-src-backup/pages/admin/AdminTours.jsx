import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { getApiError } from "./adminUtils";

const AdminTours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const fetchTours = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/tours");
      setTours(data);
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to load tours."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this tour?")) return;

    try {
      setDeletingId(id);
      await api.delete(`/tours/${id}`);
      setTours((prev) => prev.filter((tour) => tour._id !== id));
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to delete tour."));
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tours</h1>
          <p className="text-gray-500">Manage packages, prices, and routes.</p>
        </div>
        <Link
          to="/admin/tours/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-center"
        >
          Add Tour
        </Link>
      </div>

      {loading && <p className="text-gray-600">Loading tours...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="bg-white border rounded-lg shadow-sm overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Tour</th>
                <th className="text-left px-4 py-3 font-semibold">Days</th>
                <th className="text-left px-4 py-3 font-semibold">Price</th>
                <th className="text-left px-4 py-3 font-semibold">Route</th>
                <th className="text-right px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tours.map((tour) => (
                <tr key={tour._id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{tour.name}</p>
                    <p className="text-gray-500 line-clamp-1">
                      {tour.description}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{tour.days}</td>
                  <td className="px-4 py-3 text-gray-700">
                    PKR {Number(tour.price || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {(tour.route || [])
                      .map((stop) => stop.place?.name)
                      .filter(Boolean)
                      .join(", ") || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/tours/edit/${tour._id}`}
                        className="px-3 py-1 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(tour._id)}
                        disabled={deletingId === tour._id}
                        className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400"
                      >
                        {deletingId === tour._id ? "Deleting" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminTours;
