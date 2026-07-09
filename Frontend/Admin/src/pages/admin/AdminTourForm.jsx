import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import { getApiError } from "./adminUtils";

const emptyTour = {
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  days: "",
  price: "",
  discount: "",
  capacity: "",
  included: "",
  excluded: "",
  image: "",
  location: "",
  status: "published",
  featured: false,
  route: [],
};

const AdminTourForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(emptyTour);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [placesRes, tourRes] = isEdit
          ? await Promise.all([api.get("/places"), api.get(`/tours/${id}`)])
          : [await api.get("/places"), null];

        setPlaces(placesRes.data?.places || placesRes.data);

        if (tourRes) {
          const tour = tourRes.data;
          setForm({
            name: tour.name || "",
            slug: tour.slug || "",
            shortDescription: tour.shortDescription || "",
            description: tour.description || "",
            days: tour.days || "",
            price: tour.price ?? "",
            discount: tour.discount ?? "",
            capacity: tour.capacity || "",
            included: (tour.included || []).join("\n"),
            excluded: (tour.excluded || []).join("\n"),
            image: tour.image || "",
            location: tour.location || "",
            status: tour.status || "published",
            featured: tour.featured || false,
            route: (tour.route || []).map((stop) => ({
              place: stop.place?._id || stop.place || "",
              day: stop.day || 1,
              order: stop.order || 1,
              description: stop.description || "",
            })),
          });
        }
      } catch (requestError) {
        setError(getApiError(requestError, "Unable to load data."));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const { data } = await api.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((prev) => ({ ...prev, image: data.url }));
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to upload image."));
    } finally {
      setUploading(false);
    }
  };

  const handleRouteChange = (index, field, value) => {
    setForm((prev) => {
      const newRoute = [...prev.route];
      newRoute[index] = { ...newRoute[index], [field]: value };
      return { ...prev, route: newRoute };
    });
  };

  const addRouteStop = () => {
    setForm((prev) => ({
      ...prev,
      route: [
        ...prev.route,
        { place: "", day: prev.route.length + 1, order: prev.route.length + 1, description: "" },
      ],
    }));
  };

  const removeRouteStop = (index) => {
    setForm((prev) => ({
      ...prev,
      route: prev.route.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      slug: form.slug || undefined,
      shortDescription: form.shortDescription,
      description: form.description,
      days: Number(form.days),
      price: Number(form.price),
      discount: Number(form.discount) || 0,
      capacity: Number(form.capacity) || 20,
      availableSeats: Number(form.capacity) || 20,
      included: form.included
        ? form.included.split("\n").map((s) => s.trim()).filter(Boolean)
        : [],
      excluded: form.excluded
        ? form.excluded.split("\n").map((s) => s.trim()).filter(Boolean)
        : [],
      image: form.image,
      location: form.location,
      status: form.status,
      featured: form.featured,
      route: form.route
        .filter((stop) => stop.place)
        .map((stop, i) => ({
          place: stop.place,
          day: Number(stop.day) || i + 1,
          order: Number(stop.order) || i + 1,
          description: stop.description,
        })),
    };

    if (payload.route.length === 0) {
      setError("Tour must have at least one route stop.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      if (isEdit) {
        await api.put(`/tours/${id}`, payload);
      } else {
        await api.post("/tours", payload);
      }
      navigate("/admin/tours");
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to save tour."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-gray-600">Loading...</p>;
  }

  return (
    <div className="max-w-4xl space-y-5">
      <div>
        <Link to="/admin/tours" className="text-blue-600 hover:underline">
          Back to Tours
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">
          {isEdit ? "Edit Tour" : "Add Tour"}
        </h1>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border rounded-lg shadow-sm p-5 space-y-6">
        {/* Basic Info */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1">Name *</span>
              <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded-md px-3 py-2" required />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1">Slug</span>
              <input name="slug" value={form.slug} onChange={handleChange} placeholder="auto-generated" className="w-full border rounded-md px-3 py-2" />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1">Duration (days) *</span>
              <input name="days" type="number" min="1" value={form.days} onChange={handleChange} className="w-full border rounded-md px-3 py-2" required />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1">Price (PKR) *</span>
              <input name="price" type="number" min="0" value={form.price} onChange={handleChange} className="w-full border rounded-md px-3 py-2" required />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</span>
              <input name="discount" type="number" min="0" max="100" value={form.discount} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1">Capacity</span>
              <input name="capacity" type="number" min="1" value={form.capacity} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
            </label>
          </div>
          <label className="block mt-4">
            <span className="block text-sm font-medium text-gray-700 mb-1">Short Description</span>
            <input name="shortDescription" value={form.shortDescription} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
          </label>
          <label className="block mt-4">
            <span className="block text-sm font-medium text-gray-700 mb-1">Description *</span>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full border rounded-md px-3 py-2" required />
          </label>
        </div>

        {/* Image */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Image</h2>
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Upload Image</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full border rounded-md px-3 py-2" />
            {uploading && <span className="text-sm text-blue-600">Uploading...</span>}
          </label>
          <label className="block mt-2">
            <span className="block text-sm font-medium text-gray-700 mb-1">Image URL</span>
            <input name="image" value={form.image} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
          </label>
          {form.image && (
            <img src={form.image} alt="Preview" className="mt-2 h-32 object-cover rounded border" />
          )}
        </div>

        {/* Included / Excluded */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Included (one per line)</span>
            <textarea name="included" value={form.included} onChange={handleChange} rows={4} className="w-full border rounded-md px-3 py-2" placeholder="Hotel accommodation&#10;Transportation&#10;Tour guide" />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Excluded (one per line)</span>
            <textarea name="excluded" value={form.excluded} onChange={handleChange} rows={4} className="w-full border rounded-md px-3 py-2" placeholder="International flights&#10;Travel insurance&#10;Personal expenses" />
          </label>
        </div>

        {/* Route */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">Route</h2>
            <button type="button" onClick={addRouteStop} className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded">
              + Add Stop
            </button>
          </div>
          {form.route.length === 0 && (
            <p className="text-sm text-gray-500">No route stops added. Click "+ Add Stop" to begin.</p>
          )}
          {form.route.map((stop, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 mb-2 items-end">
              <div className="col-span-5">
                <label className="block text-xs font-medium text-gray-600">Place</label>
                <select value={stop.place} onChange={(e) => handleRouteChange(index, "place", e.target.value)} className="w-full border rounded px-2 py-1 text-sm" required>
                  <option value="">Select place</option>
                  {places.map((p) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600">Day</label>
                <input type="number" min="1" value={stop.day} onChange={(e) => handleRouteChange(index, "day", e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600">Order</label>
                <input type="number" min="1" value={stop.order} onChange={(e) => handleRouteChange(index, "order", e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600">Description</label>
                <input value={stop.description} onChange={(e) => handleRouteChange(index, "description", e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
              </div>
              <div className="col-span-1 flex justify-center">
                <button type="button" onClick={() => removeRouteStop(index)} className="text-red-500 hover:text-red-700 text-lg">&times;</button>
              </div>
            </div>
          ))}
        </div>

        {/* Status & Featured */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Status & Visibility</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1">Status</span>
              <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded-md px-3 py-2">
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </label>
            <label className="flex items-center gap-2 mt-6">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4" />
              <span className="text-sm font-medium text-gray-700">Featured Tour</span>
            </label>
          </div>
          <label className="block mt-4">
            <span className="block text-sm font-medium text-gray-700 mb-1">Location</span>
            <input name="location" value={form.location} onChange={handleChange} className="w-full border rounded-md px-3 py-2" placeholder="e.g., Northern Pakistan" />
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Link to="/admin/tours" className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200">Cancel</Link>
          <button type="submit" disabled={saving || uploading} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400">
            {saving ? "Saving..." : "Save Tour"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminTourForm;
