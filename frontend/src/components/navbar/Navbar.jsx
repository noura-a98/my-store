import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart} from '@fortawesome/free-solid-svg-icons';

function Navbar({ onCartClick }) {
  
  return (
    <div className="navbar">
      <img src="/logo.png" alt="Logo" className="logo" />
      <ul className="navbar-links">
        <li className="link"><a href="/">Home</a></li>
        <li className="link">Contact Us</li>
        <li className="link">About</li>
      </ul>
      <div className="navbar-icons">
        <span onClick={onCartClick} style={{ cursor: 'pointer' }}>
          <FontAwesomeIcon icon={faShoppingCart} />
        </span>
      </div>
    </div>
  );
}

export default Navbar;
