import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { getApiError, statusClassName } from "./adminUtils";

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const params = statusFilter ? `?status=${statusFilter}` : "";
      const { data } = await api.get(`/inquiries${params}`);
      setInquiries(data.inquiries || []);
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to load inquiries."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/inquiries/${id}/status`, { status });
      fetchInquiries();
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to update status."));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this inquiry?")) return;
    try {
      await api.delete(`/inquiries/${id}`);
      fetchInquiries();
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to delete inquiry."));
    }
  };

  const statusColors = {
    new: "bg-blue-100 text-blue-700",
    responded: "bg-green-100 text-green-700",
    closed: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
        <p className="text-gray-500">Manage contact form submissions and customer inquiries.</p>
      </div>

      <div className="flex gap-2">
        {["", "new", "responded", "closed"].map((s) => (
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

      {!loading && inquiries.length === 0 && (
        <p className="text-gray-600">No inquiries found.</p>
      )}

      {!loading && inquiries.length > 0 && (
        <div className="space-y-3">
          {inquiries.map((inquiry) => (
            <div key={inquiry._id} className="bg-white border rounded-lg shadow-sm p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-gray-900">{inquiry.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[inquiry.status] || "bg-gray-100"}`}>
                      {inquiry.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(inquiry.createdAt).toLocaleDateString()} {new Date(inquiry.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {inquiry.email}{inquiry.phone ? ` | ${inquiry.phone}` : ""}
                  </p>
                  <p className="font-medium text-gray-800 mt-2">Subject: {inquiry.subject}</p>
                  <p className="text-gray-700 mt-1 whitespace-pre-line">{inquiry.message}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {inquiry.status !== "responded" && (
                    <button onClick={() => handleStatusUpdate(inquiry._id, "responded")} className="px-2 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700">
                      Mark Responded
                    </button>
                  )}
                  {inquiry.status !== "closed" && (
                    <button onClick={() => handleStatusUpdate(inquiry._id, "closed")} className="px-2 py-1 text-xs rounded bg-gray-500 text-white hover:bg-gray-600">
                      Close
                    </button>
                  )}
                  <button onClick={() => handleDelete(inquiry._id)} className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminInquiries;
