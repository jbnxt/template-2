export interface Problem {
  id: string
  title: string
  description: string
  status: string
  priority: string
  property: string
  createdAt: string
  // Add other properties as needed
}

export interface Timeslot {
  date: string;
  hours: string[];
  approvalStatus: 'pending' | 'approved' | 'rejected';
}

export interface Task {
  id: string;
  ticketNumber: string;
  property: string;
  propertyId: string;
  address: string;
  priority: string;
  description: string;
  status: 'New' | 'Pending Approval' | 'Approved' | 'Done';
  handymanId: string | null;
  scheduledTimeslots?: Timeslot[];
  imageUrls?: string[];
}