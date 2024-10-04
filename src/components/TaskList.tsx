'use client'

interface Task {
  id: number;
  title: string;
  status: string;
}

interface TaskListProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
}

export function TaskList({ tasks, onSelectTask }: TaskListProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Task List</h2>
      <ul>
        {tasks.map((task) => (
          <li
            key={task.id}
            className="bg-white p-4 rounded-lg shadow mb-2 cursor-pointer hover:bg-gray-50"
            onClick={() => onSelectTask(task)}
          >
            <h3 className="font-bold">{task.title}</h3>
            <p className="text-sm text-gray-500">Status: {task.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}