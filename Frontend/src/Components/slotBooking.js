import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const BookingPage = () => {
  const [slots, setSlots] = useState([]);
  const [carpenters, setCarpenters] = useState([]); 
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  const [confirmingSlot, setConfirmingSlot] = useState(null); 
  const [confirmationMessage, setConfirmationMessage] = useState(null); 

  useEffect(() => {
    fetchSlots();
    axios.get('http://localhost:3000/carpenters').then((res) => setCarpenters(res.data));
  }, []);

  const fetchSlots = () => {
    axios.get('http://localhost:3000/slots')
      .then((res) => {
        setSlots(res.data);
      })
      .catch(err => console.error("Error fetching slots:", err));
  };

  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 4; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const confirmBooking = (slotId) => {
    setConfirmingSlot(slotId);
  };

  const bookSlot = (slotId) => {
    axios.post('http://localhost:3000/bookings', { user_id: 1234, slot_id: slotId, status: 'booked' })
      .then(() => {
        setSlots(slots.filter(slot => slot.id !== slotId)); 
        setConfirmingSlot(null);
        setConfirmationMessage("You can still review your booking.");
        setTimeout(() => setConfirmationMessage(null), 2000);
      })
      .catch(err => console.error("Error booking slot:", err));
  };

  const formatDate = (date) => date.toISOString().split("T")[0];

  const isToday = () => formatDate(selectedDate) === formatDate(new Date());

  const getCurrentTime = () => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-end mb-4">
        <div className="dropdown">
          <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            {selectedDate.toLocaleDateString('en-GB')}
          </button>
          <ul className="dropdown-menu">
            {generateDates().map((date, index) => (
              <li key={index}>
                <button className="dropdown-item" onClick={() => setSelectedDate(date)}>
                  {date.toLocaleDateString('en-GB')}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h1 className="text-center my-4">Book a Slot</h1>

      <div className="row">
        {carpenters.slice(0, 5).map((carpenter) => (
          <div key={carpenter.id} className="col-md-4 mb-4">
            <div className="card p-4 shadow-sm rounded">
              <h4 className="card-title text-center mb-3">{carpenter.name}</h4>
              <div className="d-flex flex-wrap justify-content-center">
                {slots.filter(slot =>
                  slot.carpenterId === carpenter.id &&
                  slot.status === "available" &&
                  formatDate(new Date(slot.dates)) === formatDate(selectedDate) &&
                  (isToday() ? 
                    (parseInt(slot.start_time.split(":")[0]) * 60 + parseInt(slot.start_time.split(":")[1])) > getCurrentTime() 
                    : true)
                ).length > 0 ? (
                  slots.filter(slot =>
                    slot.carpenterId === carpenter.id &&
                    slot.status === "available" &&
                    formatDate(new Date(slot.dates)) === formatDate(selectedDate) &&
                    (isToday() ? 
                      (parseInt(slot.start_time.split(":")[0]) * 60 + parseInt(slot.start_time.split(":")[1])) > getCurrentTime() 
                      : true)
                  ).map(slot => (
                    <div key={slot.id} className="position-relative m-2">
                      <button 
                        className="btn btn-success rounded-3 shadow"
                        onClick={() => confirmBooking(slot.id)}
                      >
                        {slot.start_time}
                      </button>
                      
                      {confirmingSlot === slot.id && (
                        <div>
                          <p className="mb-2 text-black">Are You Sure?</p>
                        <button className="btn btn-primary btn-sm me-2" onClick={() => bookSlot(slot.id)}>Yes</button>
                         <button className="btn btn-secondary btn-sm"  onClick={() => setConfirmingSlot(null)}>No</button>
                         </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center w-100">No available slots</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {confirmationMessage && (
        <div className="position-fixed bottom-0 start-50 translate-middle-x bg-light p-3 border rounded shadow">
          <p className="text-black mb-0">{confirmationMessage}</p>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
