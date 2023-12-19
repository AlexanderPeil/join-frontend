import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { TaskService } from 'src/app/shared/services/task.service';
import { SubtaskData, TaskData } from 'src/app/shared/task-interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TaskMenuComponent } from '../task-menu/task-menu.component';
import { DialogAddTaskComponent } from '../dialog-add-task/dialog-add-task.component';

type TaskStatus = 'todo' | 'awaiting_feedback' | 'in_progress' | 'done';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  searchTerm: string = '';
  allTasks: TaskData[] = [];
  filteredTasks: TaskData[] | null = null;
  task: TaskData[] = [];
  todo: TaskData[] = [];
  inProgress: TaskData[] = [];
  awaitingFeedback: TaskData[] = [];
  done: TaskData[] = [];
  taskForm!: FormGroup;
  mousedownTime: number | undefined;
  subtaskCountsMap = new Map<number, { total: number, checked: number }>();


  constructor(
    private taskService: TaskService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog) {
    this.taskService.getTaskUpdateListener().subscribe(() => {
      this.initAllTasks();
    });
  }


  ngOnInit(): void {
    this.initAllTasks();
  }


  /**
   * Asynchronously initializes and loads all tasks.
   * Fetches all tasks using `ts.getAllTasks()` and stores them in `this.allTasks`.
   * Iterates over each task to load detailed information for each task by calling `loadTaskDetails`.
   * After loading details for all tasks, applies task filtering through `filterTasks`.
   * If an error occurs during this process, the catch block is currently empty.
   */
  async initAllTasks() {
    try {
      const allTasks = await this.taskService.getAllTasks();
      this.allTasks = allTasks;
      for (const task of this.allTasks) {
        await this.loadTaskDetails(task.id);
      }
      this.filterTasks();
    } catch (err) {
      console.error('Could not load tasks!', err);
    }
  }


  /**
   * Asynchronously initializes and loads all tasks.
   * Fetches all tasks using `ts.getAllTasks()` and stores them in `this.allTasks`.
   * Iterates over each task to load detailed information for each task by calling `loadTaskDetails`.
   * After loading details for all tasks, applies task filtering through `filterTasks`.
   * In case of an error, the HttpErrorInterceptor triggers the dialog-error-component with the error message.
   */
  async loadTaskDetails(taskId: number) {
    try {
      const taskData = await this.taskService.getTaskById(taskId);
      const subtaskCounts = this.taskService.getSubtaskCountsForTask(taskData);
      this.subtaskCountsMap.set(taskId, subtaskCounts);
    } catch (error) {
    }
  }


  /**
   * Filters tasks based on the current search term.
   * If no search term is provided, tasks are assigned by their status using `assignTasksByStatus`.
   * If a search term is present, it filters tasks based on the term using `getFilteredTasksBySearchTerm`.
   */
  filterTasks() {
    if (!this.searchTerm) {
      this.assignTasksByStatus();
    } else {
      this.getFilteredTasksBySearchTerm();
    }
  }


  /**
   * Assigns tasks to different categories based on their status.
   * Filters `this.allTasks` and categorizes them into 'todo', 'in_progress', 
   * 'awaiting_feedback', and 'done' based on their respective statuses.
   */
  assignTasksByStatus() {
    this.todo = this.allTasks.filter(task => task.status === 'todo');
    this.inProgress = this.allTasks.filter(task => task.status === 'in_progress');
    this.awaitingFeedback = this.allTasks.filter(task => task.status === 'awaiting_feedback');
    this.done = this.allTasks.filter(task => task.status === 'done');
  }


  /**
   * Filters tasks based on a search term and assigns them to status categories.
   * First filters `this.allTasks` by checking if the title or description contains the search term.
   * The resulting `this.filteredTasks` are then categorized into 'todo', 'in_progress', 
   * 'awaiting_feedback', and 'done' based on their status.
   */
  getFilteredTasksBySearchTerm() {
    this.filteredTasks = this.allTasks.filter(task =>
      task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.todo = this.filteredTasks.filter(task => task.status === 'todo');
    this.inProgress = this.filteredTasks.filter(task => task.status === 'in_progress');
    this.awaitingFeedback = this.filteredTasks.filter(task => task.status === 'awaiting_feedback');
    this.done = this.filteredTasks.filter(task => task.status === 'done');
  }


  /**
   * Handles drag-and-drop actions for tasks.
   * If the task is moved within the same container, it reorders the task using `moveItemInArray`.
   * If the task is moved to a different container, it transfers the task using `transferArrayItem`
   * and updates the task's status to reflect its new container using `updateStatus`.
   *
   * @param event - The CdkDragDrop event containing details about the drag-and-drop operation.
   */
  drop(event: CdkDragDrop<TaskData[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      const item = event.container.data[event.currentIndex];
      const newStatus = this.getStatusFromContainerId(event.container.id);
      this.updateStatus(item.id, newStatus);
    }
  }


  /**
   * Determines the TaskStatus based on the container ID.
   * Maps specific container IDs to their corresponding TaskStatus values.
   * Returns 'todo' as the default status if the container ID does not match any case.
   *
   * @param containerId - The ID of the container.
   * @returns TaskStatus - The status associated with the given container ID.
   */
  getStatusFromContainerId(containerId: string): TaskStatus {
    switch (containerId) {
      case 'todoList':
        return 'todo';
      case 'inProgressList':
        return 'in_progress';
      case 'awaitingFeedbackList':
        return 'awaiting_feedback';
      case 'doneList':
        return 'done';
      default:
        return 'todo';
    }
  }


  /**
   * Asynchronously updates the status of a task item.
   * Sends a request to update the status of a specific task item identified by its ID.
   * In case of an error, the HttpErrorInterceptor triggers the dialog-error-component with the error message.
   *
   * @param taskId - The ID of the task item to be updated.
   * @param newStatus - The new status to be set for the task item.
   */
  async updateStatus(taskId: number, newStatus: TaskStatus) {
    try {
      const updatedData: Partial<TaskData> = { status: newStatus };
      await this.taskService.updateTask(taskId, updatedData);
    } catch (err) {
      console.error('Could not update status!', err);
    }
  }


  /**
   * Generates initials from a given first name and last name.
   * Takes the first letter of each name and concatenates them.
   * Returns the initials in uppercase.
   *
   * @param firstname - The first name to extract the initial from.
   * @param lastname - The last name to extract the initial from.
   * @returns string - The concatenated initials in uppercase.
   */
  getInitials(firstname: string, lastname: string): string {
    const initials = `${firstname?.[0] ?? ''}${lastname?.[0] ?? ''}`;
    return initials.toUpperCase();
  }


  /**
   * Initializes the task form group with default values and validators.
   * Sets up form fields including 'title', 'description', 'due_date', and 'category', each marked as required.
   * Defaults 'priority' to 'medium' and 'status' to 'todo'.
   * Initializes 'assigned_to' as an array field with a required validator.
   * 'subtasks' is also initialized as an array field without initial validators.
   */
  initFormGroup() {
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      due_date: ['', Validators.required],
      category: ['', Validators.required],
      priority: ('medium'),
      status: ('todo'),
      assigned_to: this.formBuilder.array([], Validators.required),
      subtasks: this.formBuilder.array([])
    });
  }


  /**
   * Records the timestamp of a mousedown event when the primary mouse button is clicked.
   * Useful for tracking the duration of mouse clicks or for initiating drag-and-drop operations.
   *
   * @param event - The MouseEvent triggered by the mousedown action.
   */
  onMousedown(event: MouseEvent) {
    if (event.button === 0) {
      this.mousedownTime = event.timeStamp;
    }
  }


  /**
   * Handles the mouseup event for a task.
   * Determines if the mouseup event represents a quick click based on the elapsed time since mousedown.
   * If the time difference is less than 200 milliseconds, it's considered a quick click and navigates to the task menu.
   * Resets the mousedown timestamp after processing.
   *
   * @param event - The MouseEvent triggered by the mouseup action.
   * @param taskId - The ID of the task associated with the mouseup event.
   */
  onMouseup(event: MouseEvent, taskId: number) {
    if (event.button === 0) {
      const elapsed = event.timeStamp - (this.mousedownTime ?? 0);
      if (elapsed < 200) {
        this.navigateToTaskMenu(taskId);
      }
      this.mousedownTime = undefined;
    }
  }


  /**
   * Opens the TaskMenuComponent in a dialog with the given task ID.
   * After the dialog is closed, it checks if there was a result (indicating a potential change).
   * If there is a result, it re-initializes all tasks by calling `initAllTasks`.
   *
   * @param taskId - The ID of the task for which the menu is to be displayed.
   */
  navigateToTaskMenu(taskId: number) {
    const dialogRef = this.dialog.open(TaskMenuComponent, {
      data: { taskId: taskId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.initAllTasks();
      }
    });
  }


  /**
   * Opens the DialogAddTaskComponent in a dialog with the specified task status.
   * Passes the provided status to the dialog component for initializing or handling task-specific actions.
   *
   * @param status - The status of the task to be added or modified in the dialog.
   */
  openDialogAddTask(status: string) {
    const dialogRef = this.dialog.open(DialogAddTaskComponent, {
      data: { status: status }
    });
  }


  /**
   * Retrieves the image URL for a given task priority.
   * Returns the path to the corresponding priority image based on the priority level.
   *
   * @param prio - The priority level of the task ('low', 'medium', or 'urgent').
   * @returns string - The URL of the image associated with the given priority.
   */
  getPriorityImage(prio: string) {
    switch (prio) {
      case 'low':
        return 'assets/img/prio_low_white.png';
      case 'medium':
        return 'assets/img/prio_medium.png';
      case 'urgent':
        return 'assets/img/prio_urgent.png';
      default: return '';
    }
  }


  /**
   * Calculates the progress percentage based on the completion of subtasks.
   * Determines the ratio of checked (completed) subtasks to total subtasks.
   * Returns the progress as a percentage value.
   *
   * @param subtasks - An array of SubtaskData objects.
   * @returns number - The calculated progress percentage.
   */
  calculateProgress(subtasks: SubtaskData[]): number {
    const totalSubtasks = subtasks.length;
    const checkedSubtasks = subtasks.filter(subtask => subtask.checked).length;
    const progress = (checkedSubtasks / totalSubtasks) * 100;
    return progress;
  }

}
