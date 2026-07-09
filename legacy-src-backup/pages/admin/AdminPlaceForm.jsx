import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import { getApiError } from "./adminUtils";

const emptyPlace = {
  name: "",
  description: "",
  region: "",
  category: "",
  rating: "",
  bestTime: "",
  image: "",
  lat: "",
  lng: "",
};

const AdminPlaceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(emptyPlace);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlace = async () => {
      if (!isEdit) return;

      try {
        setLoading(true);
        setError("");
        const { data } = await api.get(`/places/${id}`);
        setForm({
          name: data.name || "",
          description: data.description || "",
          region: data.region || "",
          category: data.category || "",
          rating: data.rating ?? "",
          bestTime: data.bestTime || "",
          image: data.image || "",
          lat: data.lat ?? "",
          lng: data.lng ?? "",
        });
      } catch (requestError) {
        setError(getApiError(requestError, "Unable to load place."));
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      rating: Number(form.rating),
      lat: Number(form.lat),
      lng: Number(form.lng),
    };

    try {
      setSaving(true);
      setError("");
      if (isEdit) {
        await api.put(`/places/${id}`, payload);
      } else {
        await api.post("/places", payload);
      }
      navigate("/admin/places");
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to save place."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-gray-600">Loading place...</p>;
  }

  return (
    <div className="max-w-4xl space-y-5">
      <div>
        <Link to="/admin/places" className="text-blue-600 hover:underline">
          Back to Places
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">
          {isEdit ? "Edit Place" : "Add Place"}
        </h1>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-lg shadow-sm p-5 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">
              Region
            </span>
            <input
              name="region"
              value={form.region}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </span>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">
              Best Time
            </span>
            <input
              name="bestTime"
              value={form.bestTime}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">
              Rating
            </span>
            <input
              name="rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={form.rating}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1">
                Latitude
              </span>
              <input
                name="lat"
                type="number"
                step="any"
                value={form.lat}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1">
                Longitude
              </span>
              <input
                name="lng"
                type="number"
                step="any"
                value={form.lng}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </label>
          </div>
        </div>

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1">
            Image URL or Data URI
          </span>
          <textarea
            name="image"
            value={form.image}
            onChange={handleChange}
            rows={4}
            className="w-full border rounded-md px-3 py-2"
            required
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={6}
            className="w-full border rounded-md px-3 py-2"
            required
          />
        </label>

        <div className="flex justify-end gap-3">
          <Link
            to="/admin/places"
            className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {saving ? "Saving..." : "Save Place"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPlaceForm;
