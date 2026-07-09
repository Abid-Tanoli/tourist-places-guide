export const getAdminToken = () => localStorage.getItem("adminToken");

export const getAdminUser = () => {
  const storedUser = localStorage.getItem("adminUser");

  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem("adminUser");
    return null;
  }
};

export const setAdminAuth = ({ token, user }) => {
  localStorage.setItem("adminToken", token);
  localStorage.setItem("adminUser", JSON.stringify(user));
};

export const clearAdminAuth = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminUser");
};

export const isStoredAdmin = () => {
  const user = getAdminUser();
  return Boolean(getAdminToken() && user?.role === "admin");
};
