import  prisma  from "@/lib/prisma";
import { NextResponse } from "next/server";
import { parseAndVerifyToken } from "../../../../../../utils/jwt.js";
import { findAvailability } from "../../../../../../utils/availablehelp.js";
import axios from "axios";

//As a hotel owner, I want to update the number of available rooms of each type in my hotel.
//If availability decreases, it may require canceling some existing reservations.
export async function PATCH(request, { params }) {

    try {
        const {availableRooms} = await request.json();

        const checkIn = searchParams.get("checkIn");
        const checkOut = searchParams.get("checkOut");

        const {id} = await params;

        const userDec = await parseAndVerifyToken(request);

        const { origin } = new URL(request.url);
        const notificationsUrl = new URL("/api/notifications", origin);

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

        if (!availableRooms) {
            return NextResponse.json(
                {error: "Invalid Field"},
                {status: 400}
            );
        }

        room = await prisma.room.findUnique({
            where: {
                id: id,
            },
        });

        hotel = await prisma.hotel.findUnique({
            where: {
                id: room.hotelId,
            },
        });

        if (!hotel) {
            return NextResponse.json(
                {error: "Hotel not found."},
                {status: 404}
            );
        }

        if (hotel.ownerId !== user.id) {
            return NextResponse.json(
                {error: "You are not authorized."},
                {status: 403}
            );
        }

        if (availableRooms > roomType.totalRooms) {
            return NextResponse.json(
              { error: "Available rooms cannot exceed total rooms." },
              { status: 400 }
            );
        }

        if (availableRooms < 0) {
            return NextResponse.json(
              { error: "Available rooms cannot be negative." },
              { status: 400 }
            );
        }
        
        let currentAvailableRooms = findAvailability(roomType.schedule, checkIn, checkOut);

        if (currentAvailableRooms > availableRooms) {
            return NextResponse.json(
                { message: "Current available rooms already higher than requested availability." },
                { status: 200 }
            );
        }

        const bookings = await prisma.hotelBooking.findMany({
            where: { roomTypeId: id },
        });

        for (const booking of bookings) {
            if (booking.status === "CANCELLED") {
                continue;
            }
            if ((new Date(booking.checkIn) < new Date(checkOut)) && (new Date(checkOut) > new Date(booking.checkIn))) {

                setAvailability(
                    roomType.schedule,
                    booking.checkIn,
                    booking.checkOut,
                    booking.roomIndex,
                    availability = true,
                );
                
                await prisma.hotelBooking.update({
                    where: { id: booking.id },
                    data: { status: "CANCELLED" },
                });
                  // notify user

                currentAvailableRooms = findAvailability(roomType.schedule, checkIn, checkOut);
                if (currentAvailableRooms === availableRooms) {
                    return NextResponse.json(
                        { message: "Current available rooms match requested availability." },
                        { status: 200 }
                    );
                }
            }
        }

        return NextResponse.json(
            { message: "Current available rooms match requested availability." },
            { status: 200 }
        );
    }
    catch(error) {
        return NextResponse.json(
            {error : "Internal server error"},
            {status: 500}
        )
    }
        
}

//As a visitor, I want to view the availability
//and details of different room types for my selected dates in a selected hotel.

export async function GET(request, { params }) {

    try {
        const {id} = await params;

        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        const room = await prisma.room.findUnique({
            where: {
                id: id,
            },
        });

        const availRooms = findAvailability(room.schedule, startDate, endDate);

        return NextResponse.json(
            {availRooms}
        );
    }

    catch (error)   {
        return NextResponse.json(
            {error : "Internal server error"},
            {status: 500}
        )
    }
}