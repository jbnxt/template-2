'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, MoreVertical } from 'lucide-react'
import { useTasks, Task } from '@/lib/hooks/useTasks'
import { useAuth } from '@/lib/hooks/useAuth'
import { usePropertyAvailability } from '@/lib/hooks/usePropertyAvailability'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from 'react-hot-toast'
import Image from 'next/image'

interface Timeslot {
  date: string;
  hours: string[];
  approvalStatus: 'pending' | 'approved' | 'rejected';
}

export function Page() {
  const { user } = useAuth();
  const { tasks, loading: tasksLoading, error: tasksError, updateTask } = useTasks();
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedHours, setSelectedHours] = useState<string[]>([]);
  const [isEntireDaySelected, setIsEntireDaySelected] = useState(false);
  const [isSearchingAvailability, setIsSearchingAvailability] = useState(false);
  const { availableDates, loading: availabilityLoading, error: availabilityError, fetchAvailability } = usePropertyAvailability();
  const [selectedTimeslots, setSelectedTimeslots] = useState<Timeslot[]>([])
  const [isAddingTimeslot, setIsAddingTimeslot] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handymanTasks = useMemo(() => {
    return tasks.filter(task => task.handymanId === user?.uid);
  }, [tasks, user]);

  const filteredTasks = useMemo(() => {
    return handymanTasks.filter(task => 
      (task.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
       task.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterPriority === 'all' || task.priority === filterPriority) &&
      (filterStatus === 'all' || task.status === filterStatus)
    )
  }, [handymanTasks, searchTerm, filterPriority, filterStatus])

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    try {
      await updateTask(taskId, { status: newStatus });
      if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask({ ...selectedTask, status: newStatus });
      }
      toast.success('Task status updated successfully');
    } catch (error) {
      console.error('Failed to update task status:', error);
      toast.error('Failed to update task status. Please try again.');
    }
  }

  const handleSaveTimeslot = () => {
    if (!selectedDate || (selectedHours.length === 0 && !isEntireDaySelected)) {
      toast.error('Please select a date and at least one hour or entire day');
      return;
    }

    const newTimeslot: Timeslot = {
      date: selectedDate,
      hours: isEntireDaySelected ? ['Entire Day'] : selectedHours,
      approvalStatus: 'pending'
    };

    setSelectedTimeslots([...selectedTimeslots, newTimeslot]);
    setIsAddingTimeslot(true);
  }

  const handleAddAnotherTimeslot = () => {
    setSelectedDate(null);
    setSelectedHours([]);
    setIsEntireDaySelected(false);
    setIsAddingTimeslot(false);
  }

  const handleScheduleTask = async () => {
    if (!selectedTask || selectedTimeslots.length === 0) {
      toast.error('Please save at least one timeslot');
      return;
    }

    try {
      const timeslotsWithApproval = selectedTimeslots.map(timeslot => ({
        ...timeslot,
        approvalStatus: timeslot.approvalStatus || 'pending'
      }));

      await updateTask(selectedTask.id, { 
        status: 'In Progress',
        scheduledTimeslots: timeslotsWithApproval,
      });
      setSelectedTask(null);
      setSelectedTimeslots([]);
      toast.success('Task scheduled and sent for approval');
    } catch (error) {
      console.error('Failed to schedule task:', error);
      toast.error('Failed to schedule task. Please try again.');
    }
  }

  const handleHourToggle = (hour: string) => {
    setSelectedHours(prev => 
      prev.includes(hour) ? prev.filter(h => h !== hour) : [...prev, hour].sort()
    );
    setIsEntireDaySelected(false);
  }

  const handleEntireDayToggle = () => {
    setIsEntireDaySelected(prev => !prev);
    setSelectedHours(isEntireDaySelected ? [] : availableDates.find(d => d.date === selectedDate)?.availableHours || []);
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const handleSearchAvailability = async () => {
    if (!selectedTask) {
      toast.error('No task selected');
      return;
    }
    setIsSearchingAvailability(true);
    try {
      console.log(`Searching availability for task: ${selectedTask.id}, property: ${selectedTask.propertyId}`);
      await fetchAvailability(selectedTask.propertyId);
      console.log("Available dates after fetching:", availableDates);
      toast.success('Availability fetched successfully');
    } catch (error) {
      console.error('Failed to fetch availability:', error);
      toast.error(`Failed to fetch availability: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSearchingAvailability(false);
    }
  };

  if (tasksLoading) return <div>Loading tasks... Please wait.</div>;
  if (tasksError) return <div>Error loading tasks: {tasksError}</div>;
  if (tasks.length === 0) return <div>No tasks found. Please check your connection and try again.</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Tasks</h1>
        
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search tasks..."
              className="pl-10 pr-4 py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-[140px] sm:w-[180px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px] sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Assigned">Assigned</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Pushed Back">Pushed Back</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {filteredTasks.map(task => (
              <li key={task.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex-1 min-w-0">
                    <button onClick={() => setSelectedTask(task)} className="text-left block w-full">
                      <p className="text-sm font-medium text-gray-900 truncate">{task.ticketNumber}</p>
                      <p className="text-sm text-gray-600 truncate">{task.property}</p>
                      <p className="text-sm text-gray-500 truncate">{task.description}</p>
                      <p className="text-xs text-gray-400 truncate">{task.address}</p>
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)} text-white`}>
                      {task.priority}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{task.status}</span>
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => setSelectedTask(task)}
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Task Detail Modal */}
      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTask?.ticketNumber}: {selectedTask?.property}</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <p className="text-sm text-gray-500">{selectedTask?.description}</p>
            <p className="mt-2"><strong>Priority:</strong> {selectedTask?.priority}</p>
            <p><strong>Status:</strong> {selectedTask?.status}</p>
            <p><strong>Address:</strong> {selectedTask?.address}</p>
            <p><strong>Property ID:</strong> {selectedTask?.propertyId}</p>
            
            <Button 
              onClick={handleSearchAvailability} 
              disabled={isSearchingAvailability}
              className="mt-4 mb-4"
            >
              {isSearchingAvailability ? 'Searching...' : 'Search Availability'}
            </Button>

            {availabilityLoading ? (
              <p>Loading availability...</p>
            ) : availabilityError ? (
              <p>Error loading availability: {availabilityError}</p>
            ) : (
              <>
                <div className="mt-4">
                  <Select value={selectedDate || ''} onValueChange={(value) => {
                    setSelectedDate(value);
                    setSelectedHours([]);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select date" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDates.map((availability) => (
                        <SelectItem key={availability.date} value={availability.date}>
                          {availability.date}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedDate && (
                  <div className="mt-2">
                    <h4 className="font-semibold mb-2">Available Hours:</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {availableDates.find(d => d.date === selectedDate)?.availableHours.map((hour) => (
                        <label key={hour} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedHours.includes(hour)}
                            onChange={() => handleHourToggle(hour)}
                            className="form-checkbox h-4 w-4 text-blue-600"
                          />
                          <span>{hour}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                <Button 
                  onClick={handleSaveTimeslot} 
                  className="mt-4"
                  disabled={!selectedDate || (selectedHours.length === 0 && !isEntireDaySelected)}
                >
                  Save Timeslot
                </Button>

                {selectedTimeslots.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Selected Timeslots:</h4>
                    {selectedTimeslots.map((timeslot, index) => (
                      <p key={index}>
                        {timeslot.date}: {timeslot.hours.join(', ')}
                      </p>
                    ))}
                  </div>
                )}

                {isAddingTimeslot && (
                  <div className="mt-4">
                    <p>Do you want to add another timeslot?</p>
                    <div className="flex space-x-2 mt-2">
                      <Button onClick={handleAddAnotherTimeslot}>Yes, Add Another</Button>
                      <Button onClick={handleScheduleTask}>No, Save Task</Button>
                    </div>
                  </div>
                )}
              </>
            )}

            {selectedTask?.imageUrls && selectedTask.imageUrls.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Images:</h4>
                <div className="grid grid-cols-4 gap-2">
                  {selectedTask.imageUrls.map((url, index) => (
                    <img 
                      key={index} 
                      src={url} 
                      alt={`Task image ${index + 1}`} 
                      className="w-full h-24 object-cover rounded cursor-pointer" 
                      onClick={() => setSelectedImage(url)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          {selectedTask?.scheduledTimeslots && selectedTask.scheduledTimeslots.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Scheduled Timeslots:</h4>
              {selectedTask.scheduledTimeslots.map((timeslot, index) => (
                <p key={index}>
                  {timeslot.date}: {timeslot.hours.join(', ')} - 
                  <span className={`font-semibold ${
                    timeslot.approvalStatus === 'approved' ? 'text-green-600' :
                    timeslot.approvalStatus === 'rejected' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {timeslot.approvalStatus 
                      ? timeslot.approvalStatus.charAt(0).toUpperCase() + timeslot.approvalStatus.slice(1)
                      : 'Pending'}
                  </span>
                </p>
              ))}
            </div>
          )}
          <DialogFooter>
            <div className="flex space-x-2">
              <Button onClick={() => selectedTask && handleStatusChange(selectedTask.id, 'Pending Approval')} disabled={selectedTask?.status === 'Pending Approval'}>
                Submit for Approval
              </Button>
              <Button onClick={() => selectedTask && handleStatusChange(selectedTask.id, 'Done')} disabled={selectedTask?.status !== 'Approved'}>
                Mark as Done
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image preview dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="relative w-full h-[80vh]">
              <Image 
                src={selectedImage} 
                alt="Task image preview" 
                layout="fill" 
                objectFit="contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}