import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import ProtectedRoute from "./routes/ProtectedRoute";

/* ================= THEME ================= */
import "./theme/theme.scss";
import { applyTheme } from "./theme/applyTheme";
import { getSettings } from "./services/api";

/* ================= GLOBAL LAYOUT ================= */
function AppLayout({ children }) {
  return (
    <div className="app-root">
      <main className="app-container">{children}</main>

    </div>
  );
}

/* ================= PAGES ================= */
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import UserDashboard from "./pages/UserDashboard";
import BarberDashboard from "./pages/BarberDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ShopPage from "./pages/ShopPage";
import Profile from "./pages/Profile";
import Bookings from "./pages/Bookings";
import BlogDetailSection from "./sections/BlogDetailSection/BlogDetailSection";

export default function App() {
  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const { data } = await getSettings();
        applyTheme(data.homepageTheme || "pink");
      } catch (err) {
        console.error("Failed to load theme", err);
        applyTheme("pink");
      }
    };

    fetchTheme();
  }, []);

  return (
    <AppLayout>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetailSection />} />
        <Route path="/contact" element={<Contact />} />
     
        {/* ================= EMAIL VERIFICATION ================= */}

        <Route
          path="/user"
          element={<Navigate to="/auth" replace />}
        />

        {/* ================= USER ROUTES ================= */}
        <Route
          element={<ProtectedRoute roles={["user"]} />}
        >
          <Route
            path="/dashboard"
            element={<UserDashboard />}
          />

          <Route
            path="/shop"
            element={<ShopPage />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/bookings"
            element={<Bookings />}
          />
        </Route>

        {/* ================= BARBER ROUTES ================= */}
        <Route
          element={<ProtectedRoute roles={["barber"]} />}
        >
          <Route
            path="/barber/dashboard"
            element={<BarberDashboard />}
          />

          <Route
            path="/barber/profile"
            element={<Profile />}
          />
        </Route>

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          element={<ProtectedRoute roles={["admin"]} />}
        >
          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />
        </Route>
      </Routes>

      {/* ================= SONNER TOASTS ================= */}
      <Toaster
        theme="dark"
        position="top-right"
        richColors
        closeButton
        duration={3000}
        expand
      />
    </AppLayout>
  );
}