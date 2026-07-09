import React from "react";

const FeedBackList = ({ feedBacks }) => {
  return (
    <div className="space-y-4">
      {feedBacks.map((fb) => (
        <div
          key={fb._id || fb.id}
          className="bg-gray-50 border rounded-lg shadow p-4"
        >
          <div>
            <h3 className="font-bold text-lg text-blue-700">{fb.name}</h3>
            {fb.email && <p className="text-sm text-gray-600">{fb.email}</p>}
            {fb.country && (
              <p className="text-sm text-gray-600">{fb.country}</p>
            )}
            {fb.rating && (
              <p className="text-sm text-gray-700">Rating: {fb.rating}/5</p>
            )}
            <p className="mt-2 text-gray-800">{fb.feedBackText}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeedBackList;
