import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TodoService } from 'src/app/shared/services/todo.service';
import { TodoData } from 'src/app/shared/todo-interface';
import { DialogEditTaskComponent } from '../dialog-edit-task/dialog-edit-task.component';

@Component({
  selector: 'app-task-menu',
  templateUrl: './task-menu.component.html',
  styleUrls: ['./task-menu.component.scss']
})
export class TaskMenuComponent implements OnInit {
  todoForm!: FormGroup;
  task!: TodoData;
  statuses: string[] = ['todo', 'in_progress', 'awaiting_feedback', 'done'];


  constructor(
    private dialogRef: MatDialogRef<TaskMenuComponent>,
    private fb: FormBuilder,
    private ts: TodoService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.ts.getTaskUpdateListener().subscribe(() => {
    this.loadtaskbyId();
  }); }


  ngOnInit(): void {
    this.initFormGroup();
    this.loadtaskbyId();
  }


  initFormGroup() {
    this.todoForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      due_date: ['', Validators.required],
      category: ['', Validators.required],
      priority: 'medium',
      status: 'todo',
      assigned_to: this.fb.array([], Validators.required),
      subtasks: this.fb.array([])
    });
  }


  async loadtaskbyId() {
    try {
      const task = await this.ts.getTaskById(this.data.taskId);
      this.task = task;
      console.log(this.task);
      this.todoForm.patchValue({
        title: task.title,
        description: task.description,
        due_date: task.due_date,
        category: task.category,
        priority: task.priority,
        status: task.status,
        assigned_to: task.assigned_to,
        subtasks: task.subtasks
      });
    } catch (err) {
      console.error(err);
    }
  }


  async deleteTask(taskId: number) {
    if (taskId) {
      try {
        await this.ts.deleteTask(taskId);
        this.dialogRef.close(true);
      } catch (err) {
        console.error(err);
      }
    }
  }


  getPriorityImage(prio: string) {
    switch (prio) {
      case 'low':
        return '../../assets/img/prio_low_white.png';
      case 'medium':
        return '../../assets/img/prio_medium.png';
      case 'urgent':
        return '../../assets/img/prio_urgent.png';
      default: return '';
    }
  }


  async updateTaskStatus(newStatus: 'todo' | 'in_progress' | 'awaiting_feedback' | 'done') {
    if (this.task && this.statuses.includes(newStatus)) {
      try {
        const updatedTask = { status: newStatus };
        await this.ts.updateTodo(this.task.id, updatedTask);
        this.ts.notifyTaskUpdate();
      } catch (err) {
        console.error('Error updating task status:', err);
      }
    }
  }


  getInitials(firstname: string, lastname: string): string {
    const initials = `${firstname?.[0] ?? ''}${lastname?.[0] ?? ''}`;
    return initials.toUpperCase();
  }


  closeDialogTaskMenu() {
    this.dialogRef.close();
  }


  editTask(taskId: number) {
    const dialogRef = this.dialog.open(DialogEditTaskComponent, {
      data: { taskId: taskId }
    });
    this.dialogRef.close();
  }


  async subtaskChecked(subtaskId: number, event: Event) {
    console.log(subtaskId, event);

    const target = event.target as HTMLInputElement | null;
    if (target) {
      try {
        const updatedData = { checked: target.checked };
        await this.ts.updateSubtask(this.data.taskId, subtaskId, updatedData);
        this.ts.notifyTaskUpdate();
      } catch (err) {
        console.error(err);
      }
    }
  }


  async updateSubtaskTitle(subtaskId: number, title: string) {
    if (subtaskId !== undefined) {
      try {
        const updatedData = { title: title };
        await this.ts.updateSubtask(this.data.taskId, subtaskId, updatedData);
      } catch (err) {
        console.error(err);
      }
    }
  }


  async deleteCurrentSubtask(subtaskId: number) {
    if (subtaskId) {
      try {
        await this.ts.deleteSubtask(this.task.id, subtaskId);
        this.ts.notifyTaskUpdate();
      } catch (err) {
        console.error(err);
      }
    }
  }

}
