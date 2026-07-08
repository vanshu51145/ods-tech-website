import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header>
      <nav className="navbar">
        <Link to="/" className="logo">
  ODS TECH
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
    Contact
  </Link>
</li>
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