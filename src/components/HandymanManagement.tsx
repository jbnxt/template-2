'use client'

import { useHandymen, Handyman } from '@/lib/hooks/useHandymen'

export function HandymanManagement() {
  const { handymen, loading, error } = useHandymen();

  if (loading) return <div>Loading handymen...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Handyman Management</h2>
      <ul className="mt-4">
        {handymen.map(handyman => (
          <li key={handyman.id} className="mb-2 p-2 border rounded">
            <span>{`${handyman.firstName} ${handyman.lastName}`} - {handyman.email}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}