import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import axios from 'axios';
import SlotBooking from './slotBooking';
import Review from './review';

export default function NavBar() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeComponent, setActiveComponent] = useState('home');
  const [dateTime, setDateTime] = useState(new Date());
  const [hasPendingBookings, setHasPendingBookings] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#4a4d53' : '#f8f9fa';
    document.body.style.color = darkMode ? '#ffffff' : '#000000';
  }, [darkMode]);

  useEffect(() => {
    checkPendingBookings();
  }, []);

  const checkPendingBookings = async () => {
    try {
      const { data: bookings } = await axios.get('http://localhost:3000/bookings');
      const pendingBookings = bookings.some(booking => booking.status === 'booked'); 
      setHasPendingBookings(pendingBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg" style={{ backgroundColor: darkMode ? '#2c2f33' : '#F2F2F2', color: darkMode ? '#ffffff' : '#000000', position: 'fixed', top: '0', width: '100%', zIndex: '1000', padding: '10px 20px' }}>
        <div className="container-fluid">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <button className="nav-link btn fw-bold me-3" onClick={() => setActiveComponent('home')} style={{ color: darkMode ? '#ffffff' : '#000000' }}>Home</button>
              </li>
              <li className="nav-item">
                <button className="nav-link btn fw-bold me-3" onClick={() => setActiveComponent('slotBooking')} style={{ color: darkMode ? '#ffffff' : '#000000' }}>Book a Service</button>
              </li>
              <li className="nav-item">
                <button className="nav-link btn fw-bold me-3" onClick={() => setActiveComponent('review')} style={{ color: darkMode ? '#ffffff' : '#000000' }}>Review Your Bookings</button>
              </li>
            </ul>
          </div>
          
          <div className="d-flex align-items-center">
            <div className="me-4" style={{ color: darkMode ? '#ffffff' : '#000000', fontWeight: 'bold' }}> 1234</div>
            <div className="text-end me-4 d-none d-md-block">
              <div style={{ fontSize: '16px' }}>{dateTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</div>
              <div style={{ fontSize: '14px' }}>{dateTime.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
            </div>
            <div className="form-check form-switch ms-4">
              <input className="form-check-input" type="checkbox" id="darkModeToggle" checked={darkMode} onChange={handleToggleDarkMode} />
              <label className="form-check-label ms-2" htmlFor="darkModeToggle" style={{ color: darkMode ? '#ffffff' : '#000000', fontWeight: 'bold' }}>
                {darkMode ? 'Dark Mode' : 'Light Mode'}
              </label>
            </div>
          </div>
        </div>
      </nav>

      <div style={{ marginTop: '80px', textAlign: 'center' }}>
        {activeComponent === 'slotBooking' && <SlotBooking />}
        {activeComponent === 'review' && <Review />}
        {activeComponent === 'home' && (
          <div className="container mt-4" style={{ textAlign: 'left' }}>
            <h2>Welcome!</h2>
            <h5><p>{hasPendingBookings ? "You have Bookings to Review." : "Your all Bookings are Reviewed."}</p></h5>
          </div>
        )}
      </div>
    </>
  );
}
