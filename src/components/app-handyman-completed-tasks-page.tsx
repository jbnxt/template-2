'use client'

import { useState } from 'react'
import { Search, Filter, Calendar } from 'lucide-react'
import Link from 'next/link'

const initialTasks = [
  { id: 1, property: 'Seaside Villa', description: 'Fixed leaking roof', completionDate: '2023-05-10', timeTaken: '4 hours' },
  { id: 2, property: 'Mountain Cabin', description: 'Replaced faulty electrical outlet', completionDate: '2023-05-08', timeTaken: '2 hours' },
  { id: 3, property: 'City Apartment', description: 'Painted living room', completionDate: '2023-05-05', timeTaken: '6 hours' },
  { id: 4, property: 'Lakeside Cottage', description: 'Repaired deck railing', completionDate: '2023-05-03', timeTaken: '3 hours' },
  { id: 5, property: 'Beach House', description: 'Cleaned and maintained AC units', completionDate: '2023-05-01', timeTaken: '5 hours' },
]

export function Page() {
  const [tasks, setTasks] = useState(initialTasks)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterProperty, setFilterProperty] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const filteredTasks = tasks.filter(task => 
    task.property.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterProperty === 'all' || task.property === filterProperty) &&
    (!startDate || new Date(task.completionDate) >= new Date(startDate)) &&
    (!endDate || new Date(task.completionDate) <= new Date(endDate))
  )

  const properties = [...new Set(tasks.map(task => task.property))]

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Completed Tasks</h1>
        
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tasks..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-airbnb-teal focus:border-airbnb-teal"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              className="border border-gray-300 rounded-md focus:ring-airbnb-teal focus:border-airbnb-teal"
              value={filterProperty}
              onChange={(e) => setFilterProperty(e.target.value)}
            >
              <option value="all">All Properties</option>
              {properties.map(property => (
                <option key={property} value={property}>{property}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mb-6 flex items-center space-x-4">
          <Calendar className="h-5 w-5 text-gray-500" />
          <input
            type="date"
            placeholder="Start Date"
            className="border border-gray-300 rounded-md focus:ring-airbnb-teal focus:border-airbnb-teal"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span>to</span>
          <input
            type="date"
            placeholder="End Date"
            className="border border-gray-300 rounded-md focus:ring-airbnb-teal focus:border-airbnb-teal"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {filteredTasks.map(task => (
              <li key={task.id} className="p-4 hover:bg-gray-50">
                <Link href={`/handyman/tasks/${task.id}`} className="block">
                  <div className="flex items-center justify-between space-x-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{task.property}</p>
                      <p className="text-sm text-gray-500 truncate">{task.description}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">{task.completionDate}</span>
                      <span className="text-sm font-medium text-gray-900">{task.timeTaken}</span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}