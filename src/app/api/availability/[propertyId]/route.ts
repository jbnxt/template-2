import { NextResponse } from 'next/server'

const HOSPITABLE_API_URL = 'https://public.api.hospitable.com/v2'
const HOSPITABLE_API_KEY = process.env.HOSPITABLE_API_KEY

async function fetchAllReservations(propertyId: string, startDate: string, endDate: string) {
  let allReservations = [];
  let page = 1;
  const perPage = 100; // Maximum allowed by the API

  while (true) {
    const url = new URL(`${HOSPITABLE_API_URL}/reservations`);
    url.searchParams.append('properties[]', propertyId);
    url.searchParams.append('start_date', startDate);
    url.searchParams.append('end_date', endDate);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('per_page', perPage.toString());
    url.searchParams.append('include', 'properties');

    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${HOSPITABLE_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Reservations API failed: ${response.status} ${response.statusText}. ${errorText}`);
    }

    const data = await response.json();
    allReservations = allReservations.concat(data.data);

    if (data.meta.current_page >= data.meta.last_page || page >= 100) {
      break;
    }

    page++;
  }

  return allReservations.filter(reservation => 
    reservation.properties.some(property => property.id === propertyId)
  );
}

export async function GET(
  request: Request,
  { params }: { params: { propertyId: string } }
) {
  const { propertyId } = params

  if (!HOSPITABLE_API_KEY) {
    console.error('HOSPITABLE_API_KEY is not set');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    const today = new Date()
    const endDate = new Date(today)
    endDate.setDate(today.getDate() + 60)  // Fetch 60 days of data

    const startDateString = today.toISOString().split('T')[0]
    const endDateString = endDate.toISOString().split('T')[0]

    console.log(`Fetching data for property ${propertyId} from ${startDateString} to ${endDateString}`);

    const [calendarResponse, reservations] = await Promise.all([
      fetch(`${HOSPITABLE_API_URL}/properties/${propertyId}/calendar?start_date=${startDateString}&end_date=${endDateString}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${HOSPITABLE_API_KEY}`,
        },
      }),
      fetchAllReservations(propertyId, startDateString, endDateString)
    ]);

    if (!calendarResponse.ok) {
      const errorText = await calendarResponse.text();
      throw new Error(`Calendar API failed: ${calendarResponse.status} ${calendarResponse.statusText}. ${errorText}`);
    }

    const calendarData = await calendarResponse.json()
    
    return NextResponse.json({ calendar: calendarData, reservations: { data: reservations } })
  } catch (error) {
    console.error('Error fetching data:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to fetch data' }, { status: 500 })
  }
}