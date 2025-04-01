"use client";
import React, { useEffect, useState } from "react";
import prisma from "@/lib/prisma";
import { Hotel, RoomType } from "@prisma/client";
import Link from 'next/link';

const ManageRoomTypes = ({ hotelId }: { hotelId: string }) => {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    amenities: "",
    pricePerNight: "",
    images: "",
    availableRooms: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const response = await fetch(`/api/hotels/${hotelId}/rooms`);
        const data = await response.json();
        if (!response.ok) {
          setError(data.error || "Failed to fetch room types.");
        } else {
          setRoomTypes(data.roomTypes);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch room types.");
      }
    };
    fetchRoomTypes();
  }, [hotelId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(`/api/hotels/${hotelId}/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          amenities: formData.amenities.split(","),
          pricePerNight: parseFloat(formData.pricePerNight),
          images: formData.images.split(","),
          availableRooms: parseInt(formData.availableRooms),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Failed to create room type.");
      } else {
        setSuccessMessage("Room type created successfully!");
        setRoomTypes((prev) => [...prev, data.room]);
        setFormData({
          name: "",
          amenities: "",
          pricePerNight: "",
          images: "",
          availableRooms: "",
        });
      }
    } catch (err) {
      console.error(err);
      setError("Failed to create room type.");
    }
  };

  const handleUpdateAvailableRooms = async (roomId: string, newAvailableRooms: number) => {
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(`/api/hotels/${roomId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ availableRooms: newAvailableRooms }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Failed to update available rooms.");
      } else {
        setSuccessMessage("Successfully updated available rooms.");
        setRoomTypes((prev) =>
          prev.map((room) =>
            room.id === roomId
              ? { ...room, availableRooms: newAvailableRooms }
              : room
          )
        );
      }
    } catch (err) {
      console.error(err);
      setError("Failed to update available rooms.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Manage Room Types</h1>
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      {/* Room Creation Form */}
      <form onSubmit={handleCreateRoom} className="space-y-6 mb-8">
        <input
          type="text"
          name="name"
          placeholder="Room Name (e.g., Twin, Double)"
          value={formData.name}
          onChange={handleChange}
          className="input"
          required
        />
        <textarea
          name="amenities"
          placeholder="Amenities (comma-separated)"
          value={formData.amenities}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="number"
          name="pricePerNight"
          placeholder="Price Per Night"
          value={formData.pricePerNight}
          onChange={handleChange}
          className="input"
          required
        />
        <textarea
          name="images"
          placeholder="Image URLs (comma-separated)"
          value={formData.images}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="number"
          name="availableRooms"
          placeholder="Available Rooms"
          value={formData.availableRooms}
          onChange={handleChange}
          className="input"
          required
        />
        <button type="submit" className="btn bg-blue-500 text-white">
          Create Room Type
        </button>
      </form>

      {/* Scrollable List of Room Types */}
      <div className="space-y-6 overflow-y-auto max-h-96 border rounded p-4">
        {roomTypes.map((room) => (
          <div key={room.id} className="border rounded p-4 mb-4">
            <h2 className="text-xl font-semibold">{room.name}</h2>
            <p>Amenities: {Array.isArray(room.amenities) ? room.amenities.join(", ") : "None"}</p>
            <p>Price Per Night: ${room.pricePerNight.toString()}</p>
            <p>Available Rooms: {room.availableRooms}</p>
            <input
              type="number"
              placeholder="Edit Available Rooms"
              className="input"
              onChange={(e) => handleUpdateAvailableRooms(room.id, parseInt(e.target.value))}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageRoomTypes;

  
