'use client'

import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Search, Filter, MoreVertical } from 'lucide-react'
import TaskDetailModal from '../components/TaskDetailModal'

// Define initialTasks
const initialTasks = [
  { id: 'task1', property: 'Seaside Villa', priority: 'high', description: 'Fix leaking roof', status: 'New', handyman: null, dueDate: '2023-05-15' },
  { id: 'task2', property: 'Mountain Cabin', priority: 'medium', description: 'Replace faulty electrical outlet', status: 'Assigned', handyman: 'John Doe', dueDate: '2023-05-20' },
  { id: 'task3', property: 'City Apartment', priority: 'low', description: 'Paint living room', status: 'In Progress', handyman: 'Jane Smith', dueDate: '2023-05-25' },
  { id: 'task4', property: 'Lakeside Cottage', priority: 'high', description: 'Repair deck', status: 'Completed', handyman: 'Bob Johnson', dueDate: '2023-05-10' },
  { id: 'task5', property: 'Beach House', priority: 'medium', description: 'Clean gutters', status: 'Pushed Back', handyman: 'Alice Brown', dueDate: '2023-06-01' },
]

const columns = ['New', 'Assigned', 'In Progress', 'Completed', 'Pushed Back']

export function Page() {
  const [tasks, setTasks] = useState(initialTasks)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPriority, setFilterPriority] = useState('all')
  const [selectedTask, setSelectedTask] = useState(null)

  const onDragEnd = (result) => {
    if (!result.destination) return
    const { source, destination } = result
    const newTasks = Array.from(tasks)
    const [reorderedItem] = newTasks.splice(source.index, 1)
    reorderedItem.status = destination.droppableId
    newTasks.splice(destination.index, 0, reorderedItem)
    setTasks(newTasks)
  }

  const filteredTasks = tasks.filter(task => 
    task.property.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterPriority === 'all' || task.priority === filterPriority)
  )

  const getTasksByStatus = (status) => filteredTasks.filter(task => task.status === status)

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const handleTaskUpdate = (updatedTask) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task))
    setSelectedTask(null)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Task Management</h1>
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
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex overflow-x-auto space-x-4 pb-8">
          {columns.map(column => (
            <Droppable key={column} droppableId={column}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-gray-200 p-4 rounded-lg min-w-[300px]"
                >
                  <h2 className="font-semibold text-lg mb-4">{column}</h2>
                  {getTasksByStatus(column).map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-4 rounded-md shadow mb-4"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{task.property}</h3>
                            <button
                              className="text-gray-500 hover:text-gray-700"
                              onClick={() => setSelectedTask(task)}
                            >
                              <MoreVertical className="h-5 w-5" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                          <div className="flex justify-between items-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)} text-white`}>
                              {task.priority}
                            </span>
                            {task.handyman && (
                              <span className="text-xs text-gray-500">{task.handyman}</span>
                            )}
                          </div>
                          {task.dueDate && (
                            <div className="text-xs text-gray-500 mt-2">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleTaskUpdate}
        />
      )}
    </div>
  )
}