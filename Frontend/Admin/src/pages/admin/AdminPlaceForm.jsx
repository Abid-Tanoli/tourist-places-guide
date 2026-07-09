import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import { getApiError } from "./adminUtils";

const emptyPlace = {
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  region: "",
  category: "",
  address: "",
  rating: "",
  bestTime: "",
  image: "",
  lat: "",
  lng: "",
  googleMapsUrl: "",
  website: "",
  featured: false,
  status: "published",
  facilities: "",
  entryFeePakistani: "",
  entryFeeForeigner: "",
  contactPhone: "",
  contactEmail: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
};

const AdminPlaceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(emptyPlace);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchPlace = async () => {
      if (!isEdit) return;
      try {
        setLoading(true);
        setError("");
        const { data } = await api.get(`/places/${id}`);
        setForm({
          name: data.name || "",
          slug: data.slug || "",
          shortDescription: data.shortDescription || "",
          description: data.description || "",
          region: data.region || "",
          category: data.category || "",
          address: data.address || "",
          rating: data.rating ?? "",
          bestTime: data.bestTime || "",
          image: data.image || "",
          lat: data.lat ?? "",
          lng: data.lng ?? "",
          googleMapsUrl: data.googleMapsUrl || "",
          website: data.website || "",
          featured: data.featured || false,
          status: data.status || "published",
          facilities: (data.facilities || []).join(", "),
          entryFeePakistani: data.entryFee?.pakistani ?? "",
          entryFeeForeigner: data.entryFee?.foreigner ?? "",
          contactPhone: data.contactInfo?.phone || "",
          contactEmail: data.contactInfo?.email || "",
          seoTitle: data.seoFields?.title || "",
          seoDescription: data.seoFields?.description || "",
          seoKeywords: (data.seoFields?.keywords || []).join(", "),
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      slug: form.slug || undefined,
      shortDescription: form.shortDescription,
      description: form.description,
      region: form.region,
      category: form.category,
      address: form.address,
      rating: Number(form.rating),
      bestTime: form.bestTime,
      image: form.image,
      lat: Number(form.lat),
      lng: Number(form.lng),
      googleMapsUrl: form.googleMapsUrl,
      website: form.website,
      featured: form.featured,
      status: form.status,
      facilities: form.facilities
        ? form.facilities.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      entryFee: {
        pakistani: Number(form.entryFeePakistani) || 0,
        foreigner: Number(form.entryFeeForeigner) || 0,
        currency: "PKR",
      },
      contactInfo: {
        phone: form.contactPhone,
        email: form.contactEmail,
      },
      seoFields: {
        title: form.seoTitle,
        description: form.seoDescription,
        keywords: form.seoKeywords
          ? form.seoKeywords.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      },
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
              <input name="slug" value={form.slug} onChange={handleChange} placeholder="auto-generated from name" className="w-full border rounded-md px-3 py-2" />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1">Region *</span>
              <input name="region" value={form.region} onChange={handleChange} className="w-full border rounded-md px-3 py-2" required />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1">Category *</span>
              <input name="category" value={form.category} onChange={handleChange} className="w-full border rounded-md px-3 py-2" required />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1">Best Time</span>
              <input name="bestTime" value={form.bestTime} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1">Rating *</span>
              <input name="rating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={handleChange} className="w-full border rounded-md px-3 py-2" required />
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

        {/* Location */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-1">Latitude *</span>
                <input name="lat" type="number" step="any" value={form.lat} onChange={handleChange} className="w-full border rounded-md px-3 py-2" required />
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-1">Longitude *</span>
                <input name="lng" type="number" step="any" value={form.lng} onChange={handleChange} className="w-full border rounded-md px-3 py-2" required />
              </label>
            </div>
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1">Address</span>
              <input name="address" value={form.address} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1">Google Maps URL</span>
              <input name="googleMapsUrl" value={form.googleMapsUrl} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1">Website</span>
              <input name="website" value={form.website} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
            </label>
          </div>
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
            <textarea name="image" value={form.image} onChange={handleChange} rows={2} className="w-full border rounded-md px-3 py-2" required />
          </label>
          {form.image && (
            <img src={form.image} alt="Preview" className="mt-2 h-32 object-cover rounded border" />
          )}
        </div>

        {/* Entry Fee & Facilities */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Entry Fee & Facilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1">Entry Fee (Pakistani) PKR</span>
              <input name="entryFeePakistani" type="number" min="0" value={form.entryFeePakistani} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1">Entry Fee (Foreigner) PKR</span>
              <input name="entryFeeForeigner" type="number" min="0" value={form.entryFeeForeigner} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
            </label>
          </div>
          <label className="block mt-4">
            <span className="block text-sm font-medium text-gray-700 mb-1">Facilities (comma-separated)</span>
            <input name="facilities" value={form.facilities} onChange={handleChange} placeholder="Parking, Restrooms, Food Court" className="w-full border rounded-md px-3 py-2" />
          </label>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1">Phone</span>
              <input name="contactPhone" value={form.contactPhone} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1">Email</span>
              <input name="contactEmail" type="email" value={form.contactEmail} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
            </label>
          </div>
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
                <option value="archived">Archived</option>
              </select>
            </label>
            <label className="flex items-center gap-2 mt-6">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4" />
              <span className="text-sm font-medium text-gray-700">Featured Place</span>
            </label>
          </div>
        </div>

        {/* SEO */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">SEO</h2>
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">SEO Title</span>
            <input name="seoTitle" value={form.seoTitle} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
          </label>
          <label className="block mt-4">
            <span className="block text-sm font-medium text-gray-700 mb-1">SEO Description</span>
            <textarea name="seoDescription" value={form.seoDescription} onChange={handleChange} rows={2} className="w-full border rounded-md px-3 py-2" />
          </label>
          <label className="block mt-4">
            <span className="block text-sm font-medium text-gray-700 mb-1">SEO Keywords (comma-separated)</span>
            <input name="seoKeywords" value={form.seoKeywords} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Link to="/admin/places" className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200">Cancel</Link>
          <button type="submit" disabled={saving || uploading} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400">
            {saving ? "Saving..." : "Save Place"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPlaceForm;
