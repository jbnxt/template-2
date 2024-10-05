'use client'

import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { TaskDetailModalComponent } from './app-admin-components-task-detail-modal'
import { CreateTaskModal } from './app-admin-components-create-task-modal'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTasks, Task } from '@/lib/hooks/useTasks'
import { useProperties } from '@/lib/hooks/useProperties'
import { useHandymen } from '@/lib/hooks/useHandymen'
import { toast } from 'react-hot-toast'
import { KanbanBoard } from '@/components/KanbanBoard'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const columns = ['New', 'Pending Approval', 'Approved', 'Done']

export function Page() {
  const { tasks, loading, error, updateTask, addTask, deleteTask } = useTasks(); // Add deleteTask here
  const { properties } = useProperties();
  const { handymen } = useHandymen();

  const [searchTerm, setSearchTerm] = useState('')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterHandyman, setFilterHandyman] = useState('all')
  const [filterProperty, setFilterProperty] = useState('all')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const uniqueHandymen = useMemo(() => {
    return ['all', ...Array.from(new Set(handymen.map(h => `${h.firstName} ${h.lastName}`)))]
  }, [handymen])

  const uniqueProperties = useMemo(() => {
    return ['all', ...Array.from(new Set(properties.map(p => p.name)))]
  }, [properties])

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => 
      task.property.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterPriority === 'all' || task.priority === filterPriority) &&
      (filterHandyman === 'all' || task.handymanId === filterHandyman) &&
      (filterProperty === 'all' || task.property === filterProperty)
    )
  }, [tasks, searchTerm, filterPriority, filterHandyman, filterProperty])

  const handleCreateTask = async (newTask: Omit<Task, 'id' | 'ticketNumber'>) => {
    try {
      const taskId = await addTask(newTask);
      setIsCreateModalOpen(false);
      toast.success('Task created successfully');
      // Optionally, you can update the local state to include the new task
      // setTasks(prevTasks => [...prevTasks, { ...newTask, id: taskId, ticketNumber: `TASK-${taskId}` }]);
    } catch (error) {
      console.error('Failed to create task:', error);
      toast.error('Failed to create task. Please try again.');
    }
  }

  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    try {
      await updateTask(taskId, updates);
      const updatedTasks = tasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      );
      toast.success('Task updated successfully')
    } catch (error) {
      console.error('Failed to update task:', error)
      toast.error('Failed to update task. Please try again.')
    }
  }

  const handleApproveTimeslot = async (taskId: string, timeslotIndex: number) => {
    if (!selectedTask) return;
    const updatedTimeslots = [...(selectedTask.scheduledTimeslots || [])];
    if (updatedTimeslots[timeslotIndex]) {
      updatedTimeslots[timeslotIndex] = {
        ...updatedTimeslots[timeslotIndex],
        approvalStatus: 'approved'
      };
      try {
        await updateTask(taskId, { scheduledTimeslots: updatedTimeslots });
        setSelectedTask({ ...selectedTask, scheduledTimeslots: updatedTimeslots });
        toast.success('Timeslot approved successfully');
      } catch (error) {
        console.error('Failed to approve timeslot:', error);
        toast.error('Failed to approve timeslot. Please try again.');
      }
    }
  }

  const handleRejectTimeslot = async (taskId: string, timeslotIndex: number) => {
    if (!selectedTask) return;
    const updatedTimeslots = [...(selectedTask.scheduledTimeslots || [])];
    if (updatedTimeslots[timeslotIndex]) {
      updatedTimeslots[timeslotIndex] = {
        ...updatedTimeslots[timeslotIndex],
        approvalStatus: 'rejected'
      };
      try {
        await updateTask(taskId, { scheduledTimeslots: updatedTimeslots });
        setSelectedTask({ ...selectedTask, scheduledTimeslots: updatedTimeslots });
        toast.success('Timeslot rejected successfully');
      } catch (error) {
        console.error('Failed to reject timeslot:', error);
        toast.error('Failed to reject timeslot. Please try again.');
      }
    }
  }

  const handleRejectApprovedTimeslot = async (taskId: string, timeslotIndex: number) => {
    if (!selectedTask) return;
    const updatedTimeslots = [...(selectedTask.scheduledTimeslots || [])];
    if (updatedTimeslots[timeslotIndex]) {
      updatedTimeslots[timeslotIndex] = {
        ...updatedTimeslots[timeslotIndex],
        approvalStatus: 'rejected'
      };
      try {
        await updateTask(taskId, { scheduledTimeslots: updatedTimeslots });
        setSelectedTask({ ...selectedTask, scheduledTimeslots: updatedTimeslots });
        toast.success('Approved timeslot has been rejected');
      } catch (error) {
        console.error('Failed to reject approved timeslot:', error);
        toast.error('Failed to reject approved timeslot. Please try again.');
      }
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setSelectedTask(null);
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('Failed to delete task. Please try again.');
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="mb-6 flex justify-between items-center">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterHandyman} onValueChange={setFilterHandyman}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by handyman" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Handymen</SelectItem>
              {uniqueHandymen.map((handyman) => (
                <SelectItem key={handyman} value={handyman}>{handyman}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterProperty} onValueChange={setFilterProperty}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by property" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              {uniqueProperties.map((property) => (
                <SelectItem key={property} value={property}>{property}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Task
        </Button>
      </div>
      <KanbanBoard tasks={filteredTasks} onTaskUpdate={handleTaskUpdate} />
      <h2 className="text-xl font-semibold mt-8 mb-4">All Tasks</h2>
      <ul className="space-y-4">
        {filteredTasks.map(task => (
          <li key={task.id} className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold">{task.ticketNumber}: {task.property}</h2>
            <p>{task.description}</p>
            <Button onClick={() => setSelectedTask(task)} className="mt-2">
              View Task Details
            </Button>
          </li>
        ))}
      </ul>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModalComponent
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={(updatedTask) => {
            handleTaskUpdate(updatedTask.id, updatedTask);
            setSelectedTask(null);
          }}
          onDelete={() => handleDeleteTask(selectedTask.id)}
          properties={properties.map(p => p.name)}
          handymen={handymen}
        />
      )}
      {isCreateModalOpen && (
        <CreateTaskModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateTask}
          handymen={handymen}
        />
      )}
    </div>
  )
}

