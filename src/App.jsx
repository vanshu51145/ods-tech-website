import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { lazy, Suspense } from "react";
import LoadingSpinner from "./components/LoadingSpinner";

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

  const isAdminPage = location.pathname.startsWith("/admin");
  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search,
    });
  }, [location]);

  return (
    <>

      {!isAdminPage && <Navbar />}
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
                <AdminDashboard />
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
            element={<ClientTickets />}
          />
          <Route
            path="/admin/tickets"
            element={<ProtectedRoute>
              <AdminTickets />
            </ProtectedRoute>}
          />
          <Route path="/client/login" element={<ClientLogin />} />
          <Route path="/client/register" element={<ClientRegister />} />
          <Route path="/client/dashboard" element={<ClientDashboard />} />
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
            element={<ClientInvoices />}
          />
          <Route
            path="/admin/invoices"
            element={<AdminInvoices />}
          />
          <Route
            path="/client/progress"
            element={<ProjectProgress />}
          />
          <Route
            path="/admin/milestones"
            element={<AdminProjectMilestones />}
          />

          <Route
            path="/admin/team"
            element={<AdminTeam />}
          />
          <Route path="*" element={<NotFound />} />

        </Routes>
      </Suspense>

      {!isAdminPage && <Footer />}
      <WhatsAppWidget />

    </>
  );
}

export default App;