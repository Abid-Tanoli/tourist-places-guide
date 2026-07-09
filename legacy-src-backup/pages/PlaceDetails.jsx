import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

const PlaceDetails = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    <div className="p-4 text-xl sm:p-6 md:p-8 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Home
      </Link>
      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800">
        {place.name}
      </h1>
      <img
        src={place.image}
        alt={place.name}
        className="w-full h-auto rounded-lg mb-4 object-cover shadow-sm"
      />
      <p className="text-blue-800 mb-2 font-bold">{place.region}</p>
      <p className="text-gray-600 text-sm">{place.category}</p>
      {place.rating && <p className="mt-2 font-medium">Rating: {place.rating}</p>}
      <p className="mb-2 font-bold text-gray-700 whitespace-pre-line">
        {place.description}
      </p>
      {place.bestTime && (
        <p className="text-blue-600 mb-2 font-bold">
          Best time to visit: {place.bestTime}
        </p>
      )}
    </div>
  );
};

export default PlaceDetails;
