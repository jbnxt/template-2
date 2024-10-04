import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';

export interface Handyman {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export function useHandymen() {
  const [handymen, setHandymen] = useState<Handyman[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'users'),
      where('role', '==', 'handyman')
    );
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const handymenData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          firstName: doc.data().firstName,
          lastName: doc.data().lastName,
          email: doc.data().email,
          role: doc.data().role
        } as Handyman));
        setHandymen(handymenData);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching handymen: ", err);
        setError("Failed to fetch handymen");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { handymen, loading, error };
}