"use client";
import React, { useState } from "react";

// create hotel

const CreateHotel = () => {
  const [formData, setFormData] = useState({
    name: "",
    logo: null as File | null,
    address: "",
    location: "",
    city: "",
    starRating: "",
  });

  const [images, setImages] = useState<File[]>([]); // Store uploaded image files
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const base64Logo = formData.logo ? await fileToBase64(formData.logo) : null; // Convert logo to base64
      const base64Images = await Promise.all(images.map((file) => fileToBase64(file))); // Convert images to base64

      const payload = {
        name: formData.name,
        logo: base64Logo, // Base64 string
        address: formData.address,
        location: formData.location,
        city: formData.city,
        starRating: formData.starRating,
        images: base64Images, // Array of base64 strings
      };

      const response = await fetch("/api/hotels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setSuccessMessage("Hotel added successfully!");
        setFormData({
          name: "",
          logo: null as File | null,
          address: "",
          location: "",
          city: "",
          starRating: "",
        });
        setImages([]); // Clear image attachments
      }
    } catch (err) {
      console.error("Error creating hotel:", err);
      setError("Failed to create hotel.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Add a Hotel</h1>
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg space-y-6 w-full max-w-md">
        <label htmlFor="name" className="block text-white">Hotel Name</label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Hotel Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 text-white"
          required
        />

        <label htmlFor="logo" className="block text-white">Upload Logo</label>
        <input
          type="file"
          name="logo"
          id="logo"
          onChange={(e) => setFormData({ ...formData, logo: e.target.files?.[0] || null })}
          className="w-full p-3 rounded bg-gray-700 text-white"
          required
        />

        <label htmlFor="address" className="block text-white">Address</label>
        <textarea
          name="address"
          id="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 text-white"
          required
        />

        <label htmlFor="location" className="block text-white">Location (City, Country)</label>
        <input
          type="text"
          name="location"
          id="location"
          placeholder="Location (City, Country)"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 text-white"
          required
        />

        <label htmlFor="city" className="block text-white">City</label>
        <input
          type="text"
          name="city"
          id="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 text-white"
          required
        />

        <label htmlFor="starRating" className="block text-white">Star Rating</label>
        <input
          type="number"
          name="starRating"
          id="starRating"
          placeholder="Star Rating"
          value={formData.starRating}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 text-white"
          required
        />

        <label htmlFor="images" className="block text-white">Upload Images</label>
        <input
          type="file"
          name="images"
          id="images"
          multiple
          onChange={handleImageChange}
          className="w-full p-3 rounded bg-gray-700 text-white"
          required
        />

        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded">
          Add Hotel
        </button>
      </form>
    </div>
  );
};

export default CreateHotel;