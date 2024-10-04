'use client'

import { useState } from 'react'
import { Search, Plus, Edit2, Archive } from 'lucide-react'

const initialProperties = [
  { id: 1, name: 'Seaside Villa', address: '123 Ocean Drive, Beach City, BC 12345', activeTasks: 3, archived: false },
  { id: 2, name: 'Mountain Cabin', address: '456 Pine Road, Mountain Town, MT 67890', activeTasks: 1, archived: false },
  { id: 3, name: 'City Apartment', address: '789 Main Street, Metropolis, MP 13579', activeTasks: 2, archived: false },
  { id: 4, name: 'Lakeside Cottage', address: '321 Lake Lane, Waterfront, WF 24680', activeTasks: 0, archived: true },
]

export function Page() {
  const [properties, setProperties] = useState(initialProperties)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', address: '' })

  const filteredProperties = properties.filter(property =>
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEdit = (property) => {
    setEditingId(property.id)
    setEditForm({ name: property.name, address: property.address })
  }

  const handleSave = (id) => {
    setProperties(properties.map(property =>
      property.id === id ? { ...property, ...editForm } : property
    ))
    setEditingId(null)
  }

  const handleArchive = (id) => {
    setProperties(properties.map(property =>
      property.id === id ? { ...property, archived: !property.archived } : property
    ))
  }

  const addNewProperty = () => {
    // This would typically open a modal or navigate to a new page
    console.log('Add new property')
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Property Management</h1>
          <button
            onClick={addNewProperty}
            className="px-4 py-2 bg-airbnb-teal text-white rounded-md hover:bg-airbnb-teal-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-airbnb-teal flex items-center"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Property
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search properties..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-airbnb-teal focus:border-airbnb-teal"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Tasks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProperties.map(property => (
                <tr key={property.id} className={property.archived ? 'bg-gray-100' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === property.id ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full border-gray-300 rounded-md focus:ring-airbnb-teal focus:border-airbnb-teal"
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-900">{property.name}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === property.id ? (
                      <input
                        type="text"
                        value={editForm.address}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                        className="w-full border-gray-300 rounded-md focus:ring-airbnb-teal focus:border-airbnb-teal"
                      />
                    ) : (
                      <div className="text-sm text-gray-500">{property.address}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{property.activeTasks}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      property.archived ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {property.archived ? 'Archived' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingId === property.id ? (
                      <button onClick={() => handleSave(property.id)} className="text-airbnb-teal hover:text-airbnb-teal-dark mr-3">
                        Save
                      </button>
                    ) : (
                      <button onClick={() => handleEdit(property)} className="text-airbnb-teal hover:text-airbnb-teal-dark mr-3">
                        <Edit2 className="h-5 w-5" />
                      </button>
                    )}
                    <button onClick={() => handleArchive(property.id)} className="text-gray-600 hover:text-gray-900">
                      <Archive className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}