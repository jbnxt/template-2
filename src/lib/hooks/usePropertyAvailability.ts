import { useState, useCallback } from 'react';

interface Availability {
  date: string;
  availableHours: string[];
}

interface CalendarDay {
  date: string;
  status: {
    reason: string;
    available: boolean;
  };
}

interface Reservation {
  check_in: string;
  check_out: string;
  properties: { id: string }[];
}

interface HospitableResponse {
  calendar: {
    data: {
      days: CalendarDay[];
    };
  };
  reservations: {
    data: Reservation[];
  };
}

export function usePropertyAvailability() {
  const [availableDates, setAvailableDates] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailability = useCallback(async (propertyId: string) => {
    if (!propertyId) {
      setError("Invalid property ID");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log(`Fetching availability for property: ${propertyId}`);
      const response = await fetch(`/api/availability/${propertyId}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}. ${errorText}`);
      }
      const data: HospitableResponse = await response.json();
      console.log("Received data:", data);

      const availability = processAvailability(data.calendar.data.days, data.reservations.data, propertyId);

      console.log("Calculated availability:", availability);
      setAvailableDates(availability);
    } catch (err) {
      console.error('Error fetching property availability:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch property availability');
    } finally {
      setLoading(false);
    }
  }, []);

  return { availableDates, loading, error, fetchAvailability };
}

function processAvailability(calendarDays: CalendarDay[], reservations: Reservation[], propertyId: string): Availability[] {
  const availability: Availability[] = [];

  for (const day of calendarDays) {
    const availableHours = getAvailableHours(day.date, reservations, propertyId);
    if (availableHours.length > 0) {
      availability.push({
        date: day.date,
        availableHours,
      });
    }
  }

  return availability;
}

function getAvailableHours(date: string, reservations: Reservation[], propertyId: string): string[] {
  console.log(`Calculating availability for date: ${date}`);
  
  const relevantReservations = reservations.filter(r => r.properties.some(p => p.id === propertyId));
  console.log(`Relevant reservations: ${JSON.stringify(relevantReservations)}`);
  
  const checkOuts = relevantReservations.filter(r => r.check_out.startsWith(date));
  const checkIns = relevantReservations.filter(r => r.check_in.startsWith(date));
  const ongoingReservations = relevantReservations.filter(r => 
    new Date(r.check_in) < new Date(date) && new Date(r.check_out) > new Date(date)
  );

  console.log(`Check-outs: ${checkOuts.length}, Check-ins: ${checkIns.length}, Ongoing: ${ongoingReservations.length}`);

  if (ongoingReservations.length > 0) {
    console.log(`Date ${date} is fully booked due to ongoing reservation`);
    return [];
  }

  let availableHours: string[] = [];

  if (checkOuts.length > 0 && checkIns.length > 0) {
    // There's both a check-out and check-in on this day
    const latestCheckOut = Math.max(...checkOuts.map(r => parseInt(r.check_out.split('T')[1].split(':')[0])));
    const earliestCheckIn = Math.min(...checkIns.map(r => parseInt(r.check_in.split('T')[1].split(':')[0])));
    
    if (latestCheckOut < earliestCheckIn) {
      availableHours = generateHourSlots(latestCheckOut, earliestCheckIn);
      console.log(`Available window between check-out (${latestCheckOut}:00) and check-in (${earliestCheckIn}:00)`);
    } else {
      console.log(`No available window: check-out (${latestCheckOut}:00) is after check-in (${earliestCheckIn}:00)`);
    }
  } else if (checkOuts.length > 0) {
    // Only check-outs on this day
    const latestCheckOut = Math.max(...checkOuts.map(r => parseInt(r.check_out.split('T')[1].split(':')[0])));
    availableHours = generateHourSlots(latestCheckOut, 24);
    console.log(`Available from check-out (${latestCheckOut}:00) until end of day`);
  } else if (checkIns.length > 0) {
    // Only check-ins on this day
    const earliestCheckIn = Math.min(...checkIns.map(r => parseInt(r.check_in.split('T')[1].split(':')[0])));
    availableHours = generateHourSlots(6, earliestCheckIn);
    console.log(`Available from 6:00 until check-in (${earliestCheckIn}:00)`);
  } else {
    // No check-ins or check-outs, the entire day is available
    availableHours = generateHourSlots(0, 24);
    console.log(`Entire day is available`);
  }

  return availableHours;
}

function generateHourSlots(start: number, end: number): string[] {
  const hours: string[] = [];
  for (let i = start; i < end; i++) {
    hours.push(`${i.toString().padStart(2, '0')}:00`);
  }
  return hours;
}