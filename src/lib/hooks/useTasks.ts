import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  updateDoc, 
  addDoc,
  getDoc,
  setDoc,
  doc,  // Add this import
  DocumentData,
  Firestore,
  deleteDoc // Add this import
} from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';

export interface Task {
  id: string;
  ticketNumber: string;
  property: string;
  propertyId: string;
  address: string;
  priority: string;
  description: string;
  status: 'New' | 'Assigned' | 'In Progress' | 'Completed' | 'Pushed Back';
  handymanId: string;
  scheduledTimeslots?: Timeslot[];
}

// Add this interface if it's not already defined elsewhere
interface Timeslot {
  date: string;
  hours: string[];
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("useTasks effect running");
    if (!db) {
      console.error("Firestore is not initialized");
      setError("Firestore is not initialized");
      setLoading(false);
      return;
    }

    console.log("Creating tasks query");
    const tasksQuery = query(collection(db, 'tasks'));

    console.log("Setting up onSnapshot listener");
    const unsubscribe = onSnapshot(tasksQuery, 
      async (snapshot) => {
        console.log("Snapshot received, docs count:", snapshot.docs.length);
        try {
          const tasksData = await Promise.all(snapshot.docs.map(async (docSnapshot) => {
            console.log("Processing task:", docSnapshot.id);
            const taskData = docSnapshot.data() as Task;
            let address = 'Address not available';
            if (taskData.propertyId) {
              try {
                console.log("Fetching property:", taskData.propertyId);
                const propertyDoc = await getDoc(doc(db, 'properties', taskData.propertyId));
                const propertyData = propertyDoc.data() as DocumentData | undefined;
                address = propertyData?.address || 'Address not available';
              } catch (propertyError) {
                console.error("Error fetching property:", propertyError);
              }
            } else {
              console.log("No propertyId for task:", docSnapshot.id);
            }
            return {
              ...taskData,
              id: docSnapshot.id,
              address,
            };
          }));
          console.log("Tasks processed, count:", tasksData.length);
          setTasks(tasksData);
          setLoading(false);
        } catch (err) {
          console.error("Error processing tasks:", err);
          setError("Failed to process tasks");
          setLoading(false);
        }
      },
      (err) => {
        console.error("Error fetching tasks:", err);
        setError("Failed to fetch tasks");
        setLoading(false);
      }
    );

    return () => {
      console.log("Unsubscribing from tasks listener");
      unsubscribe();
    };
  }, []);

  const updateTask = async (taskId: string, updateData: Partial<Task>) => {
    if (!db) {
      console.error("Firestore is not initialized");
      setError("Firestore is not initialized");
      return;
    }
    try {
      console.log("Updating task:", taskId, updateData);
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, updateData);
      console.log("Task updated successfully");
    } catch (err) {
      console.error("Error updating task:", err);
      setError("Failed to update task");
    }
  };

  const addTask = async (newTask: Omit<Task, 'id' | 'ticketNumber'>) => {
    if (!db) {
      console.error("Firestore is not initialized");
      throw new Error("Firestore is not initialized");
    }
    try {
      console.log("Adding new task:", newTask);
      const ticketNumber = await generateTicketNumber();
      const taskWithTicket = { ...newTask, ticketNumber };
      const docRef = await addDoc(collection(db, 'tasks'), taskWithTicket);
      console.log("Task added successfully with ID:", docRef.id);
      return docRef.id;
    } catch (err) {
      console.error("Error adding task:", err);
      throw err; // Re-throw the error to be handled by the component
    }
  };

  const generateTicketNumber = async () => {
    if (!db) {
      throw new Error("Firestore is not initialized");
    }
    const counterRef = doc(db, 'counters', 'taskCounter');
    const counterSnap = await getDoc(counterRef);
    let counter = 1;
    if (counterSnap.exists()) {
      counter = counterSnap.data().value + 1;
    }
    await setDoc(counterRef, { value: counter }, { merge: true });
    return `TASK-${counter.toString().padStart(4, '0')}`;
  };

  const deleteTask = async (taskId: string) => {
    if (!db) {
      console.error("Firestore is not initialized");
      throw new Error("Firestore is not initialized");
    }
    try {
      console.log("Deleting task:", taskId);
      const taskRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskRef);
      console.log("Task deleted successfully");
    } catch (err) {
      console.error("Error deleting task:", err);
      throw err;
    }
  };

  return { tasks, loading, error, updateTask, addTask, generateTicketNumber, deleteTask };
}