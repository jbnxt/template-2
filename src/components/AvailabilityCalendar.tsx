'use client'

import { useState, useEffect } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { addDays, parseISO, format, isSameDay } from 'date-fns'
import { MaintenanceWindow } from './MaintenanceWindow'
import { useTasks } from '@/lib/hooks/useTasks'

interface CalendarDay {
  date: string
  day: string
  min_stay: number
  status: {
    reason: string
    available: boolean
  }
  price: {
    amount: number
    currency: string
    formatted: string
  }
}

interface CalendarData {
  listing_id: string
  provider: string
  start_date: string
  end_date: string
  days: CalendarDay[]
}

interface AvailabilityCalendarProps {
  propertyId: string
  userId: string
}

export function AvailabilityCalendar({ propertyId, userId }: AvailabilityCalendarProps) {
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const { tasks, loading: tasksLoading, error: tasksError } = useTasks();

  console.log('All tasks:', tasks);

  useEffect(() => {
    async function fetchCalendar() {
      setLoading(true)
      try {
        const response = await fetch(`/api/availability/${propertyId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch calendar')
        }
        const data = await response.json()
        setCalendarData(data.data)
      } catch (err) {
        setError('Failed to fetch calendar')
      } finally {
        setLoading(false)
      }
    }

    fetchCalendar()
  }, [propertyId])

  if (loading || tasksLoading) return <div>Loading...</div>
  if (error || tasksError) return <div>Error: {error || tasksError}</div>
  if (!calendarData) return <div>No calendar data available</div>

  const reservedDates = calendarData.days
    .filter(day => !day.status.available)
    .map(day => parseISO(day.date))

  const maintenanceWindows = calendarData?.days.filter(day => {
    const currentDay = parseISO(day.date)
    const nextDay = calendarData.days.find(d => isSameDay(addDays(currentDay, 1), parseISO(d.date)))
    return !day.status.available && nextDay && !nextDay.status.available
  })

  const handleDateClick = (date: Date | undefined) => {
    if (!date) return
    const clickedDay = calendarData?.days.find(day => isSameDay(parseISO(day.date), date))
    if (clickedDay && maintenanceWindows?.some(window => isSameDay(parseISO(window.date), date))) {
      setSelectedDate(date)
    }
  }

  return (
    <div>
      <Calendar
        mode="single"
        selected={selectedDate || undefined}
        onSelect={handleDateClick}
        modifiers={{
          reserved: reservedDates,
          maintenance: maintenanceWindows?.map(day => parseISO(day.date)) || [],
        }}
        modifiersStyles={{
          reserved: { backgroundColor: '#FCA5A5', color: '#111827' },
          maintenance: { backgroundColor: '#93C5FD', color: '#111827' },
        }}
        className="rounded-md border"
        fromDate={parseISO(calendarData.start_date)}
        toDate={parseISO(calendarData.end_date)}
      />
      <div className="mt-4">
        <h3 className="font-semibold">Legend:</h3>
        <div className="flex items-center mt-2">
          <div className="w-4 h-4 bg-[#FCA5A5] mr-2"></div>
          <span>Reserved</span>
        </div>
        <div className="flex items-center mt-2">
          <div className="w-4 h-4 bg-[#93C5FD] mr-2"></div>
          <span>Maintenance Window</span>
        </div>
      </div>
      {selectedDate && (
        <MaintenanceWindow
          date={selectedDate}
          propertyId={propertyId}
          userId={userId}
          onClose={() => setSelectedDate(null)}
          availableTasks={tasks}
          onTasksAssigned={() => {/* Trigger a re-fetch or update of tasks */}}
        />
      )}
    </div>
  )
}