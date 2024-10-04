'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, Play, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { useTasks, Task } from '@/lib/hooks/useTasks'
import { TaskDetailModalComponent } from './app-admin-components-task-detail-modal'
import { useProperties } from '@/lib/hooks/useProperties'
import { useHandymen } from '@/lib/hooks/useHandymen'

const initialTasks = [
  { id: 1, property: 'Seaside Villa', priority: 'high', dueDate: '2023-05-15', status: 'New', description: 'Fix leaking roof in master bedroom' },
  { id: 2, property: 'Mountain Cabin', priority: 'medium', dueDate: '2023-05-20', status: 'In Progress', description: 'Replace faulty electrical outlet in kitchen' },
  { id: 3, property: 'City Apartment', priority: 'low', dueDate: '2023-05-25', status: 'New', description: 'Paint living room walls' },
  { id: 4, property: 'Lakeside Cottage', priority: 'high', dueDate: '2023-05-18', status: 'New', description: 'Repair deck railing' },
  { id: 5, property: 'Beach House', priority: 'medium', dueDate: '2023-05-22', status: 'In Progress', description: 'Clean and maintain air conditioning units' },
]

export function Page() {
  const { tasks, loading: tasksLoading, error: tasksError, updateTask } = useTasks();
  const { properties } = useProperties();
  const { handymen } = useHandymen();
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const filteredTasks = tasks.filter(task => 
    task.property.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterPriority === 'all' || task.priority === filterPriority) &&
    (filterStatus === 'all' || task.status === filterStatus)
  )

  const handleActionButton = async (taskId: string, action: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    let newStatus: string;
    switch (action) {
      case 'start':
        newStatus = 'In Progress';
        break;
      case 'complete':
        newStatus = 'Completed';
        break;
      case 'pushBack':
        newStatus = 'Pushed Back';
        break;
      default:
        return;
    }

    await updateTask(taskId, { status: newStatus });
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
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Task List</h1>
        
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
            <select
              className="border border-gray-300 rounded-md focus:ring-airbnb-teal focus:border-airbnb-teal"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Pushed Back">Pushed Back</option>
            </select>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {filteredTasks.map(task => (
              <li key={task.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex-1 min-w-0">
                    <Link href={`/handyman/tasks/${task.id}`} className="block">
                      <p className="text-sm font-medium text-gray-900 truncate">{task.property}</p>
                      <p className="text-sm text-gray-500 truncate">{task.description}</p>
                    </Link>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)} text-white`}>
                      {task.priority}
                    </span>
                    <span className="text-sm text-gray-500">{task.dueDate}</span>
                    <span className="text-sm font-medium text-gray-900">{task.status}</span>
                    {task.status === 'New' && (
                      <button onClick={() => handleActionButton(task.id, 'start')} className="text-airbnb-teal hover:text-airbnb-teal-dark">
                        <Play className="h-5 w-5" />
                      </button>
                    )}
                    {task.status === 'In Progress' && (
                      <button onClick={() => handleActionButton(task.id, 'complete')} className="text-green-500 hover:text-green-600">
                        <CheckCircle className="h-5 w-5" />
                      </button>
                    )}
                    <button onClick={() => handleActionButton(task.id, 'pushBack')} className="text-gray-400 hover:text-gray-600">
                      <Clock className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}