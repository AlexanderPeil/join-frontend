interface TodoData {
    title: string;
    description: string;
    due_date: Date | string; 
    category: string; 
    priority: 'low' | 'medium' | 'urgent';
    status: 'todo' | 'awaiting_feedback' | 'in_progress' | 'done';
    assigned_to: number[]; 
    subtasks: SubtaskData[]; 
  }


  interface SubtaskData {
    title: string;
    check: boolean;
  }