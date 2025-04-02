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
  const [logos, setLogo] = useState<File | null>(null); // Store the logo file separately
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const formDataToSubmit = new FormData(); // Use FormData to handle file uploads
    formDataToSubmit.append("name", formData.name);
    images.forEach((image, index) => formDataToSubmit.append(`images`, image)); // Append each image file
    formDataToSubmit.append("address", formData.address);
    formDataToSubmit.append("location", formData.location);
    formDataToSubmit.append("city", formData.city);
    formDataToSubmit.append("starRating", formData.starRating);
    images.forEach((image, index) => formDataToSubmit.append(`images`, image)); // Append each image file

    try {
      const response = await fetch("/api/backend/hotels", {
        method: "POST",
        body: formDataToSubmit, // Directly pass FormData
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