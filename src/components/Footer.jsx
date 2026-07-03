import { Link } from "react-router-dom";
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-box">
          <h3>ODS TECH</h3>
          <p>
            We create innovative web solutions,
            scalable applications and digital products.
          </p>
        </div>

        <div className="footer-box">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/services">Services</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-box">
          <h3>Contact</h3>

          <p>Email: Info.odsnetwork@gmail.com</p>
          <p>Phone: +91 9801351931</p>
          <p>India</p>
        </div>
      </div>

      <div className="copyright">
        © 2026 ODS TECH. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;