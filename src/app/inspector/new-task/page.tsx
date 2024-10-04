'use client'

import { useRouter } from 'next/navigation'
import { Page as ProblemForm } from '@/components/app-inspector-problem-form'

export default function NewTaskPage() {
  const router = useRouter()

  const handleSubmit = (formData) => {
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData)
    // After submission, redirect back to the dashboard
    router.push('/dashboard')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Report a New Problem</h1>
      <ProblemForm onSubmit={handleSubmit} />
    </div>
  )
}