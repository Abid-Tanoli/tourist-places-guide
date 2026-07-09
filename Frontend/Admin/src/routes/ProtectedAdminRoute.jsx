import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import api from "../api/axios";
import {
  clearAdminAuth,
  getAdminToken,
  getAdminUser,
  setAdminAuth,
} from "../utils/auth";

const AccessDenied = () => (
  <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
    <div className="bg-white border rounded-lg shadow-sm p-8 max-w-md text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
      <p className="text-gray-600">
        You are logged in, but your account does not have admin access.
      </p>
    </div>
  </div>
);

const ProtectedAdminRoute = () => {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const verifyAdmin = async () => {
      const token = getAdminToken();
      const storedUser = getAdminUser();

      if (!token) {
        setStatus("unauthenticated");
        return;
      }

      if (storedUser && storedUser.role !== "admin") {
        setStatus("denied");
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        if (data.user?.role === "admin") {
          setAdminAuth({ token, user: data.user });
          setStatus("allowed");
          return;
        }
        setStatus("denied");
      } catch {
        clearAdminAuth();
        setStatus("unauthenticated");
      }
    };

    verifyAdmin();
  }, []);

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center text-gray-600">
        Checking admin session...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/admin/login" replace />;
  }

  if (status === "denied") {
    return <AccessDenied />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;
