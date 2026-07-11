import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Projects from "./pages/Projects";
import Blogs from "./pages/Blogs";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProjects from "./pages/AdminProjects";

import ProtectedRoute from "./components/ProtectedRoute";
import ReactGA from "react-ga4";
import AdminBlogs from "./pages/AdminBlogs";
import SingleBlog from "./pages/SingleBlog";
import AdminTestimonials from "./pages/AdminTestimonials";
import Careers from "./pages/Careers";
import AdminJobs from "./pages/AdminJobs";
import Resources from "./pages/Resources";
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
        <Route path="*" element={<NotFound />} />

      </Routes>

      {!isAdminPage && <Footer />}

    </>
  );
}

export default App;