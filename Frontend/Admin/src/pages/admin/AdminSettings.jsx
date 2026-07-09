import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { getApiError } from "./adminUtils";
import toast from "react-hot-toast";

const AdminSettings = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("general");
  const [form, setForm] = useState({});

  const tabs = ["general", "booking", "payment", "email", "social", "seo"];

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/settings");
      setSettings(data);
      const formObj = {};
      data.forEach((s) => { formObj[s.key] = s.value; });
      setForm(formObj);
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to load settings."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSettings(); }, []);

  const handleSave = async () => {
    try {
      const settingsToSave = Object.entries(form).map(([key, value]) => {
        const existing = settings.find((s) => s.key === key);
        return { key, value, category: existing?.category || activeTab, description: existing?.description || "" };
      });
      await api.put("/settings", { settings: settingsToSave });
      toast.success("Settings saved!");
    } catch (requestError) {
      toast.error(getApiError(requestError, "Failed to save settings."));
    }
  };

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const renderField = (key, label, type = "text", placeholder = "") => (
    <div key={key}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {type === "textarea" ? (
        <textarea
          value={form[key] || ""}
          onChange={(e) => updateField(key, e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder={placeholder}
          rows={3}
        />
      ) : type === "checkbox" ? (
        <input
          type="checkbox"
          checked={!!form[key]}
          onChange={(e) => updateField(key, e.target.checked)}
          className="h-4 w-4 text-blue-600 rounded"
        />
      ) : (
        <input
          type={type}
          value={form[key] || ""}
          onChange={(e) => updateField(key, e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder={placeholder}
        />
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="space-y-4">
            {renderField("siteName", "Site Name", "text", "Tourist Places Guide")}
            {renderField("siteDescription", "Site Description", "textarea", "Explore Pakistan's best tourist destinations")}
            {renderField("contactEmail", "Contact Email", "email", "contact@example.com")}
            {renderField("contactPhone", "Contact Phone", "tel", "+92 300 1234567")}
            {renderField("siteLogo", "Logo URL", "text", "https://example.com/logo.png")}
          </div>
        );
      case "booking":
        return (
          <div className="space-y-4">
            {renderField("advancePaymentPercent", "Advance Payment %", "number", "50")}
            {renderField("cancellationHours", "Free Cancellation Hours", "number", "24")}
            {renderField("maxGuestsPerBooking", "Max Guests Per Booking", "number", "20")}
            {renderField("bookingConfirmationRequired", "Require Manual Confirmation", "checkbox")}
          </div>
        );
      case "payment":
        return (
          <div className="space-y-4">
            {renderField("stripeEnabled", "Enable Stripe", "checkbox")}
            {renderField("easypaisaEnabled", "Enable EasyPaisa", "checkbox")}
            {renderField("jazzcashEnabled", "Enable JazzCash", "checkbox")}
            {renderField("codEnabled", "Enable Cash on Delivery", "checkbox")}
            {renderField("currency", "Default Currency", "text", "PKR")}
          </div>
        );
      case "email":
        return (
          <div className="space-y-4">
            {renderField("smtpHost", "SMTP Host", "text", "smtp.gmail.com")}
            {renderField("smtpPort", "SMTP Port", "number", "587")}
            {renderField("smtpUser", "SMTP Username", "text", "user@gmail.com")}
            {renderField("smtpPass", "SMTP Password", "password", "")}
            {renderField("emailFromName", "From Name", "text", "Tourist Guide")}
          </div>
        );
      case "social":
        return (
          <div className="space-y-4">
            {renderField("facebookUrl", "Facebook URL", "url", "https://facebook.com/...")}
            {renderField("instagramUrl", "Instagram URL", "url", "https://instagram.com/...")}
            {renderField("twitterUrl", "Twitter URL", "url", "https://twitter.com/...")}
            {renderField("youtubeUrl", "YouTube URL", "url", "https://youtube.com/...")}
          </div>
        );
      case "seo":
        return (
          <div className="space-y-4">
            {renderField("metaTitle", "Meta Title", "text", "Tourist Places Guide - Explore Pakistan")}
            {renderField("metaDescription", "Meta Description", "textarea", "Discover Pakistan's best tourist destinations...")}
            {renderField("ogImage", "OG Image URL", "text", "https://example.com/og-image.jpg")}
            {renderField("googleAnalyticsId", "Google Analytics ID", "text", "G-XXXXXXXXXX")}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Configure your application settings.</p>
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {loading && <p className="text-gray-600">Loading...</p>}

      {!loading && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex border-b overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium capitalize whitespace-nowrap ${
                  activeTab === tab
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6">
            {renderTabContent()}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
