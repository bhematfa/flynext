// app/api/bookings/cancel/route.js
/*****************************************************
 * OpenAI. (2025). ChatGPT (Feb 06 version) [Large language model]. https://chatgpt.com
 *****************************************************/

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parseAndVerifyToken } from "@/utils/jwt";

async function cancelAFSFlight(bookingReference, lastName) {
  const url = "https://advanced-flights-system.replit.app/api/bookings/cancel";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.AFS_API_KEY,
    },
    body: JSON.stringify({
      bookingReference,
      lastName,
    }),
  });
  if (res.status == 400) {
    return res.json();
  }
  if (!res.ok) {
    console.log("AFS fetch not OK, body:", await res.text());
    return null;
  }
  return res.json();
}

export async function POST(request) {
  try {
    const { origin } = new URL(request.url);
    const notificationsUrl = new URL("/api/notifications", origin);
    const user = parseAndVerifyToken(request);
    if (!user || user.err) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("role: ", user.role);
    if (user.role !== "USER" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const body = await request.json();
    const { bookingId, flightBookingId, hotelBookingId } = body;
    if (!bookingId) {
      return NextResponse.json(
        { error: "You need to provide a Booking ID" },
        { status: 400 }
      );
    }
    if (!hotelBookingId && !flightBookingId) {
      return NextResponse.json(
        { error: "You need to cancel at least one booking" },
        { status: 400 }
      );
    }
    const requester = await prisma.user.findUnique({
      where: { id: user.userId },
    });
    console.log("requester: ", requester);
    if (!requester) {
      return NextResponse.json({ error: "Wrong user" }, { status: 404 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    console.log(booking);
    if (booking.userId !== user.userId) {
      console.log("booker: ", booking.userId);
      console.log("user: ", user.userId);
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let flightCancelRes = null;
    let flightBooking;
    if (flightBookingId) {
      flightBooking = await prisma.flightBooking.findUnique({
        where: { id: flightBookingId },
      });

      console.log("trying to cancel flight");
      flightCancelRes = await cancelAFSFlight(
        flightBooking.reference,
        requester.lastName
      );
      if (flightCancelRes?.error) {
        let aFSmessage = flightCancelRes.error;
        return NextResponse.json({ message: aFSmessage }, { status: 400 });
      }
      if (!flightCancelRes) {
        return NextResponse.json(
          { error: "AFS Cancellation Error" },
          { status: 500 }
        );
      }
      let internalFlightBooking = await prisma.flightBooking.update({
        where: { id: flightBookingId },
        data: { status: "CANCELLED" },
      });
      if (user.userId) {
        const notifyRes = await fetch(notificationsUrl.toString(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `Your Flight room booking has been cancelled.`,
            uid: user.userId,
          }),
        });
        if (!notifyRes || notifyRes.error) {
          return NextResponse.json({ error: notifyRes.error }, { status: 404 });
        }
      }
      if (!internalFlightBooking) {
        return NextResponse.json(
          { error: "Flight Booking not found" },
          { status: 404 }
        );
      }
    }

    let hotelCancelRes = null;
    if (hotelBookingId) {
      hotelCancelRes = await prisma.hotelBooking.update({
        where: { id: hotelBookingId },
        data: { status: "CANCELLED" },
      });
      if (!hotelCancelRes) {
        return NextResponse.json(
          { error: "Hotel Booking not found" },
          { status: 404 }
        );
      }
    }

    // overall booking cancellation
    if (flightBookingId && hotelBookingId) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: "CANCELLED" },
      });
      if (user.userId) {
        const notifyRes = await fetch(notificationsUrl.toString(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `Your Hotel room booking has been cancelled.`,
            uid: user.userId,
          }),
        });
        if (!notifyRes || notifyRes.error) {
          return NextResponse.json({ error: notifyRes.error }, { status: 404 });
        }
      }
    }

    return NextResponse.json({
      message: "Cancellation processed",
      flightCancel: flightCancelRes,
      hotelCancel: hotelCancelRes,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
