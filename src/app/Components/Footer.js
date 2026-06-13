 "use client"
 import React from 'react';
// import { LocationIcon, PhoneIcon, MailIcon, FacebookIcon, InstagramIcon, YoutubeIcon } from '../assets/icons';
import { asset } from '../lib/asset';
import './Footer.css';
 const FacebookIcon = () => (
    <svg width="48" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14 8h2V5h-2.5C11.6 5 10 6.6 10 8.5V11H8v3h2v7h3v-7h2.5l.5-3H13V9c0-.6.4-1 1-1z" fill="#FAF7EE" />
    </svg>
  );

  const InstagramIcon = () => (
    <svg width="38" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="#FAF7EE" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="4" stroke="#FAF7EE" strokeWidth="1.4" />
      <circle cx="17.5" cy="6.5" r="1" fill="#FAF7EE" />
    </svg>
  );

  const YoutubeIcon = () => (
    <svg width="48" height="23" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 8s-.2-1.4-.8-2c-.8-.8-1.7-.8-2.1-.9C15.2 5 12 5 12 5h0s-3.2 0-6.1.1c-.4 0-1.3.1-2.1.9C3.2 6.6 3 8 3 8S3 9.6 3 11.2v1.6C3 14.4 3 16 3 16s.2 1.4.8 2c.8.8 1.9.8 2.4.9 1.7.2 5.8.1 5.8.1s3.2 0 6.1-.1c.4 0 1.3-.1 2.1-.9.6-.6.8-2 .8-2s0-1.6 0-3.2v-1.6C21 9.6 21 8 21 8Z"
        stroke="#FAF7EE"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M10 9.5v5l5-2.5-5-2.5Z"
        fill="#FAF7EE"
      />
    </svg>
  );
const LocationIcon = ({ size = 25 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 22s7-7.5 7-13a7 7 0 10-14 0c0 5.5 7 13 7 13z" stroke="#FAF7EE" strokeWidth="1.4" />
      <circle cx="12" cy="9.5" r="2.5" stroke="#FAF7EE" strokeWidth="1.4" />
    </svg>
  );

  const PhoneIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 4.5C5 3.7 5.7 3 6.5 3h2.4c.6 0 1.2.4 1.4 1l1 3.5c.2.6 0 1.3-.5 1.6L9.2 10.4a12 12 0 005.4 5.4l1.3-1.6c.4-.4 1-.6 1.6-.5l3.5 1c.6.2 1 .7 1 1.4v2.4c0 .8-.7 1.5-1.5 1.5C10.7 20 4 13.3 4 6.5 4 5.7 4.7 5 5.5 5z" stroke="#FAF7EE" strokeWidth="1.3" />
    </svg>
  );

  const MailIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="#FAF7EE" strokeWidth="1.3" />
      <path d="M3 7l9 6 9-6" stroke="#FAF7EE" strokeWidth="1.3" />
    </svg>
  );
  

  export default function Footer() {

return (
<footer className="oh-foot" id="contact">
        {/* <img src="/images/branch.png" alt="Organic" className="branch2" /> */}



        <div className="oh-foot__container">
          {/* Brand & newsletter */}
          <div className="oh-foot__brand">
            <div className="oh-foot__logo">
              <div className="oh-header__logoMark oh-header__logoMark--dark">
                {/* <span>O</span><i>H</i> */}
                <img src={asset("/logo11.png")} alt="Organic Grains" className="logo2 " />
              </div>
            </div>

            <p className="oh-foot__tag">
            Bringing back the goodness of traditional organic
foods that nourished generations.
            </p>

            {/* <form className="oh-foot__form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="oh-foot__input"
                aria-label="Email"
              />
              <button type="submit" className="oh-foot__subscribe">Subscribe</button>
            </form> */}
          </div>

          {/* Quick links */}
          <div className="oh-foot__col">
            <h4 className="oh-foot__heading inter-font">Quick links</h4>
            <ul className="oh-foot__list">
              <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollTo("home"); }}>Home</a></li>
              <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollTo("about"); }}>About Us</a></li>
              <li><a href="#products" onClick={(e) => { e.preventDefault(); scrollTo("products"); }}>Products</a></li>
              <li><a href="#philosophy" onClick={(e) => { e.preventDefault(); scrollTo("philosophy"); }}>Ingredients</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>Contact</a></li>
            </ul>
          </div>

          {/* Get in touch */}
          <div className="oh-foot__col">
            <h4 className="oh-foot__heading inter-font" id="get">Get in touch</h4>
            <ul className="oh-foot__list oh-foot__list--touch">
              <li className='icon'>
                <LocationIcon />
                <span>Thirugai Life style Center 
Thirukarugavur, Thanjavur -614302</span>
              </li>
              <li>
                <PhoneIcon />
                <span>Mobile    :+91 9940399388</span>
              </li>
              <li>
                <MailIcon />
                <span>thirugailifestylecenter@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Last column */}
          <div className="oh-foot__col">
            <h4 className="oh-foot__heading1 inter-font" id="follow">Follow us</h4>
            <div className="oh-foot__social">
              <a href="#" aria-label="Facebook" className="oh-foot__socialBtn"><FacebookIcon /></a>
              <a href="#" aria-label="Instagram" className="oh-foot__socialBtn"><InstagramIcon /></a>
              <a href="#" aria-label="Youtube" className="oh-foot__socialBtn"><YoutubeIcon /></a>
            </div>
          </div>
        </div>

        <div className="oh-foot__bottom">
          <span>© 2026 Organic Grains. All right reserved.</span>
          <span className="oh-foot__bottomBrand">ORGANIC GRAINS — NOURISHING LIFE NATURALLY</span>
        </div>
      </footer>
)

  }