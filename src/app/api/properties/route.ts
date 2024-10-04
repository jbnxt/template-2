import { NextResponse } from 'next/server';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';

const HOSPITABLE_API_URL = 'https://public.api.hospitable.com/v2/properties';
const HOSPITABLE_API_KEY = process.env.HOSPITABLE_API_KEY;

async function fetchAllProperties() {
  let allProperties = [];
  let nextPageUrl = HOSPITABLE_API_URL + '?per_page=100'; // Start with 100 per page

  while (nextPageUrl) {
    console.log('Fetching properties from:', nextPageUrl);
    const response = await fetch(nextPageUrl, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${HOSPITABLE_API_KEY}`,
      },
    });

    if (!response.ok) {
      console.error('Hospitable API response not OK:', response.status, response.statusText);
      const errorBody = await response.text();
      console.error('Error body:', errorBody);
      throw new Error('Failed to fetch properties from Hospitable');
    }

    const data = await response.json();
    allProperties = allProperties.concat(data.data);
    nextPageUrl = data.links.next;
  }

  return allProperties;
}

export async function GET() {
  try {
    console.log('Fetching all properties from Hospitable...');
    const properties = await fetchAllProperties();
    console.log(`Received ${properties.length} properties from Hospitable`);

    console.log('Storing properties in Firebase...');
    const propertiesCollection = collection(db, 'properties');
    for (const property of properties) {
      await setDoc(doc(propertiesCollection, property.id), {
        id: property.id,
        name: property.name,
        address: property.address.display,
        // Add other relevant fields as needed
      });
    }

    console.log('Properties synced successfully');
    return NextResponse.json({ message: `${properties.length} properties synced successfully` });
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json({ error: 'Failed to sync properties', details: error.message }, { status: 500 });
  }
}