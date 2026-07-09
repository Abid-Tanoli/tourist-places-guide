import React, { useEffect, useState } from "react";
import api from "../api/axios";
import FeedBackList from "../components/FeedBackList";

const getApiError = (error, fallback) => {
  const apiErrors = error.response?.data?.errors;
  if (apiErrors?.length) return apiErrors[0].message;
  return error.response?.data?.message || fallback;
};

const emptyFeedback = {
  name: "",
  email: "",
  country: "",
  rating: "",
  feedBackText: "",
};

const Feedback = () => {
  const [feedBack, setFeedBack] = useState(emptyFeedback);
  const [allFeedBack, setAllFeedBack] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await api.get("/feedback");
        setAllFeedBack(data);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message || "Unable to load feedback."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedBack((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedBack.name.trim() || !feedBack.feedBackText.trim()) {
      setWarning("Name and feedback cannot be empty!");
      setTimeout(() => setWarning(""), 4000);
      return;
    }

    try {
      setSubmitted(true);
      setWarning("");
      const { data } = await api.post("/feedback", {
        ...feedBack,
        rating: feedBack.rating ? Number(feedBack.rating) : undefined,
      });
      setAllFeedBack((prev) => [data, ...prev]);
      setFeedBack(emptyFeedback);
      setTimeout(() => setSubmitted(false), 2000);
    } catch (requestError) {
      setWarning(getApiError(requestError, "Unable to submit feedback."));
      setSubmitted(false);
      setTimeout(() => setWarning(""), 5000);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-gray-800 text-center">
        Tourist Feedback
      </h1>

      {warning && (
        <div className="mb-4 p-3 text-yellow-800 bg-yellow-100 border border-yellow-400 rounded-md text-center">
          {warning}
        </div>
      )}
      {submitted && (
        <p className="text-green-600 text-center text-lg font-semibold mb-4">
          Feedback submitted successfully!
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 space-y-5 border"
      >
        <div>
          <label className="block font-medium text-gray-700">Name</label>
          <input
            name="name"
            value={feedBack.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Email</label>
          <input
            name="email"
            value={feedBack.email}
            onChange={handleChange}
            type="email"
            className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Country</label>
          <input
            name="country"
            value={feedBack.country}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <p className="font-medium text-gray-800">Your Experience</p>
          <div className="flex gap-5 mt-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <label key={value} className="cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  value={value}
                  checked={feedBack.rating === String(value)}
                  onChange={handleChange}
                  className="hidden"
                />
                <span
                  className={`text-3xl ${
                    feedBack.rating === String(value)
                      ? "opacity-100 scale-125"
                      : "opacity-50"
                  }`}
                >
                  {["😡", "🙁", "😐", "🙂", "😀"][value - 1]}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-medium text-gray-700">Feedback</label>
          <textarea
            name="feedBackText"
            value={feedBack.feedBackText}
            onChange={handleChange}
            rows={4}
            className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={submitted}
          className={`w-full py-2 rounded-lg font-semibold transition ${
            submitted
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {submitted ? "Submitting..." : "Submit"}
        </button>
      </form>

      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Previous Feedback
        </h2>
        {loading && (
          <p className="text-gray-600 text-center">Loading feedback...</p>
        )}
        {error && <p className="text-red-600 text-center">{error}</p>}
        {!loading && !error && allFeedBack.length === 0 && (
          <p className="text-gray-600 text-center">No feedback submitted yet.</p>
        )}
        {!loading && !error && allFeedBack.length > 0 && (
          <FeedBackList feedBacks={allFeedBack} />
        )}
      </div>
    </div>
  );
};

export default Feedback;
