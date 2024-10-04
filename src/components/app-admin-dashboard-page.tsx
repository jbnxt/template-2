'use client'

import { useState, useMemo } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { MoreVertical, Plus, User } from 'lucide-react'
import { TaskDetailModalComponent } from './app-admin-components-task-detail-modal'
import { CreateTaskModal } from './app-admin-components-create-task-modal'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTasks, Task } from '@/lib/hooks/useTasks'
import { useProperties } from '@/lib/hooks/useProperties'
import { useHandymen, Handyman } from '@/lib/hooks/useHandymen'

// Define all possible statuses
const allStatuses = ['New', 'In Progress', 'Completed', 'On Hold', 'Cancelled', 'Pending Review']

export function Page() {
  const { tasks, loading: tasksLoading, error: tasksError, addTask, updateTask, deleteTask } = useTasks();
  const { properties, loading: propertiesLoading, error: propertiesError } = useProperties();
  const { handymen, loading: handymenLoading, error: handymenError } = useHandymen();

  const [searchTerm, setSearchTerm] = useState('')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterHandyman, setFilterHandyman] = useState('all')
  const [filterProperty, setFilterProperty] = useState('all')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const uniqueHandymen = useMemo(() => {
    return ['all', ...new Set(handymen.map(h => `${h.firstName} ${h.lastName}`))]
  }, [handymen])

  const uniqueProperties = useMemo(() => {
    return ['all', ...new Set(properties.map(p => p.name))]
  }, [properties])

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => 
      task.property.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterPriority === 'all' || task.priority === filterPriority) &&
      (filterHandyman === 'all' || task.handymanId === filterHandyman) &&
      (filterProperty === 'all' || task.property === filterProperty)
    )
  }, [tasks, searchTerm, filterPriority, filterHandyman, filterProperty])

  const tasksByStatus = useMemo(() => {
    const statusMap: { [key: string]: Task[] } = {}
    allStatuses.forEach(status => {
      statusMap[status] = filteredTasks.filter(task => task.status === status)
    })
    return statusMap
  }, [filteredTasks])

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const handleCreateTask = async (newTask) => {
    await addTask(newTask)
    setIsCreateModalOpen(false)
  }

  const handleUpdateTask = async (updatedTask) => {
    await updateTask(updatedTask.id, updatedTask)
    setSelectedTask(null)
  }

  const handleDeleteTask = async (taskId) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId)
      setSelectedTask(null)
    }
  }

  const onDragEnd = (result) => {
    // Implement drag and drop logic here
  }

  if (tasksLoading || propertiesLoading || handymenLoading) {
    return <div>Loading...</div>
  }

  if (tasksError || propertiesError || handymenError) {
    return <div>Error: {tasksError || propertiesError || handymenError}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-[140px] sm:w-[180px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterHandyman} onValueChange={setFilterHandyman}>
            <SelectTrigger className="w-[140px] sm:w-[180px]">
              <SelectValue placeholder="Handyman" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Handymen</SelectItem>
              {handymen.map((handyman) => (
                <SelectItem key={handyman.id} value={handyman.id}>
                  {`${handyman.firstName} ${handyman.lastName}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterProperty} onValueChange={setFilterProperty}>
            <SelectTrigger className="w-[140px] sm:w-[180px]">
              <SelectValue placeholder="Property" />
            </SelectTrigger>
            <SelectContent>
              {uniqueProperties.map(property => (
                <SelectItem key={property} value={property}>
                  {property === 'all' ? 'All Properties' : property}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Task
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex overflow-x-auto space-x-4 pb-8" style={{ minHeight: '70vh' }}>
          {allStatuses.map(status => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-gray-200 p-4 rounded-lg min-w-[280px] w-[280px] flex-shrink-0"
                >
                  <h2 className="font-semibold text-lg mb-4">{status}</h2>
                  {tasksByStatus[status].map((task, index) => (
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
                            {task.handymanId && (
                              <span className="text-xs text-gray-500 flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                {handymen.find(h => h.id === task.handymanId)?.firstName} {handymen.find(h => h.id === task.handymanId)?.lastName}
                              </span>
                            )}
                          </div>
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
        <TaskDetailModalComponent
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
          properties={uniqueProperties.filter(p => p !== 'all')}
          handymen={handymen}
        />
      )}

      {isCreateModalOpen && (
        <CreateTaskModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateTask}
          properties={properties.map(p => p.name)}
          handymen={handymen}
        />
      )}
    </div>
  )
}