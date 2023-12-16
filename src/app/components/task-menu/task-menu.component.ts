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
    });
  }


  ngOnInit(): void {
    this.initFormGroup();
    this.loadtaskbyId();
  }


  /**
   * Initializes the todo form with necessary fields and default values.
   * Fields include title, description, due_date, category, priority, status, assigned_to, and subtasks.
   * All fields except 'priority' and 'subtasks' are required.
   * Default values are set for 'priority' as 'medium' and 'status' as 'todo'.
   */
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


  /**
   * Asynchronously loads a task by its ID and updates the todo form with its details.
   * Fetches the task data using `getTaskById` from the task service.
   * Upon successful retrieval, updates the form with task details including title, description, due date, category, priority, status, assigned to, and subtasks.
   * In case of an error, the HttpErrorInterceptor triggers the dialog-error-component with the error message
   * and logs the error in the console.
   */
  async loadtaskbyId() {
    try {
      const task = await this.ts.getTaskById(this.data.taskId);
      this.task = task;
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
      console.error('Could not load task!', err);
    }
  }


  /**
   * Asynchronously deletes a task by its ID.
   * If a valid taskId is provided, it calls the deleteTask method from the task service.
   * Closes the dialog with a success indication upon successful deletion.
   * In case of an error, the HttpErrorInterceptor triggers the dialog-error-component with the error message
   * and logs the error in the console.
   *
   * @param {number} taskId - The ID of the task to be deleted.
   */
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


  /**
   * Retrieves the image path for a given task priority.
   * Returns different image paths based on the priority level ('low', 'medium', 'urgent').
   * If the priority does not match any of the predefined cases, returns an empty string.
   *
   * @param {string} prio - The priority level of the task.
   * @returns {string} The path to the priority image or an empty string if no match is found.
   */
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


  /**
   * Asynchronously updates the status of a task.
   * Checks if the task exists and the new status is valid before updating.
   * Calls the updateTodo method of the task service to update the task's status.
   * Notifies about the task update on successful status change.
   * Logs an error to the console if the update operation fails.
   *
   * @param {'todo' | 'in_progress' | 'awaiting_feedback' | 'done'} newStatus - The new status to set for the task.
   */
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


  /**
   * Generates the initials from the given first and last names.
   * Takes the first character of each name (if available) and concatenates them.
   * Returns the resulting initials in uppercase.
   *
   * @param {string} firstname - The first name.
   * @param {string} lastname - The last name.
   * @returns {string} The uppercase initials formed from the first and last names.
   */
  getInitials(firstname: string, lastname: string): string {
    const initials = `${firstname?.[0] ?? ''}${lastname?.[0] ?? ''}`;
    return initials.toUpperCase();
  }


  /**
   * Closes the dialog-task-menu.
   */
  closeDialogTaskMenu() {
    this.dialogRef.close();
  }


  /**
   * Opens a dialog for editing a task specified by its ID.
   * Launches the DialogEditTaskComponent with the given task ID as data.
   * Closes the current dialog after opening the edit dialog.
   *
   * @param {number} taskId - The ID of the task to be edited.
   */
  editTask(taskId: number) {
    const dialogRef = this.dialog.open(DialogEditTaskComponent, {
      data: { taskId: taskId }
    });
    this.dialogRef.close();
  }


  /**
   * Handles the checking/unchecking of a subtask and updates its status accordingly.
   * Extracts the check status from the event target and updates the subtask's 'checked' property in the database.
   * Notifies about the task update after successfully updating the subtask.
   * In case of an error, the HttpErrorInterceptor triggers the dialog-error-component with the error message
   * and logs the error in the console
   *
   * @param {number} subtaskId - The ID of the subtask being updated.
   * @param {Event} event - The event triggered by checking/unchecking the subtask.
   */
  async subtaskChecked(subtaskId: number, event: Event) {
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


  /**
   * Asynchronously updates the title of a subtask.
   * If a valid subtaskId is provided, calls the updateSubtask method from the task service with the new title.
   * In case of an error, the HttpErrorInterceptor triggers the dialog-error-component with the error message
   * and logs the error in the console
   *
   * @param {number} subtaskId - The ID of the subtask to be updated.
   * @param {string} title - The new title to set for the subtask.
   */
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


  /**
   * Asynchronously deletes a subtask by its ID.
   * If a valid subtaskId is provided, it calls the deleteSubtask method from the task service.
   * Notifies about the task update after successful deletion.
   * In case of an error, the HttpErrorInterceptor triggers the dialog-error-component with the error message
   * and logs the error in the console
   *
   * @param {number} subtaskId - The ID of the subtask to be deleted.
   */
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
