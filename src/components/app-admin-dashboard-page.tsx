'use client'

import { useState, useMemo } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { MoreVertical, Plus, User } from 'lucide-react'
import { TaskDetailModalComponent } from './app-admin-components-task-detail-modal'
import { CreateTaskModal } from './app-admin-components-create-task-modal'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTasks, Task } from '@/lib/hooks/useTasks'
import { useProperties } from '@/lib/hooks/useProperties'
import { useHandymen, Handyman } from '@/lib/hooks/useHandymen'
import { toast } from 'react-hot-toast'

// Remove the toast import

const columns = ['New', 'In Progress', 'Completed', 'Pushed Back']

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

  const getTasksByStatus = (status) => filteredTasks.filter(task => task.status === status)

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const handleCreateTask = async (newTask: Omit<Task, 'id' | 'ticketNumber'>) => {
    try {
      await addTask(newTask)
      setIsCreateModalOpen(false)
      toast.success('Task created successfully')
    } catch (error) {
      console.error('Failed to create task:', error)
      toast.error('Failed to create task. Please try again.')
    }
  }

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      await updateTask(updatedTask.id, updatedTask);
      setSelectedTask(null);
      toast.success('Task updated successfully')
    } catch (error) {
      console.error('Failed to update task:', error)
      toast.error('Failed to update task. Please try again.')
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId)
        setSelectedTask(null)
        toast.success('Task deleted successfully')
      } catch (error) {
        console.error('Failed to delete task:', error)
        toast.error('Failed to delete task. Please try again.')
      }
    }
  }

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If there's no destination, or the item was dropped back in its original position, do nothing
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    const task = tasks.find(t => t.id === draggableId);
    if (!task) return;

    // Update the task status based on the destination column
    const newStatus = destination.droppableId as Task['status'];
    
    // If the status hasn't changed, do nothing
    if (task.status === newStatus) return;

    try {
      // Update the task in the database
      await updateTask(task.id, { ...task, status: newStatus });
      
      // Optionally, you can update the local state here for immediate UI update
      // This might not be necessary if you're using real-time updates with Firestore
      setTasks(prevTasks => 
        prevTasks.map(t => 
          t.id === task.id ? { ...t, status: newStatus } : t
        )
      );
      toast.success('Task status updated successfully')
    } catch (error) {
      console.error('Failed to update task status:', error);
      toast.error('Failed to update task status. Please try again.')
    }
  };

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
          {columns.map(column => (
            <Droppable key={column} droppableId={column}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-gray-200 p-4 rounded-lg min-w-[280px] w-[280px] flex-shrink-0"
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
                            <h3 className="font-semibold">{task.ticketNumber}</h3>
                            <button
                              className="text-gray-500 hover:text-gray-700"
                              onClick={() => setSelectedTask(task)}
                            >
                              <MoreVertical className="h-5 w-5" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{task.property}</p>
                          <p className="text-sm text-gray-500 mb-2">{task.description}</p>
                          {task.scheduledTimeslots && task.scheduledTimeslots.length > 0 && (
                            <p className="text-xs text-gray-400 mb-2">
                              Scheduled: {task.scheduledTimeslots.map(t => t.date).join(', ')}
                            </p>
                          )}
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