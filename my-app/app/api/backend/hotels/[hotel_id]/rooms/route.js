import  prisma  from "@/lib/prisma";
import { NextResponse } from "next/server";
import { parseAndVerifyToken } from "../../../../../utils/jwt.js";
import axios from "axios";

//As a hotel owner, I want to define room types, 
//with each type having a name (e.g., twin, double, etc.), amenities, prices per night, and several images.
export async function POST (request, { params }) {

    try {
        const { id } = await params;
        const { name, amenities, pricePerNight, images, availableRooms } = await request.json();

        const userDec = await parseAndVerifyToken(request);

        if (userDec.err) {
            return NextResponse.json (
                {error : "Unauthorized"},
                {status: 401}
            )
        }
        
        const user = await prisma.user.findUnique({
            where: {id: userDec.userId},
        });

        if (!user) {
            return NextResponse.json(
                {error: "You are not authorized."},
                {status: 401}
            );
        }

        if (!name || !amenities || !pricePerNight || !images || !availableRooms) {
            return NextResponse.json(
                {error: "Invalid Field"},
                {status: 400}
            );
        }
        
        const hotel = await prisma.hotel.findUnique({
            where: {
              id: id,
            }
          });

        if (hotel.ownerId !== user.id) {
            return NextResponse.json(
                {error: "You are not authorized."},
                {status: 403}
            );
        }

        const room = await prisma.roomType.create({
            data: {
              hotelId: id, 
              name,
              amenities,
              pricePerNight,
              images,
              availableRooms,
            },
        });
          
        return NextResponse.json(
            {room},
        );
    }
    catch(error) {
        console.log(error.stack);
        return NextResponse.json(
            {error : "Internal server error"},
            {status: 500}
        )
    }
}
