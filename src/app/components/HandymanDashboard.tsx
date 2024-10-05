import React, { useState, useEffect } from 'react';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import { Task } from '../lib/types';
import { fetchTasks } from '../lib/api';

const HandymanDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    const loadTasks = async () => {
      const fetchedTasks = await fetchTasks();
      setTasks(fetchedTasks);
    };
    loadTasks();
  }, []);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Handyman Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={() => handleTaskClick(task)} />
        ))}
      </div>
      {selectedTask && (
        <TaskModal task={selectedTask} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default HandymanDashboard;