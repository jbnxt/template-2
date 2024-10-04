'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Upload } from 'lucide-react'

export function Page() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    property: '',
    description: '',
    priority: '',
    photos: []
  })
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files)
    setFormData(prev => ({ ...prev, photos: [...prev.photos, ...files] }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Validate form
    const newErrors = {}
    if (!formData.property) newErrors.property = 'Property is required'
    if (!formData.description) newErrors.description = 'Description is required'
    if (!formData.priority) newErrors.priority = 'Priority is required'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Submit form data
    console.log('Form submitted:', formData)
    // TODO: Implement API call to submit form data
    router.push('/inspector/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Report a Problem</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="property" className="block text-sm font-medium text-gray-700">
                Property
              </label>
              <select
                id="property"
                name="property"
                value={formData.property}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-airbnb-teal focus:border-airbnb-teal sm:text-sm rounded-md"
              >
                <option value="">Select a property</option>
                <option value="property1">Property 1</option>
                <option value="property2">Property 2</option>
                <option value="property3">Property 3</option>
              </select>
              {errors.property && <p className="mt-2 text-sm text-red-600">{errors.property}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Problem Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-airbnb-teal focus:border-airbnb-teal sm:text-sm"
                placeholder="Describe the problem in detail..."
              />
              {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <div className="mt-2 space-y-2">
                {['1', '2', '3'].map((priority) => (
                  <div key={priority} className="flex items-center">
                    <input
                      id={`priority-${priority}`}
                      name="priority"
                      type="radio"
                      value={priority}
                      checked={formData.priority === priority}
                      onChange={handleInputChange}
                      className="focus:ring-airbnb-teal h-4 w-4 text-airbnb-teal border-gray-300"
                    />
                    <label htmlFor={`priority-${priority}`} className="ml-3 block text-sm font-medium text-gray-700">
                      Priority {priority}
                    </label>
                  </div>
                ))}
              </div>
              {errors.priority && <p className="mt-2 text-sm text-red-600">{errors.priority}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Photos</label>
              <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Camera className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-airbnb-teal hover:text-airbnb-coral focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-airbnb-teal">
                      <span>Upload files</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handlePhotoUpload} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
              {formData.photos.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img src={URL.createObjectURL(photo)} alt={`Uploaded photo ${index + 1}`} className="h-24 w-24 object-cover rounded-md" />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }))}
                        className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-airbnb-coral hover:bg-airbnb-coral-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-airbnb-coral"
              >
                Submit Report
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}