import '../Home/Home.css';
import { faLocationDot, faPhoneAlt, faClock, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="grid">
            <div className="col text-col">
              <h1>Sugar-Free Sweetness</h1>
              <p>Enjoy guilt-free sweetness with our delicious sugar-free drops.</p>
              <div className="button-wrapper">
                <Link to="/shop">
                  <button className="hero-button">Shop Now</button>
                </Link>
              </div>
            </div>
            <div className="col image-col">
              <img src="/images.jpeg" alt="Sweet Drops" />
            </div>
          </div>
        </div>
        <div className="svg-divider">
          <svg viewBox="0 0 1440 320">
            <path
              fill="#e7fdf2"
              fillOpacity="1"
              d="M0,224L1440,64L1440,0L0,0Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Cards Section */}
      <section className="card-section">
        <div className="container card-grid">
          <div className="card">
            <img src="/images.jpeg" alt="Stevia" />
            <h3>Natural Sweetener</h3>
            <span className='card-p'>Made with pure stevia extract — no chemicals, just nature.</span>
          </div>
          <div className="card">
            <img src="/images.jpeg" alt="Flavors" />
            <h3>Rich Flavors</h3>
            <span>Choose from vanilla, caramel, berry, and more — no sugar added.</span>
          </div>
          <div className="card">
            <img src="/images.jpeg" alt="Pocket Friendly" />
            <h3>Pocket Friendly</h3>
            <span>Compact bottle, perfect to carry anywhere for on-the-go sweetness.</span>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="about-grid">
            <div className="about-image">
              <img src="/images.jpeg" alt="About SweetDrops" />
            </div>
            <div className="about-text">
              <h2>About Us</h2>
              <p>
                At SweetDrops, we're passionate about making your life a little sweeter — without the sugar.
                Our drops are crafted from natural ingredients to support a healthy lifestyle without compromising on taste.
              </p>
              <p>
                Founded with love and care, we believe in transparency, quality, and helping people enjoy the sweetness of life guilt-free.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-form">
              <form>
                <h2>Contact Us</h2>
                <input type="text" placeholder="Your Name" required />
                <input type="email" placeholder="Your Email" required />
                <input type="text" placeholder="Subject" required />
                <textarea placeholder="Your Message" rows="5" required></textarea>
                <button type="submit">Send Message</button>
              </form>
            </div>

            <div className="contact-info">
              <div className="info-card">
                <div className="icon-title">
                  <FontAwesomeIcon icon={faLocationDot} className="info-icon" />
                  <h4>Address</h4>
                </div>
                <p>123 Sweet Street, Dubai, UAE</p>
              </div>

              <div className="info-card">
                <div className="icon-title">
                  <FontAwesomeIcon icon={faPhoneAlt} className="info-icon" />
                  <h4>Mobile</h4>
                </div>
                <p>+971 56 273 4746</p>
              </div>

              <div className="info-card">
                <div className="icon-title">
                  <FontAwesomeIcon icon={faClock} className="info-icon" />
                  <h4>Availability</h4>
                </div>
                <p>Mon–Fri: 9:00 AM – 6:00 PM</p>
              </div>

              <div className="info-card">
                <div className="icon-title">
                  <FontAwesomeIcon icon={faEnvelope} className="info-icon" />
                  <h4>Email</h4>
                </div>
                <p>nouramursal@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
