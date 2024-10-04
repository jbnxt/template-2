'use client'

import { useState } from 'react'
import { User, Camera } from 'lucide-react'

export function Page() {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(123) 456-7890',
    address: '123 Main St, Anytown, USA',
    skills: ['Plumbing', 'Electrical', 'Carpentry'],
    availability: true,
    profilePicture: null
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleSkillChange = (e) => {
    const { value, checked } = e.target
    setProfile(prev => ({
      ...prev,
      skills: checked
        ? [...prev.skills, value]
        : prev.skills.filter(skill => skill !== value)
    }))
  }

  const handleAvailabilityChange = () => {
    setProfile(prev => ({ ...prev, availability: !prev.availability }))
  }

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, profilePicture: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Updated profile:', profile)
    // Here you would typically send the updated profile to your backend
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Management</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <div className="flex items-center justify-center">
                {profile.profilePicture ? (
                  <img src={profile.profilePicture} alt="Profile" className="h-32 w-32 rounded-full object-cover" />
                ) : (
                  <User className="h-32 w-32 text-gray-400 bg-gray-200 rounded-full p-4" />
                )}
              </div>
              <div className="mt-4 flex justify-center">
                <label htmlFor="profile-picture" className="cursor-pointer bg-airbnb-teal text-white px-4 py-2 rounded-md hover:bg-airbnb-teal-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-airbnb-teal flex items-center">
                  <Camera className="mr-2 h-5 w-5" />
                  Upload Photo
                  <input
                    id="profile-picture"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePictureChange}
                  />
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-airbnb-teal focus:border-airbnb-teal sm:text-sm"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-airbnb-teal focus:border-airbnb-teal sm:text-sm"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profile.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-airbnb-teal focus:border-airbnb-teal sm:text-sm"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={profile.address}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-airbnb-teal focus:border-airbnb-teal sm:text-sm"
              />
            </div>

            <div className="mb-4">
              <span className="block text-sm font-medium text-gray-700 mb-2">Skills</span>
              <div className="space-y-2">
                {['Plumbing', 'Electrical', 'Carpentry', 'Painting', 'HVAC'].map(skill => (
                  <label key={skill} className="inline-flex items-center mr-4">
                    <input
                      type="checkbox"
                      value={skill}
                      checked={profile.skills.includes(skill)}
                      onChange={handleSkillChange}
                      className="form-checkbox h-4 w-4 text-airbnb-teal focus:ring-airbnb-teal border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{skill}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={profile.availability}
                  onChange={handleAvailabilityChange}
                  className="form-checkbox h-4 w-4 text-airbnb-teal focus:ring-airbnb-teal border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Available for work</span>
              </label>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-airbnb-teal text-white px-4 py-2 rounded-md hover:bg-airbnb-teal-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-airbnb-teal"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}