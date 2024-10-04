'use client'

interface Task {
  id: number;
  title: string;
  status: string;
}

interface TaskDetailViewProps {
  task: Task;
}

export function TaskDetailView({ task }: TaskDetailViewProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">{task.title}</h2>
      <p className="mb-2">
        <span className="font-bold">Status:</span> {task.status}
      </p>
      {/* Add more task details here */}
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
        Update Status
      </button>
    </div>
  );
}