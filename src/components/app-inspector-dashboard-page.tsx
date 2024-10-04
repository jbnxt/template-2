'use client'

import { useState, useMemo } from 'react'
import { useProblems } from '@/lib/hooks/useProblems'
import { Problem } from '@/lib/types'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProblemForm } from './app-inspector-problem-form'

export function Page() {
  const { problems, loading, error } = useProblems()
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterProperty, setFilterProperty] = useState('all')
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [filterOpen, setFilterOpen] = useState(false)
  const [expandedProblem, setExpandedProblem] = useState<string | null>(null)
  const [isProblemFormOpen, setIsProblemFormOpen] = useState(false)

  const filteredProblems = useMemo(() => {
    if (!problems) return []
    
    return problems.filter(problem => 
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterPriority === 'all' || problem.priority === filterPriority) &&
      (filterProperty === 'all' || problem.property === filterProperty) &&
      (!filterDateFrom || new Date(problem.createdAt) >= new Date(filterDateFrom)) &&
      (!filterDateTo || new Date(problem.createdAt) <= new Date(filterDateTo))
    ).sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      return (a[sortBy as keyof Problem] as string).localeCompare(b[sortBy as keyof Problem] as string)
    })
  }, [problems, searchTerm, filterPriority, filterProperty, filterDateFrom, filterDateTo, sortBy])

  const handleSort = (key: string) => {
    setSortBy(key)
  }

  const handleCreateProblem = async (problemData: Partial<Problem>) => {
    // Implement the logic to create a new problem
    console.log('Creating new problem:', problemData)
    setIsProblemFormOpen(false)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Inspector Dashboard</h1>
      
      {/* Search and filter controls */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search problems..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-2"
        />
        {/* Add more filter controls as needed */}
      </div>

      {/* Problem list */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredProblems.map((problem) => (
            <li key={problem.id}>
              <div className="px-4 py-4 flex items-center sm:px-6">
                <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{problem.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{problem.description}</p>
                  </div>
                  <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {problem.status}
                    </p>
                  </div>
                </div>
                <div className="ml-5 flex-shrink-0">
                  <button
                    onClick={() => setExpandedProblem(expandedProblem === problem.id ? null : problem.id)}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    {expandedProblem === problem.id ? 'Hide Details' : 'View Details'}
                  </button>
                </div>
              </div>
              {expandedProblem === problem.id && (
                <div className="px-4 py-4 sm:px-6 bg-gray-50">
                  {/* Add expanded problem details here */}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <Button onClick={() => setIsProblemFormOpen(true)} className="mt-4">
        Report New Problem
      </Button>

      {/* Problem Form Dialog */}
      <Dialog open={isProblemFormOpen} onOpenChange={setIsProblemFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report a New Problem</DialogTitle>
          </DialogHeader>
          <ProblemForm onSubmit={handleCreateProblem} onCancel={() => setIsProblemFormOpen(false)} properties={[]} />
        </DialogContent>
      </Dialog>
    </div>
  )
}