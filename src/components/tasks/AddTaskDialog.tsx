
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { addTask, type NewTaskPayload } from '@/services/taskService';
import { TASK_PRIORITIES, type TaskPriority } from '@/types';
import { cn } from '@/lib/utils';

const taskSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }).max(100, { message: 'Title must be 100 characters or less'}),
  description: z.string().max(500, { message: 'Description must be 500 characters or less'}).optional(),
  priority: z.enum(TASK_PRIORITIES, {
    required_error: 'Priority is required',
  }),
  dueDate: z.date().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface AddTaskDialogProps {
  children: React.ReactNode; // To use as DialogTrigger
  onTaskAdded?: (taskId: string) => void;
}

export function AddTaskDialog({ children, onTaskAdded }: AddTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'Medium',
      dueDate: undefined,
    },
  });

  const onSubmit = async (data: TaskFormValues) => {
    setLoading(true);
    try {
      const payload: NewTaskPayload = {
        title: data.title,
        description: data.description,
        priority: data.priority as TaskPriority,
        dueDate: data.dueDate ? format(data.dueDate, 'yyyy-MM-dd') : undefined,
      };
      const taskId = await addTask(payload);
      toast({
        title: 'Task Added',
        description: `Task "${data.title}" has been successfully created.`,
      });
      form.reset();
      setOpen(false);
      if (onTaskAdded) {
        onTaskAdded(taskId);
      }
    } catch (error: any) {
      console.error('Failed to add task:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add task. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new task.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g., Grocery shopping"
              {...form.register('title')}
              aria-invalid={form.formState.errors.title ? "true" : "false"}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="e.g., Buy milk, eggs, and bread"
              {...form.register('description')}
              aria-invalid={form.formState.errors.description ? "true" : "false"}
            />
             {form.formState.errors.description && (
              <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                onValueChange={(value) => form.setValue('priority', value as TaskPriority, { shouldValidate: true })}
                defaultValue={form.getValues('priority')}
              >
                <SelectTrigger id="priority" aria-label="Task priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {TASK_PRIORITIES.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.priority && (
                <p className="text-sm text-destructive">{form.formState.errors.priority.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !form.watch('dueDate') && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.watch('dueDate') ? (
                      format(form.watch('dueDate')!, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={form.watch('dueDate')}
                    onSelect={(date) => form.setValue('dueDate', date, { shouldValidate: true })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {form.formState.errors.dueDate && (
                <p className="text-sm text-destructive">{form.formState.errors.dueDate.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Task'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
