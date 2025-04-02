import  prisma  from "@/lib/prisma";
import { NextResponse } from "next/server";
import { parseAndVerifyToken } from "../../../../../utils/jwt.js";
import axios from "axios";

//As a hotel owner, I want to define room types, 
//with each type having a name (e.g., twin, double, etc.), amenities, prices per night, and several images.
export async function POST(request, { params }) {
    try {
      const { id } = await params;
      const { name, amenities, pricePerNight, images, totalRooms } =
        await request.json();
  
      const userDec = await parseAndVerifyToken(request);
  
      if (userDec.err) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const user = await prisma.user.findUnique({
        where: { id: userDec.userId },
      });
  
      if (!user) {
        return NextResponse.json(
          { error: "You are not authorized." },
          { status: 401 }
        );
      }
  
      if (!name || !amenities || !pricePerNight || !images || !totalRooms) {
        return NextResponse.json({ error: "Invalid Field" }, { status: 400 });
      }
  
      const hotel = await prisma.hotel.findUnique({
        where: {
          id: id,
        },
      });
  
      if (hotel.ownerId !== user.id) {
        return NextResponse.json(
          { error: "You are not authorized." },
          { status: 403 }
        );
      }
  
      const today = new Date();
      // availability for 1 year from now
      const maxDate = new Date(
        today.getFullYear() + 1,
        today.getMonth(),
        today.getDate()
      );
  
      const schedule = [];
  
      // For each room, there is a dictionary of date -> true
      for (let i = 0; i < totalRooms; i++) {
        const roomSched = {};
        let currDate = new Date(today);
        while (currDate < maxDate) {
          const dateStr = currDate.toISOString().split("T")[0];
          roomSched[dateStr] = true;
          currDate.setDate(currDate.getDate() + 1);
        }
        schedule.push(roomSched);
      }
  
      const room = await prisma.roomType.create({
        data: {
          hotelId: id,
          name,
          amenities,
          pricePerNight,
          images,
          totalRooms,
          schedule,
        },
      });
  
      return NextResponse.json({ room });
    } catch (error) {
      console.log(error.stack);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
}