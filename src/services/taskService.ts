import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import type { Task, TaskPriority, TaskStatus } from '@/types';

export interface NewTaskPayload {
  title: string;
  description?: string;
  dueDate?: string; // ISO string format
  priority: TaskPriority;
}

export const addTask = async (taskData: NewTaskPayload): Promise<string> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }

  const newTask: Omit<Task, 'id'> = {
    ...taskData,
    userId: user.uid,
    status: 'Todo' as TaskStatus, // Default status
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const docRef = await addDoc(collection(db, 'tasks'), newTask);
  return docRef.id;
};

// Future functions like getTasks, updateTask, deleteTask can be added here
