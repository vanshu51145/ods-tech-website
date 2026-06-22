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

          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/services">Services</a>
          <a href="/contact">Contact</a>
        </div>

        <div className="footer-box">
          <h3>Contact</h3>

          <p>Email: info@odstech.com</p>
          <p>Phone: +91 9876543210</p>
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