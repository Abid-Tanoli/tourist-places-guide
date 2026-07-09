import React, { useEffect, useState } from "react";
import api from "../api/axios";

const getApiError = (error, fallback) => {
  const apiErrors = error.response?.data?.errors;
  if (apiErrors?.length) return apiErrors[0].message;
  return error.response?.data?.message || fallback;
};

const Booking = () => {
  const [tours, setTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState("");
  const [userType, setUserType] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [passport, setPassport] = useState("");
  const [cnic, setCnic] = useState("");
  const [warning, setWarning] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await api.get("/tours");
        setTours(data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load tours.");
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  const resetForm = () => {
    setSelectedTour("");
    setUserType("");
    setName("");
    setEmail("");
    setPhone("");
    setPassport("");
    setCnic("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");

    if (!selectedTour || !userType || !name.trim() || !email || !phone) {
      setWarning("Please fill in all required fields.");
      setTimeout(() => setWarning(""), 4000);
      return;
    }
    if (userType === "pakistani" && !cnic) {
      setWarning("CNIC is required for Pakistani visitors.");
      setTimeout(() => setWarning(""), 4000);
      return;
    }
    if (userType === "foreigner" && !passport) {
      setWarning("Passport number is required for foreign visitors.");
      setTimeout(() => setWarning(""), 4000);
      return;
    }

    const selectedTourDetails = tours.find((tour) => tour._id === selectedTour);

    try {
      setSubmitting(true);
      setWarning("");
      await api.post("/bookings", {
        tour: selectedTour,
        selectedTour: selectedTourDetails?.name,
        userType,
        name,
        email,
        phone,
        cnic,
        passport,
      });
      setSuccess("Booking submitted successfully!");
      resetForm();
    } catch (requestError) {
      setWarning(getApiError(requestError, "Unable to submit booking."));
      setTimeout(() => setWarning(""), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Book Your Tour
      </h1>

      {loading && (
        <div className="mb-4 text-gray-600 font-medium">Loading tours...</div>
      )}
      {error && <div className="mb-4 text-red-600 font-medium">{error}</div>}
      {warning && (
        <div className="mb-4 text-red-600 font-medium">{warning}</div>
      )}
      {success && (
        <div className="mb-4 text-green-600 font-medium">{success}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Select Tour
          </label>
          <select
            value={selectedTour}
            onChange={(e) => setSelectedTour(e.target.value)}
            disabled={loading || tours.length === 0}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Choose a Tour --</option>
            {tours.map((tour) => (
              <option key={tour._id} value={tour._id}>
                {tour.name} ({tour.days} days)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Visitor Type
          </label>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Type --</option>
            <option value="pakistani">Pakistani</option>
            <option value="foreigner">Foreigner</option>
          </select>
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Mobile Number
          </label>
          <input
            type="tel"
            placeholder="03xx-xxxxxxx"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {userType === "pakistani" && (
          <div>
            <label className="block font-medium text-gray-700 mb-1">CNIC</label>
            <input
              type="text"
              placeholder="12345-1234567-1"
              value={cnic}
              onChange={(e) => setCnic(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {userType === "foreigner" && (
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Passport Number
            </label>
            <input
              type="text"
              placeholder="Enter your Passport No"
              value={passport}
              onChange={(e) => setPassport(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting..." : "Submit Booking"}
        </button>
      </form>
    </div>
  );
};

export default Booking;
