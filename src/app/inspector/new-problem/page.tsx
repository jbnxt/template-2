'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProblemForm } from '@/components/app-inspector-problem-form'

// Mock list of properties (replace this with actual data fetching in a real app)
const mockProperties = [
  'Seaside Villa',
  'Mountain Cabin',
  'City Apartment',
  'Lakeside Cottage',
  'Desert Oasis',
  'Forest Retreat',
  'Beachfront Condo',
  'Suburban House'
]

export default function NewProblemPage() {
  const router = useRouter()
  const [properties, setProperties] = useState<string[]>([])

  useEffect(() => {
    // In a real app, you would fetch the properties from an API here
    // For now, we'll just use the mock data
    setProperties(mockProperties)
  }, [])

  const handleSubmit = (formData) => {
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData)
    // After submission, redirect back to the inspector dashboard with the new problem data
    const encodedProblem = encodeURIComponent(JSON.stringify(formData))
    router.push(`/inspector/dashboard?newProblem=${encodedProblem}`)
  }

  const handleCancel = () => {
    router.push('/inspector/dashboard')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Report a New Problem</h1>
      <ProblemForm 
        onSubmit={handleSubmit} 
        onCancel={handleCancel} 
        properties={properties}
      />
    </div>
  )
}