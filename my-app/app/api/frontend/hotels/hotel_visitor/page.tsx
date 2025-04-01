"use client";
import React, { useState } from "react";
import Link from "next/link";

// Type for Hotel with RoomType relation
type HotelWithRooms = {
  id: string;
  name: string;
  logo?: string;
  address: string;
  city: string;
  location: string;
  starRating: number;
  roomTypes: {
    id: string;
    name: string;
    pricePerNight: number;
  }[];
};

const HotelSearch = () => {
  const [searchParams, setSearchParams] = useState({
    checkIn: "",
    checkOut: "",
    city: "",
    name: "",
    starRating: "",
    priceRange: "",
  });

  const [hotels, setHotels] = useState<HotelWithRooms[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const fetchHotels = async () => {
    setLoading(true);
    setError("");
    const queryString = new URLSearchParams(searchParams as any).toString();
    try {
      const response = await fetch(`/api/hotels?${queryString}`);
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setHotels(data.availableHotels);
      }
    } catch (err) {
      console.error("Error fetching hotels:", err);
      setError("Failed to fetch hotels.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      
      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-10">
        <h2 className="text-3xl font-bold mb-4 text-center">Search for Hotels</h2>
        <form className="bg-gray-800 p-6 rounded-lg space-y-6">
          <input
            type="text"
            name="city"
            placeholder="City"
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-700 text-white"
          />
          <input
            type="date"
            name="checkIn"
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-700 text-white"
          />
          <input
            type="date"
            name="checkOut"
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-700 text-white"
          />
          <input
            type="text"
            name="name"
            placeholder="Hotel Name"
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-700 text-white"
          />
          <input
            type="number"
            name="starRating"
            placeholder="Star Rating"
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-700 text-white"
          />
          <input
            type="text"
            name="priceRange"
            placeholder="Price Range (e.g., 50-300)"
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-700 text-white"
          />
          <button
            type="button"
            onClick={fetchHotels}
            className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded"
          >
            Search
          </button>
        </form>

        {loading && <p className="mt-4">Loading hotels...</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}

        {/* Hotel Results */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {hotels.length > 0 ? (
            hotels.map((hotel, index) => (
              <Link key={index} href={`/hotel_visitor/${hotel.id}`}>
                <div className="bg-gray-800 p-6 rounded-lg shadow hover:bg-gray-700 transition duration-200">
                  <h3 className="text-xl font-bold">{hotel.name}</h3>
                  <p>City: {hotel.city}</p>
                  <p>
                    Starting Price: $
                    {hotel.roomTypes.length > 0
                      ? hotel.roomTypes.reduce((min, roomType) => Math.min(min, roomType.pricePerNight), Infinity)
                      : "Not Available"}
                  </p>
                  <p>Star Rating: {hotel.starRating}</p>
                  <p className="text-sm italic text-gray-400">Location: Map Pinpoint</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-400">No hotels found.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default HotelSearch;