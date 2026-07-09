import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { getApiError } from "./adminUtils";

const AdminRegions = () => {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", status: "active" });
  const [saving, setSaving] = useState(false);

  const fetchRegions = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/regions");
      setRegions(data);
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to load regions."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRegions(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      if (editingId) {
        await api.put(`/regions/${editingId}`, form);
      } else {
        await api.post("/regions", form);
      }
      setForm({ name: "", slug: "", description: "", status: "active" });
      setEditingId(null);
      setShowForm(false);
      fetchRegions();
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to save region."));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (reg) => {
    setForm({ name: reg.name, slug: reg.slug, description: reg.description || "", status: reg.status });
    setEditingId(reg._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this region?")) return;
    try {
      await api.delete(`/regions/${id}`);
      fetchRegions();
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to delete region."));
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Regions</h1>
          <p className="text-gray-500">Manage geographic regions.</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: "", slug: "", description: "", status: "active" }); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "Add Region"}
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border rounded-lg shadow-sm p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border rounded-md px-3 py-2" required />
            <input placeholder="Slug (auto-generated)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="border rounded-md px-3 py-2" />
          </div>
          <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border rounded-md px-3 py-2" />
          <div className="flex gap-2">
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="border rounded-md px-3 py-2">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button type="submit" disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
              {saving ? "Saving..." : editingId ? "Update" : "Create"}
            </button>
          </div>
        </form>
      )}

      {loading && <p className="text-gray-600">Loading...</p>}

      {!loading && (
        <div className="bg-white border rounded-lg shadow-sm overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Name</th>
                <th className="text-left px-4 py-3 font-semibold">Slug</th>
                <th className="text-left px-4 py-3 font-semibold">Places</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-right px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {regions.map((reg) => (
                <tr key={reg._id}>
                  <td className="px-4 py-3 font-medium text-gray-900">{reg.name}</td>
                  <td className="px-4 py-3 text-gray-600">{reg.slug}</td>
                  <td className="px-4 py-3 text-gray-600">{reg.placeCount || 0}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${reg.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                      {reg.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(reg)} className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200">Edit</button>
                      <button onClick={() => handleDelete(reg._id)} className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700">Delete</button>
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

export default AdminRegions;
