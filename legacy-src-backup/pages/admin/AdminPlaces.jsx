import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { getApiError } from "./adminUtils";

const AdminPlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/places");
      setPlaces(data);
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to load places."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this place?")) return;

    try {
      setDeletingId(id);
      await api.delete(`/places/${id}`);
      setPlaces((prev) => prev.filter((place) => place._id !== id));
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to delete place."));
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Places</h1>
          <p className="text-gray-500">Add, edit, and remove destination data.</p>
        </div>
        <Link
          to="/admin/places/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-center"
        >
          Add Place
        </Link>
      </div>

      {loading && <p className="text-gray-600">Loading places...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="bg-white border rounded-lg shadow-sm overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Place</th>
                <th className="text-left px-4 py-3 font-semibold">Region</th>
                <th className="text-left px-4 py-3 font-semibold">Category</th>
                <th className="text-left px-4 py-3 font-semibold">Rating</th>
                <th className="text-right px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {places.map((place) => (
                <tr key={place._id} className="align-middle">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={place.image}
                        alt={place.name}
                        className="h-12 w-16 object-cover rounded"
                      />
                      <span className="font-medium text-gray-900">
                        {place.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{place.region}</td>
                  <td className="px-4 py-3 text-gray-700">{place.category}</td>
                  <td className="px-4 py-3 text-gray-700">{place.rating}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/places/edit/${place._id}`}
                        className="px-3 py-1 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(place._id)}
                        disabled={deletingId === place._id}
                        className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400"
                      >
                        {deletingId === place._id ? "Deleting" : "Delete"}
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

export default AdminPlaces;
