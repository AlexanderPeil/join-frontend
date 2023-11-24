export interface TodoData {
  title: string;
  description: string;
  due_date: Date | string;
  category: {
    name: string;
    color: string;
  };
  priority: 'low' | 'medium' | 'urgent';
  status: 'todo' | 'awaiting_feedback' | 'in_progress' | 'done';
  assigned_to: ContactData[];
  subtasks: SubtaskData[];
}


export interface ContactData {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  color: string;
}


export interface SubtaskData {
  title: string;
  check: boolean;
}