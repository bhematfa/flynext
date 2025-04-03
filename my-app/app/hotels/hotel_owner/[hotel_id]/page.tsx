"use client";
import React, { useEffect, useState } from "react";
import { RoomType } from "@prisma/client";
import { useSearchParams } from "next/navigation";

const ManageRoomTypes = ({ params }: { params: Promise<{ hotel_id: string }> }) => {

  const [hotelId, setHotelId] = useState<string | null>(null);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    amenities: "",
    pricePerNight: "",
    totalRooms: "",
  });
  const [images, setImages] = useState<File[]>([]); // Store uploaded image files
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [availableRooms, setAvailableRooms] = useState<{ [key: string]: number }>({}); // Track available rooms

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const resolvedParams = await params; // Unwrap the Promise
        const id = resolvedParams.hotel_id; // Extract hotel_id
        setHotelId(id); // Set hotelId in state

        // Fetch room types once hotelId is set
        const response = await fetch(`/api/hotels/${id}/rooms`);
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

    // Call the function directly inside useEffect
    fetchRoomTypes();
  }, [params]); // Dependency array ensures it runs only when params change

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvailableRoomsChange = (roomId: string, value: string) => {
    setAvailableRooms((prevState) => ({
      ...prevState,
      [roomId]: parseInt(value, 10),
    }));
  };

  const handleUpdateAvailableRooms = async (roomId: string) => {
    try {
      const response = await fetch(`/api/hotels/rooms/${roomId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availableRooms: availableRooms[roomId] }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(`Error: ${data.error}`);
      } else {
        alert("Room availability updated successfully!");
        const updatedRoomTypes = roomTypes.map((room) =>
          room.id === roomId ? { ...room, availableRooms: availableRooms[roomId] } : room
        );
        setRoomTypes(updatedRoomTypes);
      }
    } catch (error) {
      console.error("Error updating room availability:", error);
      alert("An error occurred while updating room availability.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files)); // Convert FileList to an array of File objects
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string); // Base64 string
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleCreateRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const base64Images = await Promise.all(images.map((file) => fileToBase64(file))); // Convert images to base64

      const payload = {
        name: formData.name,
        amenities: formData.amenities.split(","),
        pricePerNight: parseFloat(formData.pricePerNight),
        images: base64Images, // Array of base64 strings
        totalRooms: parseInt(formData.totalRooms),
      };

      const response = await fetch(`/api/hotels/${hotelId}/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
          totalRooms: "",
        });
        setImages([]); // Clear image attachments
      }
    } catch (err) {
      console.error("Error creating room type:", err);
      setError("Failed to create room type.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Room Types</h1>
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      {/* Form Section */}
      <form onSubmit={handleCreateRoom} className="bg-gray-800 p-6 -lg space-y-6 w-full max-w-md">
        <label htmlFor="name" className="block text-white">Room Name {hotelId}</label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 text-white"
          placeholder="E.g., Twin, Double"
          required
        />

        <label htmlFor="amenities" className="block text-white">Amenities</label>
        <textarea
          id="amenities"
          name="amenities"
          value={formData.amenities}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 text-white"
          placeholder="Comma-separated amenities"
          required
        />

        <label htmlFor="pricePerNight" className="block text-white">Price Per Night</label>
        <input
          id="pricePerNight"
          type="number"
          name="pricePerNight"
          value={formData.pricePerNight}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 text-white"
          placeholder="E.g., 100"
          required
        />

        <label htmlFor="totalRooms" className="block text-white">Total Rooms</label>
        <input
          id="totalRooms"
          type="number"
          name="totalRooms"
          value={formData.totalRooms}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 text-white"
          placeholder="E.g., 10"
          required
        />

        <label htmlFor="images" className="block text-white">Upload Images</label>
        <input
          id="images"
          type="file"
          name="images"
          multiple
          onChange={handleImageChange}
          className="w-full p-3 rounded bg-gray-700 text-white"
          required
        />

        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded">
          Create Room Type
        </button>
      </form>

      {/* Room List Section */}
      <div className="overflow-y-auto max-h-64 bg-gray-800 p-4 space-y-4 w-full max-w-md">
        {roomTypes.map((room) => (
          <div key={room.id} className="bg-gray-700 p-4 rounded space-y-2">
            <h2 className="text-lg font-bold text-white">{room.name}</h2>
            <p className="text-white"><strong>Amenities:</strong> {Array.isArray(room.amenities) ? room.amenities.join(", ") : "No amenities listed"}</p>
            <p className="text-white"><strong>Price Per Night:</strong> ${room.pricePerNight.toString()}</p>
            <p className="text-white"><strong>Total Rooms:</strong> {room.totalRooms}</p>

            {/* Update Available Rooms Section */}
            <div>
              <label className="block text-white" htmlFor={`available-rooms-${room.id}`}>
                Update Available Rooms:
              </label>
              <input
                id={`available-rooms-${room.id}`}
                type="number"
                value={availableRooms[room.id] || ""}
                onChange={(e) => handleAvailableRoomsChange(room.id, e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-white"
                placeholder="Enter number"
              />
              <button
                onClick={() => handleUpdateAvailableRooms(room.id)}
                className="mt-2 w-full bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </div>

            {/* Slideshow Section */}
            <div className="relative w-full h-48 bg-gray-600 rounded overflow-hidden">
              {room.images.length > 0 ? (
                room.images.map((image, index) => (
                  <img
                    key={index}
                    src={`/${image}`} // Assuming images are served from "my-app/uploads"
                    alt={`Room image ${index + 1}`}
                    className={`w-full h-full object-cover ${index === 0 ? "block" : "hidden"}`} // Add logic to show only the current slide
                  />
                ))
              ) : (
                <p className="text-white">No images available.</p>
              )}
              <div className="absolute inset-0 flex justify-between items-center px-2">
                <button
                  className="bg-black bg-opacity-50 text-white p-2 rounded"
                // Implement logic to navigate to the previous slide
                >
                  ◀
                </button>
                <button
                  className="bg-black bg-opacity-50 text-white p-2 rounded"
                // Implement logic to navigate to the next slide
                >
                  ▶
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageRoomTypes;