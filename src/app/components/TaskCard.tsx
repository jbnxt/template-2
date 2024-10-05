import React from 'react';
import { Task } from '../lib/types';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  return (
    <div
      className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
      <p className="text-gray-600 mb-2">{task.description}</p>
      <p className="text-sm text-gray-500">
        <span className="font-medium">Address:</span> {task.address}
      </p>
      <p className="text-sm text-gray-500">
        <span className="font-medium">Property ID:</span> {task.propertyId}
      </p>
      <p className="text-sm text-gray-500 mt-2">
        Due: {new Date(task.dueDate).toLocaleDateString()}
      </p>
    </div>
  );
};

export default TaskCard;