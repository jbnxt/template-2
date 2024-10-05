import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export function RoleBasedRoute({ children, allowedRoles }: RoleBasedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !allowedRoles.includes(user.role || ''))) {
      router.push('/');
    }
  }, [user, loading, allowedRoles, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !allowedRoles.includes(user.role || '')) {
    return null;
  }

  return <>{children}</>;
}