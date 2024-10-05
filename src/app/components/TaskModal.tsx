import React from 'react';
import { Task } from '../lib/types';

interface TaskModalProps {
  task: Task;
  onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">{task.title}</h2>
        <p className="text-gray-600 mb-4">{task.description}</p>
        <p className="text-sm text-gray-500 mb-2">
          <span className="font-medium">Address:</span> {task.address}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          <span className="font-medium">Property ID:</span> {task.propertyId}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Status: {task.status.replace('_', ' ')}
        </p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TaskModal;