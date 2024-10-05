import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, getDoc, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';

export interface Property {
  id: string;
  name: string;
  address: string;
}

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db) {
      setError("Firestore is not initialized");
      setLoading(false);
      return;
    }

    const propertiesQuery = query(collection(db, 'properties'));

    const unsubscribe = onSnapshot(propertiesQuery,
      (snapshot) => {
        const propertiesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Property));
        setProperties(propertiesData);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching properties:", err);
        setError("Failed to fetch properties");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const getPropertyDetails = async (propertyId: string): Promise<Property | null> => {
    if (!db) return null;
    try {
      const propertyDoc = await getDoc(doc(db, 'properties', propertyId));
      if (propertyDoc.exists()) {
        return { id: propertyDoc.id, ...propertyDoc.data() } as Property;
      }
      return null;
    } catch (err) {
      console.error("Error fetching property details:", err);
      return null;
    }
  };

  return { properties, loading, error, getPropertyDetails };
}