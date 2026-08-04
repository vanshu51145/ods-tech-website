import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TestError from "./components/TestError";
import ClientAssets from "./pages/ClientAssets";
import { lazy, Suspense } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import LiveSupport from "./pages/LiveSupport";
import BookConsultation from "./pages/BookConsultation";
import AdminAppointments from "./pages/AdminAppointments";
import AdminAssets from "./pages/AdminAssets";
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Projects = lazy(() => import("./pages/Projects"));
const Blogs = lazy(() => import("./pages/Blogs"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(
  () => import("./pages/AdminDashboard")
);
const AdminProjects = lazy(() => import("./pages/AdminProjects"));


import ProtectedRoute from "./components/ProtectedRoute";
import ReactGA from "react-ga4";
const AdminBlogs = lazy(() => import("./pages/AdminBlogs"));
const SingleBlog = lazy(() => import("./pages/SingleBlog"));
const AdminTestimonials = lazy(() => import("./pages/AdminTestimonials"));
const Careers = lazy(() => import("./pages/Careers"));
const AdminJobs = lazy(() => import("./pages/AdminJobs"));
const Resources = lazy(() => import("./components/Resources"));
const ClientTickets = lazy(() => import("./pages/ClientTickets"));
const AdminTickets = lazy(() => import("./pages/AdminTickets"));
const ClientLogin = lazy(() => import("./pages/ClientLogin"));
const ClientRegister = lazy(() => import("./pages/ClientRegister"));
const ClientDashboard = lazy(
  () => import("./pages/ClientDashboard")
);
const AdminSubscribers = lazy(() => import("./pages/AdminSubscribers"));
const ClientInvoices = lazy(() => import("./pages/ClientInvoices"));
const AdminInvoices = lazy(() => import("./pages/AdminInvoices"));
import WhatsAppWidget from "./components/WhatsAppWidget";
const ProjectProgress = lazy(() => import("./pages/ProjectProgress"));
const AdminProjectMilestones = lazy(
  () => import("./pages/AdminProjectMilestones")
);
const AdminTeam = lazy(
  () => import("./pages/AdminTeam")
);
function App() {

  const location = useLocation();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;

      localStorage.setItem("darkMode", newMode);

      return newMode;
    });
  };
   const [adminDarkMode, setAdminDarkMode] = useState(() => {
    return localStorage.getItem("adminDarkMode") === "true";
  });
const toggleAdminDarkMode = () => {
  setAdminDarkMode((prev) => {
    const newMode = !prev;

    localStorage.setItem(
      "adminDarkMode",
      newMode
    );

    return newMode;
  });
};


  const isAdminPage = location.pathname.startsWith("/admin");
  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search,
    });
  }, [location]);
useEffect(() => {
  if (isAdminPage) {
    // Remove public website dark mode
    document.body.classList.remove("dark-mode");

    // Apply admin dark mode
    document.body.classList.toggle(
      "admin-dark-mode",
      adminDarkMode
    );
  } else {
    // Remove admin dark mode
    document.body.classList.remove(
      "admin-dark-mode"
    );

    // Apply public website dark mode
    document.body.classList.toggle(
      "dark-mode",
      darkMode
    );
  }
}, [
  darkMode,
  adminDarkMode,
  isAdminPage
]);

  return (
    <>
      {!isAdminPage && (
        <Navbar
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
      )}
      <Suspense fallback={<LoadingSpinner />}>

        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/contact" element={<Contact />} />

          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />

<Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute>
      <AdminDashboard
        adminDarkMode={adminDarkMode}
        toggleAdminDarkMode={
          toggleAdminDarkMode
        }
      />
    </ProtectedRoute>
  }
/>

          <Route
            path="/admin/projects"
            element={
              <ProtectedRoute>
                <AdminProjects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/blogs"
            element={
              <ProtectedRoute>
                <AdminBlogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blogs/:slug"
            element={<SingleBlog />}
          />
          <Route
            path="/admin/testimonials"
            element={<ProtectedRoute>
              <AdminTestimonials />
            </ProtectedRoute>}
          />
          <Route
            path="/careers"
            element={<Careers />}
          />
          <Route path="/resources" element={<Resources />} />
          <Route
            path="/admin/jobs"
            element={
              <ProtectedRoute>
                <AdminJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/tickets"
            element={
              <ProtectedRoute type="client">
                <ClientTickets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tickets"
            element={<ProtectedRoute>
              <AdminTickets />
            </ProtectedRoute>}
          />
          <Route path="/client/login" element={<ClientLogin />} />
          <Route path="/client/register" element={<ClientRegister />} />
          <Route path="/client/dashboard" element={
            <ProtectedRoute type="client">
              <ClientDashboard />
            </ProtectedRoute>
          } />
          <Route
            path="/client/appointments"
            element={<BookConsultation />}
          />
          <Route
  path="/admin/appointments"
  element={
    <ProtectedRoute>
      <AdminAppointments />
    </ProtectedRoute>
  }
/>
          <Route
            path="/admin/subscribers"
            element={
              <ProtectedRoute>
                <AdminSubscribers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/invoices"
            element={
              <ProtectedRoute type="client">
                <ClientInvoices />
              </ProtectedRoute>
            }
          />
         <Route
  path="/admin/invoices"
  element={
    <ProtectedRoute>
      <AdminInvoices />
    </ProtectedRoute>
  }
/>
          <Route
            path="/client/progress"
            element={
              <ProtectedRoute type="client">
                <ProjectProgress />
              </ProtectedRoute>
            }
          />
        <Route
  path="/admin/milestones"
  element={
    <ProtectedRoute>
      <AdminProjectMilestones />
    </ProtectedRoute>
  }
/>
       <Route
  path="/admin/team"
  element={
    <ProtectedRoute>
      <AdminTeam />
    </ProtectedRoute>
  }
/>
          <Route path="/test-error" element={<TestError />} />
          <Route path="*" element={<NotFound />} />
          <Route
            path="/client/support"
            element={
              <ProtectedRoute type="client">
                <LiveSupport />
              </ProtectedRoute>
            }
          />
<Route
  path="/client/assets"
  element={
    <ProtectedRoute type="client">
      <ClientAssets />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/assets"
  element={
    <AdminAssets />
  }
>
</Route>
        </Routes>
      </Suspense>

      {!isAdminPage && <Footer />}
      <WhatsAppWidget />

    </>
  );
}

export default App;