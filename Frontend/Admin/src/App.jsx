import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute";

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminForgotPassword = lazy(() => import("./pages/admin/AdminForgotPassword"));
const AdminResetPassword = lazy(() => import("./pages/admin/AdminResetPassword"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminPlaces = lazy(() => import("./pages/admin/AdminPlaces"));
const AdminPlaceForm = lazy(() => import("./pages/admin/AdminPlaceForm"));
const AdminTours = lazy(() => import("./pages/admin/AdminTours"));
const AdminTourForm = lazy(() => import("./pages/admin/AdminTourForm"));
const AdminBookings = lazy(() => import("./pages/admin/AdminBookings"));
const AdminFeedback = lazy(() => import("./pages/admin/AdminFeedback"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminRegions = lazy(() => import("./pages/admin/AdminRegions"));
const AdminReviews = lazy(() => import("./pages/admin/AdminReviews"));
const AdminFAQ = lazy(() => import("./pages/admin/AdminFAQ"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminReports = lazy(() => import("./pages/admin/AdminReports"));

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

function SuspenseWrapper({ children }) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/admin/login" replace />,
  },
  {
    path: "/admin/login",
    element: (
      <SuspenseWrapper>
        <AdminLogin />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/admin/forgot-password",
    element: (
      <SuspenseWrapper>
        <AdminForgotPassword />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/admin/reset-password/:token",
    element: (
      <SuspenseWrapper>
        <AdminResetPassword />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/admin",
    element: <ProtectedAdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/admin/dashboard" replace />,
          },
          {
            path: "dashboard",
            element: (
              <SuspenseWrapper>
                <AdminDashboard />
              </SuspenseWrapper>
            ),
          },
          {
            path: "places",
            element: (
              <SuspenseWrapper>
                <AdminPlaces />
              </SuspenseWrapper>
            ),
          },
          {
            path: "places/add",
            element: (
              <SuspenseWrapper>
                <AdminPlaceForm />
              </SuspenseWrapper>
            ),
          },
          {
            path: "places/edit/:id",
            element: (
              <SuspenseWrapper>
                <AdminPlaceForm />
              </SuspenseWrapper>
            ),
          },
          {
            path: "tours",
            element: (
              <SuspenseWrapper>
                <AdminTours />
              </SuspenseWrapper>
            ),
          },
          {
            path: "tours/add",
            element: (
              <SuspenseWrapper>
                <AdminTourForm />
              </SuspenseWrapper>
            ),
          },
          {
            path: "tours/edit/:id",
            element: (
              <SuspenseWrapper>
                <AdminTourForm />
              </SuspenseWrapper>
            ),
          },
          {
            path: "bookings",
            element: (
              <SuspenseWrapper>
                <AdminBookings />
              </SuspenseWrapper>
            ),
          },
          {
            path: "reviews",
            element: (
              <SuspenseWrapper>
                <AdminReviews />
              </SuspenseWrapper>
            ),
          },
          {
            path: "feedback",
            element: (
              <SuspenseWrapper>
                <AdminFeedback />
              </SuspenseWrapper>
            ),
          },
          {
            path: "categories",
            element: (
              <SuspenseWrapper>
                <AdminCategories />
              </SuspenseWrapper>
            ),
          },
          {
            path: "regions",
            element: (
              <SuspenseWrapper>
                <AdminRegions />
              </SuspenseWrapper>
            ),
          },
          {
            path: "faqs",
            element: (
              <SuspenseWrapper>
                <AdminFAQ />
              </SuspenseWrapper>
            ),
          },
          {
            path: "settings",
            element: (
              <SuspenseWrapper>
                <AdminSettings />
              </SuspenseWrapper>
            ),
          },
          {
            path: "reports",
            element: (
              <SuspenseWrapper>
                <AdminReports />
              </SuspenseWrapper>
            ),
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
