"use client";
import React, { useEffect, useState } from "react";
import prisma from "@/lib/prisma";
import { Hotel, RoomType } from "@prisma/client";
import Link from 'next/link';

const CreateHotel = () => {

    const [formData, setFormData] = useState({
        name: "",
        logo: "",
        address: "",
        location: "",
        city: "",
        starRating: "",
        images: "",
    }); 

    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        try {
            const response = await fetch("/api/backend/hotels", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (data.error) {
                setError(data.error);
            } else {
                setSuccessMessage("Hotel added successfully!");
                setFormData({
                    name: "",
                    logo: "",
                    address: "",
                    location: "",
                    city: "",
                    starRating: "",
                    images: "",
                });
            }
        } catch (err) {
            console.error("Error creating hotel:", err);
            setError("Failed to create hotel.");
        }
    };
    return (
        <div className="max-w-3xl mx-auto py-10">
          <h1 className="text-3xl font-bold mb-6">Add a Hotel</h1>
          {error && <p className="text-red-500">{error}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="name"
              placeholder="Hotel Name"
              value={formData.name}
              onChange={handleChange}
              className="input"
              required
            />
            <input
              type="text"
              name="logo"
              placeholder="Logo URL"
              value={formData.logo}
              onChange={handleChange}
              className="input"
              required
            />
            <textarea
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="input"
              required
            />
            <input
              type="text"
              name="location"
              placeholder="Location (City, Country)"
              value={formData.location}
              onChange={handleChange}
              className="input"
              required
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              className="input"
              required
            />
            <input
              type="number"
              name="starRating"
              placeholder="Star Rating"
              value={formData.starRating}
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
            <button type="submit" className="btn bg-blue-500 text-white">
              Add Hotel
            </button>
          </form>
        </div>
      );
};


export default CreateHotel; 

