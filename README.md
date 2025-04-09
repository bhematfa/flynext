# FlyNext



FlyNext is a comprehensive travel booking platform designed to provide users with a seamless experience in searching for flights and hotels, managing bookings, and handling notifications. Built with Next.js, Prisma, and TypeScript, FlyNext ensures a robust and type-safe development environment.



# Features



## Accounts



-	User Registration and Authentication: Users can sign up, log in, log out, and edit their profiles, including first and last name, email, profile picture, and phone number. Authentication is managed using JWT tokens.




## Flights Search



*	Flight Lookup: Visitors can search for flights by specifying source, destination, and date(s), supporting both one-way and round-trip options.



 
*	Flight Details: View comprehensive flight information, including departure/arrival times, duration, and layovers.



 
-	Auto-Complete Suggestions: As users type in the source or destination fields, an auto-complete dropdown suggests cities and airports.



 
 
-	Date Picker: A user-friendly date picker allows easy selection of travel dates.


 

## Hotel Management



-	Hotel Addition: Users can add their hotels to the platform, specifying details like name, logo, address, location, star-rating, and images.

-	Room Types Definition: Hotel owners can define room types with names (e.g., twin, double), amenities, prices per night, and images.

-	Booking Management: Hotel owners can view and filter their hotel’s booking list by date and/or room type, cancel reservations, and update room availability.

-	Room Availability: Owners can view room availability for specific date ranges to understand occupancy trends.



## Hotel Search

-	Hotel Lookup: Visitors can search for hotels by check-in date, check-out date, and city, with filters for name, star-rating, and price range. Results display hotel information, starting price, and a location pinpoint on a map, reflecting only available rooms.
  
-	Detailed Hotel Information: View detailed hotel information, including room types, amenities, and pricing.

-	Room Availability: Check the availability and details of different room types for selected dates in a chosen hotel.

## Booking

-	Itinerary Booking: Users can book an itinerary that includes a flight (one-way or round-trip) and/or a hotel reservation.

-	Checkout Process: A checkout page displays all details about the itinerary, collects credit card information, validates card details, and finalizes the booking if everything is correct. Note: Validation involves statically checking the validity of the card number and expiry date; no real charges are made.

-	Suggestions: Users receive hotel suggestions for the city they are flying to and flight suggestions when booking a hotel stay, with links to the main hotel/flight search page with pre-filled inputs, preserving the current order.

-	PDF Invoice: Upon booking, users receive a minimal PDF invoice for their trip, serving as a record of the booking and transaction.

-	Booking Management: Users can view their bookings to access itinerary and booking information and cancel all or specific parts of a booking, providing flexibility in managing trips.

-	Flight Verification: Users can verify their flight booking to ensure the flight schedule remains as planned.

## Notifications

-	User Notifications: Users receive notifications when they book a new itinerary and when there are external changes to their booking (e.g., cancellation by themselves or the hotel owner).

-	Hotel Owner Notifications: Hotel owners receive notifications when a new booking is made for their hotel.

-	Unread Notifications Badge: Users and hotel owners can see the number of unread notifications as a badge, updated as they read them.

## User Experience

-	Intuitive Interface: A clean and intuitive user interface allows visitors to navigate the platform effortlessly.

-	Responsive Design: The website renders well on different screen sizes (monitors, laptops, tablets, and mobile devices), ensuring accessibility and usability across devices.

-	Dark/Light Mode Toggle: Visitors can toggle between dark and light modes for a comfortable viewing experience.


## Technologies

-	Next.js: For server-side rendering and routing.

-	Prisma: For database ORM.

-	TypeScript: For type safety.

- React: For dynamic web pages

-	Tailwind CSS: For styling.

-	JWT: For authentication.

- Puppeteer: For PDF generation.

- OSM: For Hotel pinpoint on a Map.

- Docker: For Containerization.


## Project Structure

```
flynext/
├── my-app/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/            // Authentication routes
│   │   │   ├── booking/         // Booking-related routes
│   │   │   ├── flights/         // Flight search routes
│   │   │   ├── hotels/          // Hotel search and management routes
│   │   │   └── notifications/   // Notification routes
│   │   ├── components/          // Reusable React components
│   │   ├── {pageName}/page.tsx  // Next.js pages
│   │   ├── styles/              // Styling files
│   │   └── utils/               // Utility functions
│   ├── prisma/
│   │   └── schema.prisma        // Prisma schema
│   ├── public/
│   │   └── images/              // Public images
│   ├── .env                     // Environment variables
│   ├── package.json             // Project dependencies
│   ├── README.md                // Project documentation
│   └── tsconfig.json            // TypeScript configuration
└── docker-compose.yaml          // Docker Compose configuration
```




## Setup

1.	Clone the repository:

```
git clone https://github.com/bhematfa/flynext.git
```

2.	Navigate to the project directory:

```
cd flynext/my-app
```

3.	Install dependencies:

```
npm install
```

4.	Set up the environment variables:
 
Create a .env file in the my-app directory and add the following (replace with your actual values):

```
DATABASE_URL=your-database-url
JWT_SECRET=your-jwt-secret
AFS_API_KEY=your-afs-api-key
AFS_BASE_URL=https://advanced-flights-system.replit.app/
```

5.	Push the Prisma schema and migrate the database:

```
npx prisma generate
npx prisma migrate dev --name init
```

6.	Run the development server:

```
npm run dev
```
Your app should now be running at http://localhost:3000


## Usage
Visit /login or /register to create or log in to a user account.
Use the search bars to find flights and hotels.
Add hotels if you are a hotel owner.
Book your itinerary and complete checkout with valid (simulated) credit card information.
View or cancel bookings from the My Bookings page.
Receive notifications based on your interactions.
View your cart from the Cart page and proceed to checkout.


## Contributing

Contributions are welcome! If you’re working on a feature or fixing a bug, please:
1.	Fork the repository.
2.	Create a new branch (feature/your-feature-name or bugfix/your-bug-fix).
3.	Commit your changes.
4.	Push to your fork and submit a pull request.


## License

This project is licensed under the MIT License.


## Acknowledgements
*	Special thanks to all contributors who helped shape this platform.
*	Replit AFS API for simulated flight data.


