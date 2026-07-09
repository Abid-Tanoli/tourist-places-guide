import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { getApiError, statusClassName } from "./adminUtils";

const AdminFAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ question: "", answer: "", category: "general", status: "active" });

  const categories = ["general", "booking", "payment", "cancellation", "tour", "other"];

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/faqs");
      setFaqs(data);
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to load FAQs."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFAQs(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/faqs/${editingId}`, form);
      } else {
        await api.post("/faqs", form);
      }
      resetForm();
      fetchFAQs();
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to save FAQ."));
    }
  };

  const handleEdit = (faq) => {
    setForm({ question: faq.question, answer: faq.answer, category: faq.category, status: faq.status });
    setEditingId(faq._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this FAQ?")) return;
    try {
      await api.delete(`/faqs/${id}`);
      fetchFAQs();
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to delete FAQ."));
    }
  };

  const resetForm = () => {
    setForm({ question: "", answer: "", category: "general", status: "active" });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQs</h1>
          <p className="text-gray-500">Manage frequently asked questions.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "+ Add FAQ"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
            <input
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
            <textarea
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              rows={3}
              required
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="capitalize">{c}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
            {editingId ? "Update" : "Create"} FAQ
          </button>
        </form>
      )}

      {error && <p className="text-red-600">{error}</p>}
      {loading && <p className="text-gray-600">Loading...</p>}

      {!loading && faqs.length === 0 && (
        <p className="text-gray-600">No FAQs found.</p>
      )}

      {!loading && faqs.length > 0 && (
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq._id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusClassName(faq.status)}`}>
                      {faq.status}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 capitalize">
                      {faq.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{faq.answer}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button onClick={() => handleEdit(faq)} className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200">Edit</button>
                  <button onClick={() => handleDelete(faq._id)} className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFAQ;
