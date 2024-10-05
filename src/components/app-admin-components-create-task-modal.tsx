'use client'

import { useState } from 'react'
import { X, Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useProperties, Property } from '@/lib/hooks/useProperties'
import { toast } from 'react-hot-toast'

// Remove the toast import

interface Handyman {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface CreateTaskModalProps {
  onClose: () => void
  onCreate: (task: any) => void
  handymen: Handyman[]
}

export function CreateTaskModal({ onClose, onCreate, handymen }: CreateTaskModalProps) {
  const { properties, getPropertyDetails } = useProperties()
  const [newTask, setNewTask] = useState({
    property: '',
    propertyId: '',
    address: '',
    description: '',
    priority: '',
    status: 'New',
    handymanId: '',
    pdfFile: null as File | null
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewTask(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewTask(prev => ({ ...prev, [name]: value }))
    if (name === 'property') {
      fetchPropertyDetails(value)
    }
  }

  const fetchPropertyDetails = async (propertyId: string) => {
    const propertyDetails = await getPropertyDetails(propertyId)
    if (propertyDetails) {
      setNewTask(prev => ({
        ...prev,
        propertyId: propertyDetails.id,
        address: propertyDetails.address
      }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setNewTask(prev => ({ ...prev, pdfFile: file }))
    } else {
      alert('Please select a PDF file.')
      e.target.value = '' // Reset the file input
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const taskToCreate = {
      ...newTask,
      property: properties.find(p => p.id === newTask.propertyId)?.name || '',
    }
    try {
      await onCreate(taskToCreate)
      onClose()
      toast.success('Task created successfully')
    } catch (error) {
      console.error('Failed to create task:', error)
      toast.error('Failed to create task. Please try again.')
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="property">Property</Label>
            <Select name="property" value={newTask.propertyId} onValueChange={(value) => handleSelectChange('property', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select property" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>{property.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" value={newTask.address} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={newTask.description} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select name="priority" value={newTask.priority} onValueChange={(value) => handleSelectChange('priority', value)}>
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
            <Label htmlFor="handymanId">Assign to</Label>
            <Select name="handymanId" value={newTask.handymanId} onValueChange={(value) => handleSelectChange('handymanId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select handyman" />
              </SelectTrigger>
              <SelectContent>
                {handymen.map((handyman) => (
                  <SelectItem key={handyman.id} value={handyman.id}>
                    {`${handyman.firstName} ${handyman.lastName}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              {newTask.pdfFile && <span className="text-sm text-gray-500">{newTask.pdfFile.name}</span>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Create Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}