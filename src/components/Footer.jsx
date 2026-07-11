import { Link } from "react-router-dom";
function Footer() {
  return (
   <footer className="footer">
  <div className="footer-container">

    {/* Company Info */}
    <div className="footer-box">
      <h3>ODS Network</h3>
      <p>
        ODS Network is a technology-driven company delivering innovative
        Web Development, Mobile App Development, Digital Marketing,
        SEO, UI/UX Design, Cloud Solutions, and IT Consulting services
        to help businesses achieve digital success.
      </p>
    </div>

    {/* Quick Links */}
    <div className="footer-box">
      <h3>Quick Links</h3>

      <Link to="/">Home</Link>
      <Link to="/about">About Us</Link>
      <Link to="/services">Services</Link>
      <Link to="/blogs">Blogs</Link>
      <Link to="/careers">Careers</Link>
      <Link to="/resources">Resources</Link>
      <Link to="/contact">Contact Us</Link>
    </div>

    {/* Contact */}
    <div className="footer-box">
      <h3>Contact Us</h3>

      <p>
        <strong>Email:</strong><br />
        info.odsnetwork@gmail.com
      </p>

      <p>
        <strong>Phone:</strong><br />
        +91 98013 51931
      </p>

      <p>
        <strong>Address:</strong><br />
        NH-31, Rahimpur,<br />
        Shambhu Deep Dharam Kanta,<br />
        Khagaria, Bihar – 851204, India
      </p>
    </div>

  </div>

  <div className="copyright">
    <p>
      © {new Date().getFullYear()} ODS Network. All Rights Reserved.
    </p>
  </div>
</footer>
  );
}

export default Footer;