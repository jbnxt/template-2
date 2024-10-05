export interface Task {
  id: string;
  title: string;
  description: string;
  address: string;
  propertyId: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
}

// ... other types