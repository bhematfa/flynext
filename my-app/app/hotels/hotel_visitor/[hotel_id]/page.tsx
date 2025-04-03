"use client";
import React, { useEffect, useState } from "react";
import prisma from "@/lib/prisma";
import { Hotel, RoomType } from "@prisma/client";
import { useRouter } from 'next/router';

// view hotel details
// see if a room is available from a certain date to a certain date

type HotelWithRooms = Hotel & { roomTypes: RoomType[] };

const HotelDetails = () => {
  const router = useRouter();
  const { id } = router.query; // Hotel ID
  const [hotel, setHotel] = useState<HotelWithRooms | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchHotel = async () => {
      try {
        const response = await fetch(`/api/hotels/${id}`);
        const data = await response.json();
        if (data.error) {
          setError(data.error);
        } else {
          setHotel(data);
        }
      } catch (err) {
        console.error("Error fetching hotel details:", err);
        setError("Failed to fetch hotel details.");
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  // Check room availability
  const checkAvailability = async () => {
    if (!checkIn || !checkOut || !selectedRoom) {
      setAvailabilityMessage("Please select valid dates and a room.");
      return;
    }

    try {
      const response = await fetch(`/api/rooms/${selectedRoom.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkIn, checkOut }),
      });

      const data = await response.json();
      if (data.isAvailable) {
        setAvailabilityMessage("This room is available for the selected dates!");
      } else {
        setAvailabilityMessage("Sorry, this room is not available for the selected dates.");
      }
    } catch (err) {
      console.error("Error checking availability:", err);
      setAvailabilityMessage("Failed to check room availability.");
    }
  };

  if (loading) return <p>Loading hotel details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!hotel) return <p>No hotel details found.</p>;

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">{hotel.name}</h1>
      <p>City: {hotel.city}</p>
      <p>Star Rating: {hotel.starRating}</p>
      <div>
        <h2 className="text-2xl font-semibold">Room Types</h2>
        {hotel.roomTypes.map((room) => (
          <div key={room.id} className="room-card border rounded p-4 mb-4">
            <h3 className="text-xl font-semibold">{room.name}</h3>
            <p>Amenities: {JSON.stringify(room.amenities)}</p>
            <p>Price Per Night: ${room.pricePerNight.toFixed(2)}</p>
            <button
              onClick={() => setSelectedRoom(room)}
              className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded"
            >
              Check Availability
            </button>
          </div>
        ))}
      </div>

      {selectedRoom && (
        <div className="availability-form mt-6 p-6 bg-gray-800 rounded">
          <h2 className="text-2xl font-semibold mb-4">Check Availability for {selectedRoom.name}</h2>
          <label htmlFor="checkIn" className="block mb-2 text-white">Check-In Date:</label>
          <input
            type="date"
            id="checkIn"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 text-white mb-4"
          />
          <label htmlFor="checkOut" className="block mb-2 text-white">Check-Out Date:</label>
          <input
            type="date"
            id="checkOut"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 text-white mb-4"
          />
          <button
            onClick={checkAvailability}
            className="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded"
          >
            Check Availability
          </button>
          {availabilityMessage && <p className="mt-4 text-white">{availabilityMessage}</p>}
        </div>
      )}
    </div>
  );
};

export default HotelDetails;
