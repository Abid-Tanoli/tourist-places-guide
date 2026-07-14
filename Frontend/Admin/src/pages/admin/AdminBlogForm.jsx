import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import { getApiError } from "./adminUtils";

const AdminBlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    author: "Admin",
    tags: "",
    status: "draft",
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    const fetchPost = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/posts/admin`);
        const post = data.posts?.find((p) => p._id === id);
        if (post) {
          setForm({
            title: post.title || "",
            slug: post.slug || "",
            excerpt: post.excerpt || "",
            content: post.content || "",
            coverImage: post.coverImage || "",
            author: post.author || "Admin",
            tags: (post.tags || []).join(", "),
            status: post.status || "draft",
          });
        } else {
          setError("Post not found.");
        }
      } catch (requestError) {
        setError(getApiError(requestError, "Unable to load post."));
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      slug: form.slug || undefined,
      excerpt: form.excerpt,
      content: form.content,
      coverImage: form.coverImage,
      author: form.author,
      tags: form.tags
        ? form.tags.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      status: form.status,
    };

    try {
      setSaving(true);
      setError("");
      if (isEdit) {
        await api.put(`/posts/${id}`, payload);
      } else {
        await api.post("/posts", payload);
      }
      navigate("/admin/blog");
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to save post."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-gray-600">Loading post...</p>;
  }

  return (
    <div className="max-w-4xl space-y-5">
      <div>
        <Link to="/admin/blog" className="text-blue-600 hover:underline">
          Back to Blog
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">
          {isEdit ? "Edit Post" : "New Post"}
        </h1>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border rounded-lg shadow-sm p-5 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Title *</span>
            <input name="title" value={form.title} onChange={handleChange} className="w-full border rounded-md px-3 py-2" required />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Slug</span>
            <input name="slug" value={form.slug} onChange={handleChange} placeholder="auto-generated from title" className="w-full border rounded-md px-3 py-2" />
          </label>
        </div>

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1">Excerpt</span>
          <input name="excerpt" value={form.excerpt} onChange={handleChange} placeholder="Brief summary for card previews" className="w-full border rounded-md px-3 py-2" />
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1">Content * (supports HTML / Markdown)</span>
          <textarea name="content" value={form.content} onChange={handleChange} rows={12} className="w-full border rounded-md px-3 py-2 font-mono text-sm" required />
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</span>
          <textarea name="coverImage" value={form.coverImage} onChange={handleChange} rows={2} className="w-full border rounded-md px-3 py-2" />
        </label>
        {form.coverImage && (
          <img src={form.coverImage} alt="Preview" className="h-32 object-cover rounded border" />
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Author</span>
            <input name="author" value={form.author} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</span>
            <input name="tags" value={form.tags} onChange={handleChange} placeholder="travel, hunza, mountains" className="w-full border rounded-md px-3 py-2" />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Status</span>
            <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded-md px-3 py-2">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Link to="/admin/blog" className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200">Cancel</Link>
          <button type="submit" disabled={saving} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400">
            {saving ? "Saving..." : "Save Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminBlogForm;
