import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import UserLayout from "./layouts/UserLayout";

const Home = lazy(() => import("./pages/Home"));
const PlaceDetails = lazy(() => import("./pages/PlaceDetails"));
const Tours = lazy(() => import("./pages/Tours"));
const Booking = lazy(() => import("./pages/Booking"));
const Feedback = lazy(() => import("./pages/Feedback"));
const About = lazy(() => import("./pages/About"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const MyBookings = lazy(() => import("./pages/MyBookings"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));

const Loading = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
  </div>
);

function SuspenseWrapper({ children }) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <UserLayout />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <Home />
          </SuspenseWrapper>
        ),
      },
      {
        path: "place/:id",
        element: (
          <SuspenseWrapper>
            <PlaceDetails />
          </SuspenseWrapper>
        ),
      },
      {
        path: "tours",
        element: (
          <SuspenseWrapper>
            <Tours />
          </SuspenseWrapper>
        ),
      },
      {
        path: "booking",
        element: (
          <SuspenseWrapper>
            <Booking />
          </SuspenseWrapper>
        ),
      },
      {
        path: "feedback",
        element: (
          <SuspenseWrapper>
            <Feedback />
          </SuspenseWrapper>
        ),
      },
      {
        path: "about",
        element: (
          <SuspenseWrapper>
            <About />
          </SuspenseWrapper>
        ),
      },
      {
        path: "login",
        element: (
          <SuspenseWrapper>
            <Login />
          </SuspenseWrapper>
        ),
      },
      {
        path: "register",
        element: (
          <SuspenseWrapper>
            <Register />
          </SuspenseWrapper>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <SuspenseWrapper>
            <ForgotPassword />
          </SuspenseWrapper>
        ),
      },
      {
        path: "reset-password/:token",
        element: (
          <SuspenseWrapper>
            <ResetPassword />
          </SuspenseWrapper>
        ),
      },
      {
        path: "profile",
        element: (
          <SuspenseWrapper>
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          </SuspenseWrapper>
        ),
      },
      {
        path: "my-bookings",
        element: (
          <SuspenseWrapper>
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          </SuspenseWrapper>
        ),
      },
      {
        path: "wishlist",
        element: (
          <SuspenseWrapper>
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          </SuspenseWrapper>
        ),
      },
      {
        path: "*",
        element: (
          <SuspenseWrapper>
            <NotFound />
          </SuspenseWrapper>
        ),
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" richColors closeButton />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
