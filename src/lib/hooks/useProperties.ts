import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
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

  const fetchProperties = () => {
    const q = query(collection(db, 'properties'));
    return onSnapshot(q, 
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
  };

  useEffect(() => {
    const unsubscribe = fetchProperties();
    return () => unsubscribe();
  }, []);

  const refreshProperties = () => {
    setLoading(true);
    const unsubscribe = fetchProperties();
    return () => unsubscribe();
  };

  const updateProperty = async (id: string, updatedData: Partial<Property>) => {
    try {
      const propertyRef = doc(db, 'properties', id);
      await updateDoc(propertyRef, updatedData);
    } catch (err) {
      console.error("Error updating property: ", err);
      setError("Failed to update property");
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      const propertyRef = doc(db, 'properties', id);
      await deleteDoc(propertyRef);
    } catch (err) {
      console.error("Error deleting property: ", err);
      setError("Failed to delete property");
    }
  };

  return { properties, loading, error, refreshProperties, updateProperty, deleteProperty };
}