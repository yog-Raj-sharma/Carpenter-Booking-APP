import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SlotBooking from './Components/slotBooking'; 
import Navbar from './Components/dashboard';
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Navbar />} /> 
        </Routes>
      </Router>
    </div>
  );
}

export default App;
