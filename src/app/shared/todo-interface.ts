export interface TodoData {
  id: number;
  title: string;
  description: string;
  due_date: Date | string;
  category: CategoryData;
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


export interface CategoryData {
  id?: number;
  name: string;
  color: string;
}


export interface SubtaskData {
  id?: number;
  title?: string;
  checked?: boolean;
}