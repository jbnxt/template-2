'use client'

import { useState, useEffect } from 'react'
import { X, Upload, Image as ImageIcon, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Task, Timeslot } from '@/lib/types'
import { storage } from '@/lib/firebase/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { toast } from 'react-hot-toast'

interface Handyman {
  id: string;
  firstName: string;
  lastName: string;
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
  const [editedTask, setEditedTask] = useState(task)
  const [images, setImages] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>(task.imageUrls || [])
  const [isUploading, setIsUploading] = useState(false)

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages(prevImages => [...prevImages, ...files])

    setIsUploading(true)
    try {
      const uploadPromises = files.map(async (file) => {
        const storageRef = ref(storage, `tasks/${task.id}/${file.name}`)
        await uploadBytes(storageRef, file)
        return getDownloadURL(storageRef)
      })

      const urls = await Promise.all(uploadPromises)
      setImageUrls(prevUrls => [...prevUrls, ...urls])
      setEditedTask(prev => ({ ...prev, imageUrls: [...(prev.imageUrls || []), ...urls] }))
      toast.success('Images uploaded successfully')
    } catch (error) {
      console.error('Error uploading images:', error)
      toast.error('Failed to upload images. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate(editedTask)
  }

  const handleApproveTimeslot = (index: number) => {
    const updatedTimeslots = [...(editedTask.scheduledTimeslots || [])];
    updatedTimeslots[index] = { ...updatedTimeslots[index], approvalStatus: 'approved' };
    setEditedTask(prev => ({ ...prev, scheduledTimeslots: updatedTimeslots }));
  }

  const handleRejectTimeslot = (index: number) => {
    const updatedTimeslots = [...(editedTask.scheduledTimeslots || [])];
    updatedTimeslots[index] = { ...updatedTimeslots[index], approvalStatus: 'rejected' };
    setEditedTask(prev => ({ ...prev, scheduledTimeslots: updatedTimeslots }));
  }

  const handleEditTimeslot = (index: number, updatedTimeslot: Timeslot) => {
    const updatedTimeslots = [...(editedTask.scheduledTimeslots || [])];
    updatedTimeslots[index] = updatedTimeslot;
    setEditedTask(prev => ({ ...prev, scheduledTimeslots: updatedTimeslots }));
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      onDelete();
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Task Details: {editedTask.ticketNumber}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Property ID</Label>
            <Input value={editedTask.propertyId} disabled />
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input value={editedTask.address} disabled />
          </div>
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
                <SelectItem value="Pending Approval">Pending Approval</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
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
            <Label htmlFor="images">Images</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="images"
                name="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                disabled={isUploading}
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => document.getElementById('images')?.click()}
                disabled={isUploading}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Upload Images'}
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {imageUrls.map((url, index) => (
                <img key={index} src={url} alt={`Task image ${index + 1}`} className="w-full h-24 object-cover rounded" />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Scheduled Timeslots</Label>
            {editedTask.scheduledTimeslots && editedTask.scheduledTimeslots.length > 0 ? (
              <div className="flex flex-col space-y-2">
                {editedTask.scheduledTimeslots.map((timeslot, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input 
                      value={`${timeslot.date}: ${timeslot.hours.join(', ')}`} 
                      readOnly 
                    />
                    <span className={`font-semibold ${
                      timeslot.approvalStatus === 'approved' ? 'text-green-600' :
                      timeslot.approvalStatus === 'rejected' ? 'text-red-600' :
                      'text-yellow-600'
                    }`}>
                      {timeslot.approvalStatus}
                    </span>
                    {timeslot.approvalStatus === 'pending' && (
                      <>
                        <Button type="button" onClick={() => handleApproveTimeslot(index)}>
                          Approve
                        </Button>
                        <Button type="button" onClick={() => handleRejectTimeslot(index)}>
                          Reject
                        </Button>
                      </>
                    )}
                    <Button 
                      type="button" 
                      onClick={() => {
                        // Implement edit functionality
                        // You might want to open a modal or inline form for editing
                        console.log('Edit timeslot:', timeslot);
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No scheduled timeslots</p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Update Task</Button>
            <Button type="button" variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}