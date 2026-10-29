import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import ProtectedRoute from "./routes/ProtectedRoute";

// Cart context
import { CartProvider } from "./context/CartContext";

// Theme
import "./theme/theme.scss";
import { applyTheme } from "./theme/applyTheme";
import { getSettings } from "./services/api";

// Pages
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Career from "./pages/Career";
import Help from "./pages/Help";
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import BecomeBarber from "./pages/BecomeBarber";
import ReferralProgram from "./pages/ReferralProgram";
import Events from "./pages/Events";
import CareerJobDetails from "./pages/CareerJobDetails";
import UserDashboard from "./pages/UserDashboard";
import BarberDashboard from "./pages/BarberDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SearchPage from "./pages/SearchPage";
import BarberSlugPage from "./pages/BarberSlugPage/BarberSlugPage";

import BlogDetailSection from "./sections/BlogDetailSection/BlogDetailSection";

// Global layout
function AppLayout({ children }) {
  return (
    <div className="app-root">
      <main className="app-container">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const { data } = await getSettings();
        applyTheme(data?.homepageTheme || "pink");
      } catch (err) {
        console.error("Failed to load theme", err);
        applyTheme("pink");
      }
    };

    fetchTheme();
  }, []);

  return (
    <CartProvider>
      <AppLayout>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog/>} />
          <Route path="/career" element={<Career/>} />
          <Route path="/help" element={<Help/>} />
          <Route path="/privacy" element={<PrivacyPolicy/>}/>
          <Route path="/terms" element={<Terms/>} />
          <Route path="/events" element={<Events/>} />
          <Route path="/become-barber" element={<BecomeBarber/>}/>
          <Route path="/referral-program" element={<ReferralProgram/>}/>

          {/* Career job details and application */}
          <Route path="/career/:slug" element={<CareerJobDetails />}/>

          {/* Blog details */}
          <Route path="/blog/:slug" element={<BlogDetailSection />} />

          <Route path="/contact" element={<Contact />} />
          <Route path="/search" element={<SearchPage />} />

          {/* Public salon website */}
          <Route path="/salon/:slug" element={<BarberSlugPage />} />

          {/* Email verification / user entry */}
          <Route
            path="/user"
            element={<Navigate to="/auth" replace />}
          />

          {/* Protected user routes */}
          <Route element={<ProtectedRoute roles={["user"]} />}>
            {/* Cart is the user's main dashboard */}
            <Route
              path="/cart"
              element={<UserDashboard />}
            />

            {/* Keep dashboard URL compatible */}
            <Route
              path="/dashboard"
              element={<Navigate to="/cart" replace />}
            />

            {/* ShopPage temporarily disabled */}
          </Route>

          {/* Barber dashboard */}
          <Route element={<ProtectedRoute roles={["barber"]} />}>
            <Route
              path="/barber/*"
              element={<BarberDashboard />}
            />
          </Route>

          {/* Admin routes */}
          <Route element={<ProtectedRoute roles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

          {/* Unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toaster
          theme="dark"
          position="top-right"
          richColors
          closeButton
          duration={3000}
          expand
        />
      </AppLayout>
    </CartProvider>
  );
}
