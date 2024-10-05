'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { useProperties } from '@/lib/hooks/useProperties'
import { PropertySelect } from '@/components/PropertySelect'
import { AvailabilityCalendar } from '@/components/AvailabilityCalendar'

export default function SchedulePage() {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  const { properties, loading: propertiesLoading, error: propertiesError } = useProperties()
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  if (authLoading || propertiesLoading) return <div>Loading...</div>
  if (propertiesError) return <div>Error: {propertiesError}</div>
  if (!user) return null // This prevents the page from rendering before redirect

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Property Schedule</h1>
      <PropertySelect
        properties={properties}
        selectedPropertyId={selectedPropertyId}
        onSelectProperty={setSelectedPropertyId}
      />
      {selectedPropertyId && (
        <div className="mt-6">
          <AvailabilityCalendar propertyId={selectedPropertyId} userId={user.uid} />
        </div>
      )}
    </div>
  )
}