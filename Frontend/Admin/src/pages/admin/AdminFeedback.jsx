import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { getApiError } from "./adminUtils";

const AdminFeedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/feedback");
      setFeedback(data);
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to load feedback."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this feedback?")) return;

    try {
      setDeletingId(id);
      await api.delete(`/feedback/${id}`);
      setFeedback((prev) => prev.filter((f) => f._id !== id));
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to delete feedback."));
    } finally {
      setDeletingId("");
    }
  };

  const emojiMap = { 1: "😡", 2: "🙁", 3: "🙂", 4: "😀", 5: "😍" };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Feedback</h1>
        <p className="text-gray-500">View and moderate visitor feedback and ratings.</p>
      </div>

      {loading && <p className="text-gray-600">Loading feedback...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="bg-white border rounded-lg shadow-sm overflow-x-auto">
          {feedback.length === 0 ? (
            <p className="p-5 text-gray-600">No feedback received yet.</p>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">User</th>
                  <th className="text-left px-4 py-3 font-semibold">Place</th>
                  <th className="text-left px-4 py-3 font-semibold">Rating</th>
                  <th className="text-left px-4 py-3 font-semibold">Comment</th>
                  <th className="text-center px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {feedback.map((f) => (
                  <tr key={f._id} className="align-middle">
                    <td className="px-4 py-3 text-gray-900 font-medium">
                      {f.name || f.username || "Anonymous"}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {f.place?.name || f.placeName || "-"}
                    </td>
                    <td className="px-4 py-3 text-lg">
                      {emojiMap[f.rating] || f.rating}
                    </td>
                    <td className="px-4 py-3 text-gray-700 max-w-xs truncate">
                      {f.comment || f.message || "-"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDelete(f._id)}
                        disabled={deletingId === f._id}
                        className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400"
                      >
                        {deletingId === f._id ? "Deleting" : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;
