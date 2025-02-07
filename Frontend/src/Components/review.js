import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const ReviewPage = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data: bookingsData } = await axios.get("http://localhost:3000/bookings");
      setBookings(bookingsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const confirmBooking = async (bookingId, slotId) => {
    try {
      // ✅ Instantly move booking to "Confirmed" in UI
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status: "confirmed" } : booking
        )
      );

      // ✅ Send API request to update the backend
      await axios.patch(`http://localhost:3000/bookings/${bookingId}/confirm`);
      await axios.patch(`http://localhost:3000/slots/${slotId}/confirm`);

      // ✅ Optionally, fetch updated data from API to ensure consistency
      fetchBookings();
    } catch (error) {
      console.error("Error confirming booking:", error);
    }
  };

  const cancelBooking = async (bookingId, slotId) => {
    try {
      await axios.put(`http://localhost:3000/slots/${slotId}`, { status: "available" });
      await axios.delete(`http://localhost:3000/bookings/${bookingId}`);
      fetchBookings();
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  return (
    <div className="container mt-5">
      {/* Pending Bookings */}
      <h2 className="text-center my-4">Your Pending Bookings</h2>
      <div className="row">
        {bookings.some(booking => booking.status !== "confirmed") ? (
          bookings.filter(booking => booking.status !== "confirmed").map((booking) => (
            <div key={booking.id} className="col-12 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="flex-shrink-0">
                      <h5 className="card-title">{booking.carpenterName}</h5>
                    </div>
                    <div className="mx-auto text-center">
                      <p className="card-text">
                        <strong>Date:</strong> {booking.date} <br />
                        <strong>Time:</strong> {booking.slot?.start_time || "N/A"}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-end">
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => confirmBooking(booking.id, booking.slotId)}
                      >
                        Confirm
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => cancelBooking(booking.id, booking.slotId)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center w-100">No pending bookings found.</p>
        )}
      </div>

      {/* Confirmed Bookings */}
      <h2 className="text-center my-4">Confirmed Bookings</h2>
      <div className="row">
        {bookings.some(booking => booking.status === "confirmed") ? (
          bookings.filter(booking => booking.status === "confirmed").map((booking) => (
            <div key={booking.id} className="col-md-4 mb-4">
              <div className="card bg-success text-white shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{booking.carpenterName}</h5>
                  <p className="card-text">
                    <strong>Date:</strong> {booking.date} <br />
                    <strong>Time:</strong> {booking.slot?.start_time || "N/A"}
                  </p>
                  <p className="text-center">
                    <span className="fw-bold">Confirmed</span>
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center w-100">No confirmed bookings found.</p>
        )}
      </div>
    </div>
  );
};

export default ReviewPage;
