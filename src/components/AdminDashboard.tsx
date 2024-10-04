'use client'

import { useState, useEffect } from 'react';
import { KanbanBoard } from './KanbanBoard';
import { PropertyManagement } from './PropertyManagement';
import { ReportingDashboard } from './ReportingDashboard';

export function AdminDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      // Assume we have an API function to fetch tasks
      const response = await fetch('/api/tasks');
      const data = await response.json();
      setTasks(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch tasks. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <KanbanBoard tasks={tasks} onTaskUpdate={fetchTasks} />
      <PropertyManagement />
      <ReportingDashboard />
    </div>
  );
}