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
import { TodoData } from 'src/app/shared/todo-interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

type TodoStatus = 'todo' | 'awaiting_feedback' | 'in_progress' | 'done';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  tasks: TodoData[] = [];
  filteredTasks: TodoData[] | null = null;
  todo: TodoData[] = [];
  inProgress: TodoData[] = [];
  awaitingFeedback: TodoData[] = [];
  done: TodoData[] = [];
  todoForm!: FormGroup;
  


  constructor(
    private ts: TodoService,
    private fb: FormBuilder) { }


  ngOnInit(): void {
    this.initAllTasks();
  }


  async initAllTasks() {
    try {
      const allTasks = await this.ts.getAllTodos();
      console.log(allTasks);
      this.todo = allTasks.filter(task => task.status === 'todo');
      this.inProgress = allTasks.filter(task => task.status === 'in_progress');
      this.awaitingFeedback = allTasks.filter(task => task.status === 'awaiting_feedback');
      this.done = allTasks.filter(task => task.status === 'done');
    } catch (err) {
      console.error('Could not load tasks to board.', err);
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
      const updatedData: Partial<TodoData>  = { status: newStatus };
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


  // applyFilter(searchTerm: string) {
  //   if (!searchTerm) {
  //     this.filteredTasks = null;
  //     return;
  //   }
  //   searchTerm = searchTerm.toLowerCase();
  //   const allTasks = [...this.todo, ...this.inProgress, ...this.awaitingFeedback, ...this.done];
  //   this.filteredTasks = allTasks.filter(task =>
  //     task.title.toLowerCase().includes(searchTerm) ||
  //     task.description.toLowerCase().includes(searchTerm)
  //   );
  // }


  // getCurrentTasksForStatus(status: string): TodoData[] {
  //   if (this.filteredTasks) {
  //     return this.filteredTasks.filter(task => task.status === status);
  //   }

  //   switch (status) {
  //     case 'todo':
  //       return this.todo;
  //     case 'in_progress':
  //       return this.inProgress;
  //     case 'awaiting_feedback':
  //       return this.awaitingFeedback;
  //     case 'done':
  //       return this.done;
  //     default:
  //       return [];
  //   }
  // }


}
