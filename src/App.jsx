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
import Resources from "./components/Resources";
import ClientTickets from "./pages/ClientTickets";
import AdminTickets from "./pages/AdminTickets";
import ClientLogin from "./pages/ClientLogin";
import ClientRegister from "./pages/ClientRegister";
import ClientDashboard from "./pages/ClientDashboard";
import AdminSubscribers from "./pages/AdminSubscribers";
import ClientInvoices from "./pages/ClientInvoices";
import AdminInvoices from "./pages/AdminInvoices";
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
<Route
path="/client/tickets"
element={<ClientTickets/>}
/>
<Route
  path="/admin/tickets"
  element={ <ProtectedRoute>
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
        <Route path="*" element={<NotFound />} />

      </Routes>

      {!isAdminPage && <Footer />}

    </>
  );
}

export default App;