'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/hooks/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase/firebase';

import { Page as AdminDashboard } from '../../components/app-admin-dashboard-page';
import { Page as HandymanDashboard } from '../../components/app-handyman-tasks-page';
import { Page as InspectorDashboard } from '../../components/app-inspector-dashboard-page';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    } else if (user) {
      const fetchUserRole = async () => {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        } else {
          console.error('User document not found');
          router.push('/');
        }
      };
      fetchUserRole();
    }
  }, [user, loading, router]);

  if (loading || !role) {
    return <div>Loading...</div>;
  }

  switch (role) {
    case 'administrator':
      return <AdminDashboard />;
    case 'handyman':
      return <HandymanDashboard />;
    case 'inspector':
      return <InspectorDashboard />;
    default:
      return <div>Invalid user role</div>;
  }
}