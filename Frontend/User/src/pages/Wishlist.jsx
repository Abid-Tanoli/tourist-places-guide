import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";

const Wishlist = () => {
  const { user, toggleWishlist } = useAuth();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistPlaces = async () => {
      if (!user?.wishlist?.length) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const results = await Promise.all(
          user.wishlist.map((id) => api.get(`/places/${id}`).then((res) => res.data))
        );
        setPlaces(results);
      } catch {
        toast.error("Failed to load wishlist places.");
      } finally {
        setLoading(false);
      }
    };
    fetchWishlistPlaces();
  }, [user?.wishlist]);

  const handleRemove = async (placeId) => {
    try {
      await toggleWishlist(placeId);
      setPlaces((prev) => prev.filter((p) => p._id !== placeId));
      toast.success("Removed from wishlist.");
    } catch {
      toast.error("Failed to remove from wishlist.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist</h1>

        {places.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500 text-lg mb-4">Your wishlist is empty.</p>
            <Link
              to="/"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Explore Places
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.map((place) => (
              <div key={place._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{place.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{place.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <Link
                      to={`/place/${place._id}`}
                      className="text-blue-600 text-sm font-medium hover:underline"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleRemove(place._id)}
                      className="text-red-500 text-sm font-medium hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
