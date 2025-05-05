import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="text-white pt-5 pb-3" style={{ backgroundColor: '#2c3e50' }}>
      <div className="container">
        <div className="row text-center text-md-start">
          {/* Brand */}
          <div className="col-md-3 mb-4">
            <h4 className="mb-2">Skillex</h4>
            <p>Learn. Grow. Succeed.</p>
            <div className="d-flex justify-content-center justify-content-md-start gap-3 fs-5">
              <FaFacebookF />
              <FaTwitter />
              <FaLinkedinIn />
              <FaInstagram />
            </div>
          </div>

          {/* Explore */}
          <div className="col-md-3 mb-4">
            <h5 className="mb-3">Explore</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white text-decoration-none">Courses</a></li>
              <li><a href="#" className="text-white text-decoration-none">Mentors</a></li>
              <li><a href="#" className="text-white text-decoration-none">Blog</a></li>
              <li><a href="#" className="text-white text-decoration-none">About Us</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-md-3 mb-4">
            <h5 className="mb-3">Support</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white text-decoration-none">Help Center</a></li>
              <li><a href="#" className="text-white text-decoration-none">FAQs</a></li>
              <li><a href="#" className="text-white text-decoration-none">Contact Us</a></li>
              <li><a href="#" className="text-white text-decoration-none">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Subscribe */}
          <div className="col-md-3 mb-4">
            <h5 className="mb-3">Subscribe</h5>
            <p>Get the latest updates and offers straight to your inbox.</p>
            <form className="d-flex">
              <input
                type="email"
                className="form-control rounded-0"
                placeholder="Enter your email"
              />
              <button type="submit" className="btn btn-primary rounded-0 ms-2">Subscribe</button>
            </form>
          </div>
        </div>

        <hr className="border-top border-secondary mt-4" />
        <p className="text-center mb-0">&copy; 2025 Skillex. All rights reserved.</p>
      </div>
    </footer>
  );
}
