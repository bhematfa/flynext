"use client";
import React, { useEffect, useState } from "react";
import prisma from "@/lib/prisma";
import { Hotel, RoomType } from "@prisma/client";
import { useRouter } from 'next/router';

type HotelWithRooms = Hotel & { roomTypes: RoomType[] };

const HotelDetails = () => {
    const router = useRouter();
    const { id } = router.query;
    const [hotel, setHotel] = useState<HotelWithRooms>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
  
    useEffect(() => {
      if (!id) return;
      const fetchHotel = async () => {
        try {
          const response = await fetch(`/api/backend/hotels/${id}`);
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
          {hotel.roomTypes.map((room, index) => (
            <div key={index} className="room-card border rounded p-4 mb-4">
              <h3 className="text-xl font-semibold">{room.name}</h3>
              <p> Amenities: {JSON.stringify(room.amenities)} </p>
              <p> Price Per Night: ${room.pricePerNight.toString()}</p>
              
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default HotelDetails;