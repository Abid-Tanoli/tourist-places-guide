import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";

const getApiError = (error, fallback) => {
  const apiErrors = error.response?.data?.errors;
  if (apiErrors?.length) return apiErrors[0].message;
  return error.response?.data?.message || fallback;
};

const Booking = () => {
  const { user, isAuthenticated } = useAuth();
  const [tours, setTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState("");
  const [userType, setUserType] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [passport, setPassport] = useState("");
  const [cnic, setCnic] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [createdBooking, setCreatedBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await api.get("/tours");
        const toursArray = Array.isArray(data) ? data : data.tours || [];
        setTours(toursArray);
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
    if (!isAuthenticated) {
      setName("");
      setEmail("");
      setPhone("");
    }
    setPassport("");
    setCnic("");
    setAdults(1);
    setChildren(0);
    setNotes("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedTour || !userType || !name.trim() || !email || !phone) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (userType === "pakistani" && !cnic) {
      toast.error("CNIC is required for Pakistani visitors.");
      return;
    }
    if (userType === "foreigner" && !passport) {
      toast.error("Passport number is required for foreign visitors.");
      return;
    }

    const selectedTourDetails = tours.find((tour) => tour._id === selectedTour);

    try {
      setSubmitting(true);
      const { data } = await api.post("/bookings", {
        tour: selectedTour,
        selectedTour: selectedTourDetails?.name,
        userType,
        name,
        email,
        phone,
        cnic,
        passport,
        guests: { adults: Number(adults), children: Number(children) },
        notes,
      });
      setCreatedBooking({ ...data, tour: selectedTourDetails });
      toast.success("Booking created! Choose a payment method below.");
    } catch (requestError) {
      toast.error(getApiError(requestError, "Unable to submit booking."));
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayment = async () => {
    if (!createdBooking) return;
    setProcessingPayment(true);

    try {
      if (paymentMethod === "cod") {
        await api.post("/payment/confirm", { paymentIntentId: null, bookingId: createdBooking._id, method: "cod" });
        toast.success("Booking confirmed! Pay on arrival.");
        setCreatedBooking(null);
        resetForm();
      } else if (paymentMethod === "stripe") {
        const { data } = await api.post("/payment/create-intent", { bookingId: createdBooking._id });
        toast.success(`Stripe payment of PKR ${data.amount.toLocaleString()} initiated. (Demo mode)`);
        await api.post("/payment/confirm", { paymentIntentId: data.paymentIntentId });
        toast.success("Payment confirmed!");
        setCreatedBooking(null);
        resetForm();
      } else if (paymentMethod === "easypaisa") {
        const { data } = await api.post("/payment/easypaisa", { bookingId: createdBooking._id, phone });
        toast.success(data.instructions || "EasyPaisa payment initiated.");
        setCreatedBooking(null);
        resetForm();
      } else if (paymentMethod === "jazzcash") {
        const { data } = await api.post("/payment/jazzcash", { bookingId: createdBooking._id, phone });
        toast.success(data.instructions || "JazzCash payment initiated.");
        setCreatedBooking(null);
        resetForm();
      }
    } catch (requestError) {
      toast.error(getApiError(requestError, "Payment failed."));
    } finally {
      setProcessingPayment(false);
    }
  };

  const selectedTourDetails = tours.find((tour) => tour._id === selectedTour);
  const totalPrice = selectedTourDetails
    ? (userType === "foreigner" ? selectedTourDetails.foreignerPrice : selectedTourDetails.pakistaniPrice) * adults
    : 0;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Book Your Tour
      </h1>

      {loading && <div className="mb-4 text-gray-600 font-medium">Loading tours...</div>}
      {error && <div className="mb-4 text-red-600 font-medium">{error}</div>}

      {createdBooking ? (
        <div className="space-y-6">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800">Booking Created Successfully!</h3>
            <p className="text-sm text-green-700 mt-1">
              Tour: {createdBooking.tour?.name || createdBooking.selectedTour} | Total: PKR {totalPrice.toLocaleString()}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Select Payment Method</h3>
            <div className="space-y-3">
              {[
                { id: "cod", label: "Cash on Delivery", desc: "Pay when you arrive" },
                { id: "stripe", label: "Credit/Debit Card", desc: "Pay securely online (Stripe)" },
                { id: "easypaisa", label: "EasyPaisa", desc: "Mobile wallet payment" },
                { id: "jazzcash", label: "JazzCash", desc: "Mobile wallet payment" },
              ].map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${
                    paymentMethod === method.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{method.label}</p>
                    <p className="text-sm text-gray-500">{method.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setCreatedBooking(null)}
              className="flex-1 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition font-medium"
            >
              Edit Booking
            </button>
            <button
              onClick={handlePayment}
              disabled={processingPayment}
              className="flex-1 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:bg-gray-400 font-semibold"
            >
              {processingPayment ? "Processing..." : paymentMethod === "cod" ? "Confirm Booking" : `Pay PKR ${totalPrice.toLocaleString()}`}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Select Tour *</label>
            <select
              value={selectedTour}
              onChange={(e) => setSelectedTour(e.target.value)}
              disabled={loading || tours.length === 0}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Choose a Tour --</option>
              {tours.map((tour) => (
                <option key={tour._id} value={tour._id}>
                  {tour.name} ({tour.days} days) - PKR {tour.price?.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Visitor Type *</label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Select Type --</option>
              <option value="pakistani">Pakistani</option>
              <option value="foreigner">Foreigner</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Mobile Number *</label>
            <input
              type="tel"
              placeholder="03xx-xxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {userType === "pakistani" && (
            <div>
              <label className="block font-medium text-gray-700 mb-1">CNIC *</label>
              <input
                type="text"
                placeholder="12345-1234567-1"
                value={cnic}
                onChange={(e) => setCnic(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          {userType === "foreigner" && (
            <div>
              <label className="block font-medium text-gray-700 mb-1">Passport Number *</label>
              <input
                type="text"
                placeholder="Enter your Passport No"
                value={passport}
                onChange={(e) => setPassport(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Adults *</label>
              <input
                type="number"
                min="1"
                value={adults}
                onChange={(e) => setAdults(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Children</label>
              <input
                type="number"
                min="0"
                value={children}
                onChange={(e) => setChildren(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              placeholder="Any special requirements or notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {selectedTour && totalPrice > 0 && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Total: <span className="font-bold text-gray-900">PKR {totalPrice.toLocaleString()}</span>
                {userType && ` (${userType === "foreigner" ? "Foreigner" : "Pakistani"} rate × ${adults} adult${adults > 1 ? "s" : ""})`}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
          >
            {submitting ? "Creating Booking..." : "Create Booking & Pay"}
          </button>
        </form>
      )}
    </div>
  );
};

export default Booking;
