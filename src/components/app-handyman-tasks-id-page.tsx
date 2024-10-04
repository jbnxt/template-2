'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Play, CheckCircle, Clock, ArrowLeft, Camera } from 'lucide-react'

const mockTask = {
  id: 1,
  property: 'Seaside Villa',
  description: 'Fix leaking roof in master bedroom',
  priority: 'high',
  status: 'In Progress',
  dueDate: '2023-05-15',
  images: ['/placeholder.svg?height=200&width=300', '/placeholder.svg?height=200&width=300'],
  comments: [
    { id: 1, author: 'John Doe', text: 'Please check for any damaged shingles.', timestamp: '2023-05-10T10:30:00Z' },
    { id: 2, author: 'Jane Smith', text: 'Water damage visible on the ceiling.', timestamp: '2023-05-11T14:45:00Z' },
  ]
}

export function Page({ params }) {
  const router = useRouter()
  const [task, setTask] = useState(mockTask)
  const [newComment, setNewComment] = useState('')
  const [estimatedTime, setEstimatedTime] = useState('')

  const handleActionButton = (action) => {
    setTask(prevTask => ({
      ...prevTask,
      status: action === 'start' ? 'In Progress' : action === 'complete' ? 'Completed' : 'Pushed Back'
    }))
  }

  const handleCommentSubmit = (e) => {
    e.preventDefault()
    if (newComment.trim()) {
      setTask(prevTask => ({
        ...prevTask,
        comments: [
          ...prevTask.comments,
          { id: Date.now(), author: 'Handyman', text: newComment, timestamp: new Date().toISOString() }
        ]
      }))
      setNewComment('')
    }
  }

  const handleEstimatedTimeSubmit = (e) => {
    e.preventDefault()
    console.log('Estimated completion time:', estimatedTime)
    // Here you would typically send this data to your backend
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => router.back()} className="mb-4 flex items-center text-airbnb-teal hover:text-airbnb-teal-dark">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Task List
        </button>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{task.property}</h1>
            <p className="text-gray-600 mb-4">{task.description}</p>
            
            <div className="flex items-center space-x-4 mb-6">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)} text-white`}>
                {task.priority}
              </span>
              <span className="text-sm text-gray-500">Due: {task.dueDate}</span>
              <span className="text-sm font-medium text-gray-900">{task.status}</span>
            </div>
            
            <div className="flex space-x-4 mb-6">
              {task.status === 'New' && (
                <button onClick={() => handleActionButton('start')} className="px-4 py-2 bg-airbnb-teal text-white rounded-md hover:bg-airbnb-teal-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-airbnb-teal flex items-center">
                  <Play className="mr-2 h-5 w-5" />
                  Start Task
                </button>
              )}
              {task.status === 'In Progress' && (
                <button onClick={() => handleActionButton('complete')} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Complete Task
                </button>
              )}
              <button onClick={() => handleActionButton('pushBack')} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Push Back
              </button>
            </div>
            
            <h2 className="text-xl font-semibold mb-4">Photos</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {task.images.map((image, index) => (
                <img key={index} src={image} alt={`Task image ${index + 1}`} className="rounded-lg shadow-md" />
              ))}
            </div>
            
            <h2 className="text-xl font-semibold mb-4">Comments</h2>
            <ul className="space-y-4 mb-6">
              {task.comments.map(comment => (
                <li key={comment.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <span className="font-medium">{comment.author}</span>
                    <span className="text-sm text-gray-500">{new Date(comment.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="mt-1">{comment.text}</p>
                </li>
              ))}
            </ul>
            
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-airbnb-teal"
                rows="3"
              ></textarea>
              <button type="submit" className="mt-2 px-4 py-2 bg-airbnb-teal text-white rounded-md hover:bg-airbnb-teal-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-airbnb-teal">
                Post Comment
              </button>
            </form>
            
            <h2 className="text-xl font-semibold mb-4">Estimated Completion Time</h2>
            <form onSubmit={handleEstimatedTimeSubmit} className="flex items-center space-x-4">
              <input
                type="text"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                placeholder="e.g., 2 hours"
                className="flex-grow px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-airbnb-teal"
              />
              <button type="submit" className="px-4 py-2 bg-airbnb-teal text-white rounded-md hover:bg-airbnb-teal-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-airbnb-teal">
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}