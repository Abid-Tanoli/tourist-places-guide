import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";

const PlaceDetails = () => {
  const { id } = useParams();
  const { user, toggleWishlist, isAuthenticated } = useAuth();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wishLoading, setWishLoading] = useState(false);

  const isWishlisted = user?.wishlist?.includes(id);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await api.get(`/places/${id}`);
        setPlace(data);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message || "Unable to load place."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
  }, [id]);

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to add to wishlist.");
      return;
    }
    setWishLoading(true);
    try {
      await toggleWishlist(id);
      toast.success(isWishlisted ? "Removed from wishlist." : "Added to wishlist!");
    } catch {
      toast.error("Failed to update wishlist.");
    } finally {
      setWishLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">Loading place...</div>
    );
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  if (!place) {
    return <div className="p-6 text-center text-gray-500">Place not found</div>;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Home
      </Link>

      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800">
        {place.name}
      </h1>

      <img
        src={place.image}
        alt={place.name}
        className="w-full h-auto rounded-lg mb-4 object-cover shadow-sm max-h-96"
      />

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {place.region}
        </span>
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          {place.category}
        </span>
        {place.featured && (
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
            Featured
          </span>
        )}
        <button
          onClick={handleWishlist}
          disabled={wishLoading}
          className={`ml-auto px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            isWishlisted
              ? "bg-red-100 text-red-700 hover:bg-red-200"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {isWishlisted ? "♥ Wishlisted" : "♡ Add to Wishlist"}
        </button>
      </div>

      {place.rating > 0 && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-yellow-500 text-lg">★</span>
          <span className="font-semibold text-gray-800">{place.rating}</span>
          {place.totalReviews > 0 && (
            <span className="text-gray-500 text-sm">({place.totalReviews} reviews)</span>
          )}
        </div>
      )}

      {place.shortDescription && (
        <p className="text-gray-600 mb-3 italic">{place.shortDescription}</p>
      )}

      <p className="mb-4 text-gray-700 whitespace-pre-line leading-relaxed">
        {place.description}
      </p>

      {place.bestTime && (
        <div className="mb-3 p-3 bg-blue-50 rounded-lg">
          <span className="font-bold text-blue-800">Best time to visit: </span>
          <span className="text-blue-700">{place.bestTime}</span>
        </div>
      )}

      {place.address && (
        <p className="mb-2 text-gray-600">
          <span className="font-semibold">Address:</span> {place.address}
        </p>
      )}

      {/* Entry Fee */}
      {place.entryFee && (place.entryFee.pakistani > 0 || place.entryFee.foreigner > 0) && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Entry Fee</h3>
          <div className="flex gap-4">
            {place.entryFee.pakistani > 0 && (
              <span className="text-gray-700">Pakistani: PKR {place.entryFee.pakistani.toLocaleString()}</span>
            )}
            {place.entryFee.foreigner > 0 && (
              <span className="text-gray-700">Foreigner: PKR {place.entryFee.foreigner.toLocaleString()}</span>
            )}
          </div>
        </div>
      )}

      {/* Facilities */}
      {place.facilities?.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold text-gray-800 mb-2">Facilities</h3>
          <div className="flex flex-wrap gap-2">
            {place.facilities.map((facility, i) => (
              <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                {facility}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Contact */}
      {place.contactInfo && (place.contactInfo.phone || place.contactInfo.email || place.contactInfo.website) && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Contact Information</h3>
          <div className="space-y-1 text-gray-700">
            {place.contactInfo.phone && <p>Phone: {place.contactInfo.phone}</p>}
            {place.contactInfo.email && <p>Email: {place.contactInfo.email}</p>}
            {place.contactInfo.website && (
              <p>
                Website:{" "}
                <a href={place.contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {place.contactInfo.website}
                </a>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Maps */}
      <div className="mt-4">
        {place.googleMapsUrl ? (
          <a
            href={place.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Open in Google Maps
          </a>
        ) : (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            View on Google Maps
          </a>
        )}
      </div>

      {/* Gallery */}
      {place.gallery?.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-gray-800 mb-3">Gallery</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {place.gallery.map((img, i) => (
              <img key={i} src={img.url} alt={img.alt || `${place.name} ${i + 1}`} className="w-full h-32 object-cover rounded-lg" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaceDetails;
