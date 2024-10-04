'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Filter, Plus } from 'lucide-react'

// Mock data for demonstration
const mockProblems = [
  { id: 1, property: 'Seaside Villa', date: '2023-05-01', priority: 'high', description: 'Leaking roof in master bedroom' },
  { id: 2, property: 'Mountain Cabin', date: '2023-05-02', priority: 'medium', description: 'Faulty electrical outlet in kitchen' },
  { id: 3, property: 'City Apartment', date: '2023-05-03', priority: 'low', description: 'Broken door handle on bathroom door' },
  // Add more mock data as needed
]

export function Page() {
  const [problems, setProblems] = useState(mockProblems)
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState('date')
  const [filterPriority, setFilterPriority] = useState('all')

  const handleSort = (key) => {
    setSortBy(key)
    setProblems([...problems].sort((a, b) => a[key].localeCompare(b[key])))
  }

  const handleFilter = (priority) => {
    setFilterPriority(priority)
    if (priority === 'all') {
      setProblems(mockProblems)
    } else {
      setProblems(mockProblems.filter(problem => problem.priority === priority))
    }
  }

  const priorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Inspector Dashboard</h1>
            <Link href="/inspector/report-problem" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-airbnb-teal hover:bg-airbnb-teal-dark">
              <Plus className="mr-2 h-5 w-5" />
              New Report
            </Link>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <div className="flex items-center justify-between flex-wrap sm:flex-nowrap">
                <div className="flex-1 flex items-center">
                  <button
                    onClick={() => setFilterOpen(!filterOpen)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-airbnb-teal"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </button>
                </div>
                <div className="mt-4 flex-shrink-0 flex sm:mt-0 sm:ml-4">
                  <span className="mr-2">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSort(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-airbnb-teal focus:border-airbnb-teal sm:text-sm rounded-md"
                  >
                    <option value="date">Date</option>
                    <option value="priority">Priority</option>
                    <option value="property">Property</option>
                  </select>
                </div>
              </div>
              {filterOpen && (
                <div className="mt-4 flex items-center space-x-4">
                  <span>Filter by priority:</span>
                  {['all', 'low', 'medium', 'high'].map((priority) => (
                    <button
                      key={priority}
                      onClick={() => handleFilter(priority)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        filterPriority === priority
                          ? 'bg-airbnb-teal text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <ul className="divide-y divide-gray-200">
              {problems.map((problem) => (
                <li key={problem.id}>
                  <div className="px-4 py-4 flex items-center sm:px-6">
                    <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <div className="flex text-sm">
                          <p className="font-medium text-airbnb-coral truncate">{problem.property}</p>
                          <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                            on {new Date(problem.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="mt-2 flex">
                          <div className={`flex-shrink-0 inline-block px-2 py-0.5 text-xs font-medium rounded-full ${priorityColor(problem.priority)} text-white`}>
                            {problem.priority}
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-700">
                          {problem.description}
                        </div>
                      </div>
                    </div>
                    <div className="ml-5 flex-shrink-0">
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}