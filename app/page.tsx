"use client";

import { useState, useEffect } from "react";
import moment, { Moment } from "moment";
import "moment/locale/de";

interface Booking {
  startDate: string;
  endDate: string;
  guestName: string;
  numberOfGuests: number;
}

const dummyBookings: Booking[] = [
  {
    startDate: "2024-06-15",
    endDate: "2024-06-20",
    guestName: "Max Mustermann",
    numberOfGuests: 4,
  },
  {
    startDate: "2024-07-01",
    endDate: "2024-07-05",
    guestName: "Anna Müller",
    numberOfGuests: 2,
  },
  {
    startDate: "2024-08-10",
    endDate: "2024-08-14",
    guestName: "Familie Schmidt",
    numberOfGuests: 6,
  },
  {
    startDate: "2024-09-20",
    endDate: "2024-09-25",
    guestName: "Firma XYZ",
    numberOfGuests: 8,
  },
  {
    startDate: "2024-10-05",
    endDate: "2024-10-08",
    guestName: "Erika Musterfrau",
    numberOfGuests: 3,
  },
  {
    startDate: "2024-11-12",
    endDate: "2024-11-15",
    guestName: "Hans Meier",
    numberOfGuests: 2,
  },
  {
    startDate: "2024-12-23",
    endDate: "2024-12-27",
    guestName: "Familie Schneider",
    numberOfGuests: 5,
  },
];

const Calendar: React.FC = () => {
  const [currentYear, setCurrentYear] = useState<number>(moment().year());
  const [selectedDate, setSelectedDate] = useState<Moment | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(dummyBookings);

  useEffect(() => {
    // Beispiel-Funktion zum Abrufen der Buchungen vom Backend
    const fetchBookings = async () => {
      try {
        const response = await fetch("/api/bookings");
        const data: Booking[] = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Fehler beim Abrufen der Buchungen:", error);
      }
    };

    fetchBookings();
  }, []);

  const handleDateClick = (date: Moment) => {
    setSelectedDate(date);
    // Öffne das Modal zur Buchung oder Reservierung
  };

  const isDateBooked = (date: Moment) => {
    return bookings.some((booking) => {
      const startDate = moment(booking.startDate);
      const endDate = moment(booking.endDate);
      return date.isBetween(startDate, endDate, "day", "[]");
    });
  };

  const isCurrentDate = (date: Moment) => {
    return moment().isSame(date, "day");
  };
  const renderCalendar = () => {
    const months: JSX.Element[] = [];
    const startDate = moment().year(currentYear).startOf("year");
    const endDate = moment().year(currentYear).endOf("year");

    while (startDate.isBefore(endDate)) {
      const monthDates: Moment[] = [];
      const monthStart = moment(startDate).startOf("month");
      const monthEnd = moment(startDate).endOf("month");

      while (monthStart.isBefore(monthEnd)) {
        monthDates.push(moment(monthStart));
        monthStart.add(1, "day");
      }

      months.push(
        <div
          key={startDate.format("YYYY-MM")}
          className="bg-white rounded-lg shadow-md p-4"
        >
          <h3 className="font-semibold mb-4 text-center">
            {startDate.format("MMMM")}
          </h3>
          <div className="grid grid-cols-7 gap-2">
            {monthDates.map((date) => (
              <div
                key={date.format("YYYY-MM-DD")}
                className={`text-center py-1 rounded-md ${
                  isDateBooked(date)
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-800"
                } ${
                  date.isSame(selectedDate, "day") ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => handleDateClick(date)}
              >
                {date.format("DD")}
              </div>
            ))}
          </div>
        </div>
      );

      startDate.add(1, "month");
    }

    return months;
  };

  const handlePrevYear = () => {
    setCurrentYear((prevYear) => prevYear - 1);
  };

  const handleNextYear = () => {
    setCurrentYear((prevYear) => prevYear + 1);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Belegungskalender</h2>
      <div className="flex items-center justify-between mb-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={handlePrevYear}
        >
          Vorheriges Jahr
        </button>
        <span className="text-lg font-semibold">{currentYear}</span>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={handleNextYear}
        >
          Nächstes Jahr
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {renderCalendar()}
      </div>
    </div>
  );
};

export default Calendar;
