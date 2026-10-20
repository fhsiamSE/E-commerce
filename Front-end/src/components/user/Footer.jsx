import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import shopLogo from "../../assets/images/shopLogo.png";

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <footer style={{ width: '100%' }}>
      {/* Responsive styles */}
      <style>{`
        @media (max-width: 900px) {
          .footer-newsletter, .footer-links {
            padding: 32px 16px !important;
            border-radius: 32px 32px 0 0 !important;
          }
          .footer-links {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 600px) {
          .footer-newsletter {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 24px !important;
          }
          .footer-links {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
            padding: 24px 8px !important;
          }
          .footer-title {
            font-size: 26px !important;
            line-height: 1.1 !important;
          }
          .footer-title-tagline {
            font-size: 12px !important;
            letter-spacing: 0.12em !important;
          }
        }
      `}</style>
      {/* Newsletter Section */}
      <div className="footer-newsletter" style={{
        background: 'linear-gradient(135deg, #5a67d8 0%, #4c51bf 100%)',
        padding: '60px 80px',
        borderRadius: '50px 50px 0 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '32px',
        width: '100%'
      }}>
        {/* Left Content */}
        <div style={{ flex: 1, color: 'white', minWidth: 220 }}>
          <h2 className="footer-title" style={{ fontSize: '36px', fontWeight: '800', marginBottom: '0px', lineHeight: 1.2, letterSpacing: '0.04em' }}>
            <span className="block bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
              SARIMA SUPER MART
            </span>
            <span className="footer-title-tagline mt-3 block text-sm font-medium uppercase tracking-[0.2em] text-indigo-100">
              Find everything you need at the best price
            </span>
          </h2>

        </div>

        {/* Right - Logo */}
        <div className="flex items-center">

            <img
              src={shopLogo}
              alt="Shop logo"
              className="h-48 w-64"
            />

          {/* <Link
                    to="/"
                    className="text-xs font-bold tracking-wide text-gray-900 sm:text-base"
                  >
                    Sarima Super Mart
                  </Link> */}

        </div>
      </div>
      {/* Footer Links Section */}
      <div className="footer-links" style={{
        marginTop: '-40px',
        borderRadius: '50px 50px 0 0',
        backgroundColor: '#1a1a1a',
        color: 'white',
        padding: '60px 80px',
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        gap: '60px',
        width: '100%'
      }}>
        {/* About Us */}
        <div>
          <h3 style={{ color: '#f59e0b', fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>
            About us
          </h3>
          <p style={{ fontSize: '14px', lineHeight: '1.6', opacity: 0.8 }}>
            We are dedicated to providing quality products at affordable prices with a simple and reliable shopping experience.          </p>
        </div>



        {/* Company */}
        <div>
          <h3 style={{ color: '#f59e0b', fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>
            Company
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '12px', fontSize: '14px', opacity: 0.8 }}>
              <Link to="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>
                Contact
              </Link>
            </li>
            <li style={{ marginBottom: '12px', fontSize: '14px', opacity: 0.8 }}>
              <Link to="/faq" style={{ color: 'inherit', textDecoration: 'none' }}>
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h3 style={{ color: '#f59e0b', fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>
            Follow us
          </h3>
          <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
            <a href="https://www.facebook.com/p/Sarima-Super-Mart-61595034998336/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="inline-flex transition-all duration-200 hover:scale-110 hover:text-amber-400 hover:opacity-100" style={{ color: 'white', cursor: 'pointer', opacity: 0.8 }}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a href="https://www.instagram.com/sarimasupermartjb/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="inline-flex transition-all duration-200 hover:scale-110 hover:text-amber-400 hover:opacity-100" style={{ color: 'white', cursor: 'pointer', opacity: 0.8 }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r=".75" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="https://www.tiktok.com/@sarimasupermart" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="inline-flex transition-all duration-200 hover:scale-110 hover:text-amber-400 hover:opacity-100" style={{ color: 'white', cursor: 'pointer', opacity: 0.8 }}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.33V2h-3.45v13.67a2.9 2.9 0 0 1-2.9 2.76 2.9 2.9 0 0 1-2.9-2.9 2.9 2.9 0 0 1 2.9-2.9c.3 0 .6.05.88.14V9.25a6.4 6.4 0 0 0-.88-.06A6.35 6.35 0 0 0 3.12 15.54a6.35 6.35 0 0 0 6.35 6.35 6.35 6.35 0 0 0 6.35-6.35V8.58a8.2 8.2 0 0 0 4.8 1.54V6.67a4.8 4.8 0 0 1-1.03.02Z" />
              </svg>
            </a>
          </div>
        </div>
        
      </div>
       <div className='items-center bg-black py-1 text-center text-xs text-stone-400'>
          All rights reserved {new Date().getFullYear()} Sarima Super Mart. Developed by Siam.
        </div>
    </footer>
  );
}
