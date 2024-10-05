'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useTasks, Task } from '@/lib/hooks/useTasks'

interface MaintenanceWindowProps {
  date: Date
  propertyId: string
  userId: string
  onClose: () => void
  availableTasks: Task[]
  onTasksAssigned: () => void
}

export function MaintenanceWindow({ date, propertyId, userId, onClose, availableTasks, onTasksAssigned }: MaintenanceWindowProps) {
  console.log('MaintenanceWindow rendered', { date, propertyId, userId, availableTasks });
  
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const { updateTask } = useTasks()

  const handleTaskToggle = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    )
  }

  const handleAssignTasks = async () => {
    for (const taskId of selectedTasks) {
      await updateTask(taskId, { 
        dateAssigned: format(date, 'yyyy-MM-dd'),
        status: 'Assigned',
        handymanId: userId
      })
    }
    onTasksAssigned()
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Maintenance Window: {format(date, 'MMMM d, yyyy')}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Available Tasks:</h3>
          {availableTasks.length > 0 ? (
            availableTasks.map(task => (
              <div key={task.id} className="flex items-center space-x-2 mb-2">
                <Checkbox
                  id={task.id}
                  checked={selectedTasks.includes(task.id)}
                  onCheckedChange={(checked) => {
                    if (checked) handleTaskToggle(task.id);
                  }}
                />
                <label htmlFor={task.id} className="text-sm">{task.description}</label>
              </div>
            ))
          ) : (
            <p>No available tasks for this maintenance window.</p>
          )}
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button onClick={onClose} variant="outline">Cancel</Button>
          <Button onClick={handleAssignTasks} disabled={selectedTasks.length === 0}>Assign Tasks</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}