import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { getApiError } from "./adminUtils";

const AdminBlog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = statusFilter ? `?status=${statusFilter}` : "";
      const { data } = await api.get(`/posts/admin${params}`);
      setPosts(data.posts || []);
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to load posts."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [statusFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await api.delete(`/posts/${id}`);
      fetchPosts();
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to delete post."));
    }
  };

  const handleToggleStatus = async (post) => {
    const newStatus = post.status === "published" ? "draft" : "published";
    try {
      await api.put(`/posts/${post._id}`, { status: newStatus });
      fetchPosts();
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to update post status."));
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-500">Manage blog content and articles.</p>
        </div>
        <Link
          to="/admin/blog/add"
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium"
        >
          + New Post
        </Link>
      </div>

      <div className="flex gap-2">
        {["", "published", "draft"].map((s) => (
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

      {!loading && posts.length === 0 && (
        <p className="text-gray-600">No posts found. Create your first blog post!</p>
      )}

      {!loading && posts.length > 0 && (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post._id} className="bg-white border rounded-lg shadow-sm p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900 truncate">{post.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${post.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {post.status}
                    </span>
                  </div>
                  {post.excerpt && <p className="text-sm text-gray-500 mt-1 line-clamp-1">{post.excerpt}</p>}
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span>By {post.author}</span>
                    {post.publishedAt && <span>Published {new Date(post.publishedAt).toLocaleDateString()}</span>}
                    {post.tags?.length > 0 && (
                      <span>Tags: {post.tags.join(", ")}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => handleToggleStatus(post)} className={`px-2 py-1 text-xs rounded ${post.status === "published" ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`}>
                    {post.status === "published" ? "Unpublish" : "Publish"}
                  </button>
                  <Link to={`/admin/blog/edit/${post._id}`} className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(post._id)} className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700">
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

export default AdminBlog;
