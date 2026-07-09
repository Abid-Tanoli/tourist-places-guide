import React from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute";
import About from "./pages/About";
import Booking from "./pages/Booking";
import Feedback from "./pages/Feedback";
import Home from "./pages/Home";
import PlaceDetails from "./pages/PlaceDetails";
import Tours from "./pages/Tours";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminFeedback from "./pages/admin/AdminFeedback";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminPlaceForm from "./pages/admin/AdminPlaceForm";
import AdminPlaces from "./pages/admin/AdminPlaces";
import AdminTourForm from "./pages/admin/AdminTourForm";
import AdminTours from "./pages/admin/AdminTours";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedAdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="places" element={<AdminPlaces />} />
            <Route path="places/add" element={<AdminPlaceForm />} />
            <Route path="places/edit/:id" element={<AdminPlaceForm />} />
            <Route path="tours" element={<AdminTours />} />
            <Route path="tours/add" element={<AdminTourForm />} />
            <Route path="tours/edit/:id" element={<AdminTourForm />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="feedback" element={<AdminFeedback />} />
          </Route>
        </Route>

        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="place/:id" element={<PlaceDetails />} />
          <Route path="tours" element={<Tours />} />
          <Route path="booking" element={<Booking />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
