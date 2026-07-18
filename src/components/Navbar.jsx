import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header>
      <nav className="navbar">
        <Link
          to="/"
          className="logo"
          onClick={() => setMenuOpen(false)}
        >
          <img
            src="https://tse1.mm.bing.net/th/id/OIP.OI3gXZAHFlR-sHZuF0ngDgHaHa?r=0&pid=Api&h=220&P=0"
            alt="ODS Tech Logo"
            className="logo-img"
          />
          <span>ODS TECH</span>
        </Link>

        <ul className={menuOpen ? "nav-links active" : "nav-links"}>
          <li>
            <Link to="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
          </li>

          <li>
            <Link to="/about" onClick={() => setMenuOpen(false)}>
              About
            </Link>
          </li>

          <li>
            <Link to="/services" onClick={() => setMenuOpen(false)}>
              Services
            </Link>
          </li>

          <li>
            <Link to="/projects" onClick={() => setMenuOpen(false)}>
              Projects
            </Link>
          </li>

          <li>
            <Link to="/blogs" onClick={() => setMenuOpen(false)}>
              Blogs
            </Link>
          </li>

          <li>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>
              Contact Us
            </Link>
          </li>

          <li>
            <Link to="/careers" onClick={() => setMenuOpen(false)}>
              Careers
            </Link>
          </li>
          <li><Link to="/resources" onClick={() => setMenuOpen(false)}>Resources</Link></li>
          <li><Link to="/client/login"  onClick={() => setMenuOpen(false)}>
  Client Portal
</Link></li>
        </ul>

        <div
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>
      </nav>
    </header>
  );
}

export default Navbar;