"use client";
import React, { useEffect, useState } from "react";
import prisma from "@/lib/prisma";
import { Hotel, RoomType } from "@prisma/client";
import Link from 'next/link';

const BookingList = ({ hotelId }: { hotelId: string }) => {
  const [bookings, setBookings] = useState([]);
  const [date, setDate] = useState("");
  const [roomType, setRoomType] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch bookings from the API with filters
  const fetchBookings = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (date) queryParams.append("date", date);
      if (roomType) queryParams.append("roomType", roomType);

      const response = await fetch(`/api/hotels/${hotelId}/bookings?${queryParams}`);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setBookings(data.hotelBookings || []);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to fetch bookings.");
    }
  };

  // Cancel a booking
  const cancelBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/hotels/${hotelId}/bookings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });

      if (response.status === 204) {
        setSuccessMessage("Booking has been cancelled.");
        fetchBookings(); // Refresh bookings list
      } else {
        const data = await response.json();
        setError(data.error || "Failed to cancel booking.");
      }
    } catch (err) {
      console.error("Error cancelling booking:", err);
      setError("Failed to cancel booking.");
    }
  };

  useEffect(() => {
    fetchBookings(); // Fetch bookings on component mount or when filters change
  }, [date, roomType]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Booking List</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

      {/* Filters */}
      <div className="mb-6">
        <label htmlFor="date" className="block text-white">Filter by Date:</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-3 rounded bg-gray-700 text-white mb-4"
        />

        <label htmlFor="roomType" className="block text-white">Filter by Room Type:</label>
        <input
          type="text"
          id="roomType"
          placeholder="Room Type"
          value={roomType}
          onChange={(e) => setRoomType(e.target.value)}
          className="w-full p-3 rounded bg-gray-700 text-white"
        />
      </div>

      {/* Booking List */}
      <ul className="space-y-4">
        {bookings.map((booking: any) => (
          <li key={booking.id} className="p-4 bg-gray-800 rounded flex justify-between items-center">
            <div>
              <p><strong>Booking ID:</strong> {booking.id}</p>
              <p><strong>Check-In:</strong> {booking.checkIn}</p>
              <p><strong>Check-Out:</strong> {booking.checkOut}</p>
              <p><strong>Room Type:</strong> {booking.roomType?.name || "N/A"}</p>
            </div>
            <button
              onClick={() => cancelBooking(booking.id)}
              className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingList;