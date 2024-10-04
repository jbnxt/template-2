import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { useAuth } from './useAuth';

export interface Task {
  id: string;
  property: string;
  priority: string;
  description: string;
  status: string;
  handymanId: string | null; // Changed from handyman to handymanId
  dueDate: string;
  pdfFile?: File | null;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    let q = query(collection(db, 'tasks'), orderBy('dueDate', 'asc'));

    if (user.role === 'handyman') {
      q = query(collection(db, 'tasks'), where('handymanId', '==', user.uid), orderBy('dueDate', 'asc'));
    }

    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const tasksData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Task));
        setTasks(tasksData);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching tasks: ", err);
        setError("Failed to fetch tasks");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addTask = async (newTask: Omit<Task, 'id'>) => {
    try {
      await addDoc(collection(db, 'tasks'), newTask);
    } catch (err) {
      console.error("Error adding task: ", err);
      setError("Failed to add task");
    }
  };

  const updateTask = async (taskId: string, updatedTask: Partial<Task>) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), updatedTask);
    } catch (err) {
      console.error("Error updating task: ", err);
      setError("Failed to update task");
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (err) {
      console.error("Error deleting task: ", err);
      setError("Failed to delete task");
    }
  };

  return { tasks, loading, error, addTask, updateTask, deleteTask };
}