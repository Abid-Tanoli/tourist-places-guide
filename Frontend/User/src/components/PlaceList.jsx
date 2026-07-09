import React from "react";
import PlaceCard from "./PlaceCard";

const PlaceList = ({ places }) => {
  if (!places || places.length === 0) {
    return (
      <div className="text-center text-gray-500 text-lg mt-8">
        No places found. Try adjusting filters or search.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {places.map((place) => (
        <PlaceCard key={place._id || place.id} place={place} />
      ))}
    </div>
  );
};

export default PlaceList;
