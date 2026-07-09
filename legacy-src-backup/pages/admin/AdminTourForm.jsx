import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import { getApiError } from "./adminUtils";

const emptyTour = {
  name: "",
  description: "",
  days: "",
  price: "",
};

const createEmptyStop = (index = 0) => ({
  place: "",
  day: index + 1,
  order: index + 1,
});

const AdminTourForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(emptyTour);
  const [routeStops, setRouteStops] = useState([createEmptyStop()]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const placesRequest = api.get("/places");
        const tourRequest = isEdit ? api.get(`/tours/${id}`) : null;
        const [placesResponse, tourResponse] = await Promise.all([
          placesRequest,
          tourRequest,
        ]);

        setPlaces(placesResponse.data);

        if (tourResponse) {
          const tour = tourResponse.data;
          setForm({
            name: tour.name || "",
            description: tour.description || "",
            days: tour.days ?? "",
            price: tour.price ?? "",
          });
          setRouteStops(
            (tour.route || []).map((stop, index) => ({
              place: stop.place?._id || "",
              day: stop.day || index + 1,
              order: stop.order || index + 1,
            }))
          );
        }
      } catch (requestError) {
        setError(getApiError(requestError, "Unable to load tour form data."));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateStop = (index, field, value) => {
    setRouteStops((prev) =>
      prev.map((stop, stopIndex) =>
        stopIndex === index ? { ...stop, [field]: value } : stop
      )
    );
  };

  const addStop = () => {
    setRouteStops((prev) => [...prev, createEmptyStop(prev.length)]);
  };

  const removeStop = (index) => {
    setRouteStops((prev) => prev.filter((_, stopIndex) => stopIndex !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      days: Number(form.days),
      price: Number(form.price),
      route: routeStops.map((stop, index) => ({
        place: stop.place,
        day: Number(stop.day) || index + 1,
        order: Number(stop.order) || index + 1,
      })),
    };

    try {
      setSaving(true);
      setError("");
      if (isEdit) {
        await api.put(`/tours/${id}`, payload);
      } else {
        await api.post("/tours", payload);
      }
      navigate("/admin/tours");
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to save tour."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-gray-600">Loading tour form...</p>;
  }

  return (
    <div className="max-w-5xl space-y-5">
      <div>
        <Link to="/admin/tours" className="text-blue-600 hover:underline">
          Back to Tours
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">
          {isEdit ? "Edit Tour" : "Add Tour"}
        </h1>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-lg shadow-sm p-5 space-y-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="block md:col-span-3">
            <span className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">
              Days
            </span>
            <input
              name="days"
              type="number"
              min="1"
              value={form.days}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </span>
            <input
              name="price"
              type="number"
              min="0"
              value={form.price}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </label>
        </div>

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full border rounded-md px-3 py-2"
            required
          />
        </label>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Route</h2>
            <button
              type="button"
              onClick={addStop}
              className="px-3 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800"
            >
              Add Stop
            </button>
          </div>

          <div className="space-y-3">
            {routeStops.map((stop, index) => (
              <div
                key={`${index}-${stop.place}`}
                className="grid grid-cols-1 md:grid-cols-[1fr_100px_100px_auto] gap-3 bg-gray-50 border rounded-lg p-3"
              >
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-1">
                    Place
                  </span>
                  <select
                    value={stop.place}
                    onChange={(e) => updateStop(index, "place", e.target.value)}
                    className="w-full border rounded-md px-3 py-2"
                    required
                  >
                    <option value="">Choose place</option>
                    {places.map((place) => (
                      <option key={place._id} value={place._id}>
                        {place.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-1">
                    Day
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={stop.day}
                    onChange={(e) => updateStop(index, "day", e.target.value)}
                    className="w-full border rounded-md px-3 py-2"
                    required
                  />
                </label>

                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-1">
                    Order
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={stop.order}
                    onChange={(e) => updateStop(index, "order", e.target.value)}
                    className="w-full border rounded-md px-3 py-2"
                    required
                  />
                </label>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeStop(index)}
                    disabled={routeStops.length === 1}
                    className="w-full px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            to="/admin/tours"
            className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {saving ? "Saving..." : "Save Tour"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminTourForm;
