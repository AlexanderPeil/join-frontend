import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { AuthService } from "../../shared/services/auth.service";
import { TodoService } from 'src/app/shared/services/todo.service';
import { SubtaskData, TodoData } from 'src/app/shared/todo-interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TaskMenuComponent } from '../task-menu/task-menu.component';
import { DialogAddTaskComponent } from '../dialog-add-task/dialog-add-task.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

type TodoStatus = 'todo' | 'awaiting_feedback' | 'in_progress' | 'done';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  searchTerm: string = '';
  allTasks: TodoData[] = [];
  filteredTasks: TodoData[] | null = null;
  todo: TodoData[] = [];
  inProgress: TodoData[] = [];
  awaitingFeedback: TodoData[] = [];
  done: TodoData[] = [];
  todoForm!: FormGroup;
  mousedownTime: number | undefined;
  task!: TodoData;
  subtaskCountsMap = new Map<number, { total: number, checked: number }>();


  constructor(
    private ts: TodoService,
    private fb: FormBuilder,
    public dialog: MatDialog) {
    this.ts.getTaskUpdateListener().subscribe(() => {
      this.initAllTasks();
    });
  }


  ngOnInit(): void {
    this.initAllTasks();
  }


  async initAllTasks() {
    try {
      const allTasks = await this.ts.getAllTodos();
      this.allTasks = allTasks;
      for (const task of this.allTasks) {
        await this.loadTaskDetails(task.id);
      }
      console.log(this.allTasks);
      this.filterTasks();
    } catch (err) {
      console.error('Could not load tasks to board.', err);
    }
  }


  async loadTaskDetails(taskId: number) {
    try {
      const taskData = await this.ts.getTaskById(taskId);
      const subtaskCounts = this.ts.getSubtaskCountsForTask(taskData);
      this.subtaskCountsMap.set(taskId, subtaskCounts);
    } catch (error) {
      console.error(error);
    }
  }


  filterTasks() {
    if (!this.searchTerm) {
      this.todo = this.allTasks.filter(task => task.status === 'todo');
      this.inProgress = this.allTasks.filter(task => task.status === 'in_progress');
      this.awaitingFeedback = this.allTasks.filter(task => task.status === 'awaiting_feedback');
      this.done = this.allTasks.filter(task => task.status === 'done');

    } else {
      this.filteredTasks = this.allTasks.filter(task =>
        task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      this.todo = this.filteredTasks.filter(task => task.status === 'todo');
      this.inProgress = this.filteredTasks.filter(task => task.status === 'in_progress');
      this.awaitingFeedback = this.filteredTasks.filter(task => task.status === 'awaiting_feedback');
      this.done = this.filteredTasks.filter(task => task.status === 'done');
    }
  }


  drop(event: CdkDragDrop<TodoData[]>) {
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


  getStatusFromContainerId(containerId: string): TodoStatus {
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


  async updateStatus(todoId: number, newStatus: TodoStatus) {
    try {
      const updatedData: Partial<TodoData> = { status: newStatus };
      await this.ts.updateTodo(todoId, updatedData);
    } catch (err) {
      console.error('Could not update task-status:', err);
    }
  }


  getInitials(firstname: string, lastname: string): string {
    const initials = `${firstname?.[0] ?? ''}${lastname?.[0] ?? ''}`;
    return initials.toUpperCase();
  }


  initFormGroup() {
    this.todoForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      due_date: ['', Validators.required],
      category: ['', Validators.required],
      priority: ('medium'),
      status: ('todo'),
      assigned_to: this.fb.array([], Validators.required),
      subtasks: this.fb.array([])
    });
  }


  onMousedown(event: MouseEvent) {
    if (event.button === 0) {
      this.mousedownTime = event.timeStamp;
    }
  }


  onMouseup(event: MouseEvent, taskId: number) {
    if (event.button === 0) {
      const elapsed = event.timeStamp - (this.mousedownTime ?? 0);
      if (elapsed < 200) {
        this.navigateToTaskMenu(taskId);
      }
      this.mousedownTime = undefined;
    }
  }


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


  openDialogAddTask(status: string) {
    const dialogRef = this.dialog.open(DialogAddTaskComponent, {
      data: { status: status }
    });
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


  calculateProgress(subtasks: SubtaskData[]): number {
    const totalSubtasks = subtasks.length;
    const checkedSubtasks = subtasks.filter(subtask => subtask.checked).length;
    const progress = (checkedSubtasks / totalSubtasks) * 100;
    return progress;
  }

}
