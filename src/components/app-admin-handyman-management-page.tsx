'use client'

import { useState } from 'react'
import { Search, Plus, User } from 'lucide-react'

const initialHandymen = [
  { id: 1, name: 'John Doe', photo: '/placeholder.svg?height=100&width=100', contact: 'john@example.com', phone: '(123) 456-7890', workload: 3 },
  { id: 2, name: 'Jane Smith', photo: '/placeholder.svg?height=100&width=100', contact: 'jane@example.com', phone: '(234) 567-8901', workload: 5 },
  { id: 3, name: 'Bob Johnson', photo: '/placeholder.svg?height=100&width=100', contact: 'bob@example.com', phone: '(345) 678-9012', workload: 2 },
  { id: 4, name: 'Alice Brown', photo: '/placeholder.svg?height=100&width=100', contact: 'alice@example.com', phone: '(456) 789-0123', workload: 4 },
]

export function Page() {
  const [handymen, setHandymen] = useState(initialHandymen)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')

  const filteredHandymen = handymen
    .filter(handyman => handyman.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'workload') return b.workload - a.workload
      return 0
    })

  const addNewHandyman = () => {
    // This would typically open a modal or navigate to a new page
    console.log('Add new handyman')
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Handyman Management</h1>
          <button
            onClick={addNewHandyman}
            className="px-4 py-2 bg-airbnb-teal text-white rounded-md hover:bg-airbnb-teal-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-airbnb-teal flex items-center"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add New Handyman
          </button>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search handymen..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-airbnb-teal focus:border-airbnb-teal"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="flex items-center space-x-4">
            <label htmlFor="sortBy" className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              id="sortBy"
              className="border border-gray-300 rounded-md focus:ring-airbnb-teal focus:border-airbnb-teal"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Name</option>
              <option value="workload">Workload</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredHandymen.map(handyman => (
            <div key={handyman.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-center mb-4">
                  {handyman.photo ? (
                    <img src={handyman.photo} alt={handyman.name} className="h-24 w-24 rounded-full object-cover" />
                  ) : (
                    <User className="h-24 w-24 text-gray-400 bg-gray-200 rounded-full p-4" />
                  )}
                </div>
                <h2 className="text-xl font-semibold text-center mb-2">{handyman.name}</h2>
                <div className="text-sm text-gray-600 space-y-2">
                  <p className="flex items-center justify-center">
                    <span className="font-medium mr-2">Email:</span> {handyman.contact}
                  </p>
                  <p className="flex items-center justify-center">
                    <span className="font-medium mr-2">Phone:</span> {handyman.phone}
                  </p>
                  <p className="flex items-center justify-center">
                    <span className="font-medium mr-2">Current Workload:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      handyman.workload <= 2 ? 'bg-green-500' :
                      handyman.workload <= 4 ? 'bg-yellow-500' : 'bg-red-500'
                    } text-white`}>
                      {handyman.workload} tasks
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}