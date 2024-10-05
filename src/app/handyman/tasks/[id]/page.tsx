'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useTasks, Task } from '@/lib/hooks/useTasks'
import { Button } from "@/components/ui/button"

export default function TaskDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const { tasks, updateTask } = useTasks()
  const [task, setTask] = useState<Task | null>(null)

  useEffect(() => {
    if (id && tasks.length > 0) {
      const foundTask = tasks.find(t => t.id === id)
      if (foundTask) {
        setTask(foundTask)
      }
    }
  }, [id, tasks])

  const handleStatusChange = async (newStatus: 'In Progress' | 'Done' | 'Pending') => {
    if (task) {
      await updateTask(task.id, { ...task, status: newStatus })
      setTask({ ...task, status: newStatus })
    }
  }

  if (!task) {
    return <div>Loading task...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{task.property}</h1>
      <p className="mb-4">{task.description}</p>
      <div className="mb-4">
        <span className="font-bold">Priority:</span> {task.priority}
      </div>
      <div className="mb-4">
        <span className="font-bold">Status:</span> {task.status}
      </div>
      <div className="mb-4">
        <span className="font-bold">Due Date:</span> {task.dueDate}
      </div>
      <div className="flex space-x-4">
        <Button onClick={() => handleStatusChange('In Progress')} disabled={task.status === 'In Progress'}>
          In Progress
        </Button>
        <Button onClick={() => handleStatusChange('Done')} disabled={task.status === 'Done'}>
          Done
        </Button>
        <Button onClick={() => handleStatusChange('Pending')} disabled={task.status === 'Pending'}>
          Pending
        </Button>
      </div>
    </div>
  )
}