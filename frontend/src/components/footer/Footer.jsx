import './Footer.css';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Al Naseem Genarl Trading. All rights reserved.</p>
      <Link to="/login" className="footer-link">Login as Staff</Link>
    </footer>
  );
}

export default Footer;
