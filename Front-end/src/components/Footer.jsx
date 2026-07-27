import React, { useState } from 'react';

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
          .footer-logo {
            font-size: 32px !important;
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
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '0px', lineHeight: 1.2 }}>
            JOIN OUR KICKSPLUS<br />CLUB & GET 15% OFF
          </h2>
          <p style={{ fontSize: '16px', marginBottom: '24px', opacity: 0.95 }}>
            Sign up for free! Join the community.
          </p>

          {/* Email Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px' }}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '4px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '14px',
                maxWidth: '280px'
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#1a202c',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '4px',
                border: 'none',
                fontWeight: 'bold',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
            >
              SUBMIT
            </button>
          </form>
        </div>

        {/* Right - Logo */}
        <div className="footer-logo" style={{ fontSize: '48px', fontWeight: 'bold', color: 'white', position: 'relative', minWidth: 120, textAlign: 'center' }}>
          KICKS
          <span style={{
            position: 'absolute',
            top: '-8px',
            right: '-16px',
            width: '24px',
            height: '24px',
            backgroundColor: '#f59e0b',
            borderRadius: '50%',
            display: 'inline-block'
          }}></span>
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
            We are the biggest hyperstore in the universe. We got you all cover with our exclusive collections and latest drops.
          </p>
        </div>

        {/* Categories */}
        <div>
          <h3 style={{ color: '#f59e0b', fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>
            Categories
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {['Runners', 'Sneakers', 'Basketball', 'Outdoor', 'Golf', 'Hiking'].map((category) => (
              <li key={category} style={{ marginBottom: '12px', fontSize: '14px', cursor: 'pointer', opacity: 0.8 }}>
                {category}
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 style={{ color: '#f59e0b', fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>
            Company
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {['About', 'Contact', 'Blogs'].map((item) => (
              <li key={item} style={{ marginBottom: '12px', fontSize: '14px', cursor: 'pointer', opacity: 0.8 }}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h3 style={{ color: '#f59e0b', fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>
            Follow us
          </h3>
          <div style={{ display: 'flex', gap: '16px', fontSize: '20px' }}>
            <a href="#" style={{ color: 'white', cursor: 'pointer', opacity: 0.8 }}>📘</a>
            <a href="#" style={{ color: 'white', cursor: 'pointer', opacity: 0.8 }}>📷</a>
            <a href="#" style={{ color: 'white', cursor: 'pointer', opacity: 0.8 }}>𝕏</a>
            <a href="#" style={{ color: 'white', cursor: 'pointer', opacity: 0.8 }}>♪</a>
          </div>
        </div>
        <div className='items-center'>
          all rights reserved @ 2026 KICKS. Designed by Siam.
        </div>
      </div>
    </footer>
  );
}
