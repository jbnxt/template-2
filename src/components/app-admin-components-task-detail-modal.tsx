'use client'

import { useState, useEffect } from 'react'
import { X, Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Task {
  id: string
  property: string
  priority: string
  description: string
  status: string
  handymanId: string | null // Changed from handyman to handymanId
  dueDate: string
  pdfFile?: File | null
}

interface TaskDetailModalProps {
  task: Task
  onClose: () => void
  onUpdate: (updatedTask: Task) => void
  onDelete: () => void
  properties?: string[]
  handymen?: Handyman[]
}

export function TaskDetailModalComponent({ 
  task, 
  onClose, 
  onUpdate, 
  onDelete, 
  properties = [], 
  handymen = [] 
}: TaskDetailModalProps) {
  const [editedTask, setEditedTask] = useState<Task>(task)
  const [pdfFileName, setPdfFileName] = useState<string | null>(null)

  useEffect(() => {
    if (task.pdfFile) {
      setPdfFileName(task.pdfFile.name)
    }
  }, [task.pdfFile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedTask(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setEditedTask(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setEditedTask(prev => ({ ...prev, pdfFile: file }))
      setPdfFileName(file.name)
    } else {
      alert('Please select a PDF file.')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate(editedTask)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="property">Property</Label>
            <Select name="property" value={editedTask.property} onValueChange={(value) => handleSelectChange('property', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select property" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => (
                  <SelectItem key={property} value={property}>{property}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select name="priority" value={editedTask.priority} onValueChange={(value) => handleSelectChange('priority', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={editedTask.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select name="status" value={editedTask.status} onValueChange={(value) => handleSelectChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Assigned">Assigned</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Pushed Back">Pushed Back</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="handyman">Handyman</Label>
            <Select 
              name="handyman" 
              value={editedTask.handymanId || 'unassigned'} 
              onValueChange={(value) => handleSelectChange('handymanId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select handyman" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {handymen.map((handyman) => (
                  <SelectItem key={handyman.id} value={handyman.id}>
                    {`${handyman.firstName} ${handyman.lastName}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              name="dueDate"
              type="date"
              value={editedTask.dueDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pdfFile">PDF File</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="pdfFile"
                name="pdfFile"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button type="button" variant="outline" onClick={() => document.getElementById('pdfFile')?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Upload PDF
              </Button>
              {pdfFileName && <span className="text-sm text-gray-500">{pdfFileName}</span>}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Update Task</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}