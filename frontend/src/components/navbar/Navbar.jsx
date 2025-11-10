import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

function Navbar({ onCartClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    closeMenu();
  };

  const handleHomeClick = () => {
    // If we're already on the home page, scroll to top
    if (window.location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      closeMenu();
    } else {
      // Navigate to home page
      window.location.href = '/';
    }
  };

  return (
    <div className="navbar">
      <img src="/logo.png" alt="Logo" className="logo" onClick={handleHomeClick} />

      <div className={`navbar-center ${isMenuOpen ? 'active' : ''}`}>
        <ul className="navbar-links">
          <li className="link">
            <a href="/" onClick={(e) => { e.preventDefault(); handleHomeClick(); }}>Home</a>
          </li>
          <li className="link">
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact Us</a>
          </li>
          <li className="link">
            <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a>
          </li>
        </ul>
      </div>

      <div className="menu-toggle" onClick={toggleMenu}>
        <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
      </div>
    </div>
  );
}

export default Navbar;