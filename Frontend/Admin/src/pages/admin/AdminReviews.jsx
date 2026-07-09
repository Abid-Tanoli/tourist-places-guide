import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { getApiError, statusClassName } from "./adminUtils";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState("");

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = statusFilter ? `?status=${statusFilter}` : "";
      const { data } = await api.get(`/reviews${params}`);
      setReviews(data.reviews || data);
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to load reviews."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, [statusFilter]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/reviews/${id}/status`, { status });
      fetchReviews();
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to update review status."));
    }
  };

  const handleReply = async (id) => {
    if (!replyText.trim()) return;
    try {
      await api.post(`/reviews/${id}/reply`, { comment: replyText });
      setReplyText("");
      setReplyingId(null);
      fetchReviews();
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to add reply."));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await api.delete(`/reviews/${id}`);
      fetchReviews();
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to delete review."));
    }
  };

  const emojiMap = { 1: "😡", 2: "🙁", 3: "😐", 4: "🙂", 5: "😍" };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="text-gray-500">Moderate user reviews and ratings.</p>
      </div>

      <div className="flex gap-2">
        {["", "pending", "approved", "rejected"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 rounded-md text-sm font-medium ${statusFilter === s ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {loading && <p className="text-gray-600">Loading...</p>}

      {!loading && reviews.length === 0 && (
        <p className="text-gray-600">No reviews found.</p>
      )}

      {!loading && reviews.length > 0 && (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white border rounded-lg shadow-sm p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{review.name}</span>
                    <span className="text-lg">{emojiMap[review.rating] || review.rating}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusClassName(review.status)}`}>
                      {review.status}
                    </span>
                  </div>
                  {review.place && (
                    <p className="text-sm text-gray-500">Place: {review.place.name || "Unknown"}</p>
                  )}
                  {review.title && <p className="font-medium text-gray-800 mt-1">{review.title}</p>}
                  <p className="text-gray-700 mt-1">{review.comment}</p>
                  {review.images?.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {review.images.map((img, i) => (
                        <img key={i} src={img} alt="" className="h-16 w-16 object-cover rounded border" />
                      ))}
                    </div>
                  )}
                  {review.replies?.length > 0 && (
                    <div className="mt-3 ml-4 space-y-2 border-l-2 border-blue-200 pl-3">
                      {review.replies.map((reply, i) => (
                        <div key={i}>
                          <span className="text-sm font-medium text-blue-700">{reply.name}:</span>
                          <span className="text-sm text-gray-600 ml-1">{reply.comment}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {review.status !== "approved" && (
                    <button onClick={() => handleStatusUpdate(review._id, "approved")} className="px-2 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700">Approve</button>
                  )}
                  {review.status !== "rejected" && (
                    <button onClick={() => handleStatusUpdate(review._id, "rejected")} className="px-2 py-1 text-xs rounded bg-yellow-600 text-white hover:bg-yellow-700">Reject</button>
                  )}
                  <button onClick={() => setReplyingId(replyingId === review._id ? null : review._id)} className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200">Reply</button>
                  <button onClick={() => handleDelete(review._id)} className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700">Delete</button>
                </div>
              </div>
              {replyingId === review._id && (
                <div className="mt-3 flex gap-2">
                  <input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1 border rounded-md px-3 py-1 text-sm"
                    onKeyDown={(e) => e.key === "Enter" && handleReply(review._id)}
                  />
                  <button onClick={() => handleReply(review._id)} className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">Send</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
