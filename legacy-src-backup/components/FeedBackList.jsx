import React from "react";

const FeedBackList = ({ feedBacks, onDelete }) => {
  return (
    <div className="space-y-4">
      {feedBacks.map((fb) => (
        <div
          key={fb._id || fb.id}
          className="bg-gray-50 border rounded-lg shadow p-4 flex justify-between"
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
          {onDelete && (
            <button
              onClick={() => onDelete(fb._id || fb.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 h-fit"
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default FeedBackList;
