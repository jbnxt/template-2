'use client'

import { useState, useEffect } from 'react';
import { TaskList } from './TaskList';
import { TaskDetailView } from './TaskDetailView';

export function HandymanDashboard() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    // In a real application, you would fetch tasks from your backend API
    // For now, we'll use dummy data
    setTasks([
      { id: 1, title: 'Fix leaky faucet', status: 'pending' },
      { id: 2, title: 'Replace light bulbs', status: 'in_progress' },
      { id: 3, title: 'Paint bedroom', status: 'completed' },
    ]);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Handyman Dashboard</h1>
      <div className="flex">
        <div className="w-1/3 pr-4">
          <TaskList tasks={tasks} onSelectTask={setSelectedTask} />
        </div>
        <div className="w-2/3">
          {selectedTask ? (
            <TaskDetailView task={selectedTask} />
          ) : (
            <p>Select a task to view details</p>
          )}
        </div>
      </div>
    </div>
  );
}