'use client'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Task } from '@/lib/hooks/useTasks';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>;
}

const columns = ['New', 'Pending Approval', 'Approved', 'Done'];

export function KanbanBoard({ tasks, onTaskUpdate }: KanbanBoardProps) {
  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      try {
        await onTaskUpdate(draggableId, { status: destination.droppableId as Task['status'] });
      } catch (error) {
        console.error('Failed to update task status:', error);
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-4">
        {columns.map((column) => (
          <div key={column} className="bg-gray-100 p-4 rounded-lg w-1/5">
            <h3 className="font-semibold mb-4">{column}</h3>
            <Droppable droppableId={column}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="min-h-[200px]"
                >
                  {tasks
                    .filter((task) => task.status === column)
                    .map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-4 mb-2 rounded shadow"
                          >
                            {task.ticketNumber}: {task.property}
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}