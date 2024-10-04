import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
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
    const q = query(collection(db, 'properties'));
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const propertiesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Property));
        setProperties(propertiesData);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching properties: ", err);
        setError("Failed to fetch properties");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addProperty = async (newProperty: Omit<Property, 'id'>) => {
    try {
      await addDoc(collection(db, 'properties'), newProperty);
    } catch (err) {
      console.error("Error adding property: ", err);
      setError("Failed to add property");
    }
  };

  const updateProperty = async (propertyId: string, updatedProperty: Partial<Property>) => {
    try {
      await updateDoc(doc(db, 'properties', propertyId), updatedProperty);
    } catch (err) {
      console.error("Error updating property: ", err);
      setError("Failed to update property");
    }
  };

  const deleteProperty = async (propertyId: string) => {
    try {
      await deleteDoc(doc(db, 'properties', propertyId));
    } catch (err) {
      console.error("Error deleting property: ", err);
      setError("Failed to delete property");
    }
  };

  return { properties, loading, error, addProperty, updateProperty, deleteProperty };
}