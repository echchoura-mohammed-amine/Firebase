import type { User as FirebaseUser } from 'firebase/auth';

export interface User extends FirebaseUser {
  // Add any custom user properties here if needed
  // e.g. customRole?: string;
}

export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Todo' | 'In Progress' | 'Done';

// Ensure the array is a tuple to satisfy z.enum
export const TASK_PRIORITIES: [TaskPriority, ...TaskPriority[]] = ['Low', 'Medium', 'High'];
export const TASK_STATUSES: [TaskStatus, ...TaskStatus[]] = ['Todo', 'In Progress', 'Done'];


export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; // ISO string format e.g. "2024-12-31"
  priority: TaskPriority;
  status: TaskStatus;
  userId: string; // To associate task with a user
  createdAt: number; // Timestamp, e.g., Date.now()
  updatedAt: number; // Timestamp, e.g., Date.now()
}
