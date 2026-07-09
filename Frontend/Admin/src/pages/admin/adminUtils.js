export const getApiError = (error, fallback) => {
  const apiErrors = error.response?.data?.errors;
  if (apiErrors?.length) return apiErrors[0].message;
  return error.response?.data?.message || fallback;
};

export const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
};

export const statusClassName = (status) => {
  if (status === "confirmed") return "bg-green-100 text-green-700";
  if (status === "cancelled") return "bg-red-100 text-red-700";
  return "bg-yellow-100 text-yellow-700";
};
