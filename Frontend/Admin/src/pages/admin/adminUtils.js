export const getApiError = (error, fallback) => {
  const apiErrors = error.response?.data?.errors;
  if (apiErrors?.length) return apiErrors[0].message;
  return error.response?.data?.message || fallback;
};

export const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
};

const STATUS_STYLES = {
  confirmed: "bg-green-100 text-green-700",
  approved: "bg-green-100 text-green-700",
  active: "bg-green-100 text-green-700",
  published: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  rejected: "bg-red-100 text-red-700",
  archived: "bg-red-100 text-red-700",
  closed: "bg-red-100 text-red-700",
  pending: "bg-yellow-100 text-yellow-700",
  draft: "bg-yellow-100 text-yellow-700",
  new: "bg-yellow-100 text-yellow-700",
};

export const statusClassName = (status) =>
  STATUS_STYLES[status] || "bg-gray-100 text-gray-700";
