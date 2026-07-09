import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { formatDate, getApiError } from "./adminUtils";

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
      setFeedback((prev) => prev.filter((item) => item._id !== id));
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to delete feedback."));
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Feedback</h1>
        <p className="text-gray-500">View and moderate visitor feedback.</p>
      </div>

      {loading && <p className="text-gray-600">Loading feedback...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="space-y-3">
          {feedback.map((item) => (
            <div
              key={item._id}
              className="bg-white border rounded-lg shadow-sm p-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {item.name}
                  </h2>
                  {item.rating && (
                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
                      {item.rating}/5
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {[item.email, item.country, formatDate(item.createdAt)]
                    .filter(Boolean)
                    .join(" - ")}
                </p>
                <p className="text-gray-800 mt-2">{item.feedBackText}</p>
              </div>
              <button
                onClick={() => handleDelete(item._id)}
                disabled={deletingId === item._id}
                className="px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400"
              >
                {deletingId === item._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))}
          {feedback.length === 0 && (
            <p className="text-center text-gray-500 py-6">No feedback yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;
