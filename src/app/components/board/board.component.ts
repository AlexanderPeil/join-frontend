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


  constructor(private ts: TodoService) { }


  ngOnInit(): void {
    this.initAllTasks();
  }


  async initAllTasks() {
    try {
      const allTasks = await this.ts.getAllTodos();
      this.todo = allTasks.filter(task => task.status === 'todo');
      this.inProgress = allTasks.filter(task => task.status === 'in_progress');
      this.awaitingFeedback = allTasks.filter(task => task.status === 'awaiting_feedback');
      this.done = allTasks.filter(task => task.status === 'done');
    } catch (err) {
      console.error('Could not load tasks to board.',err);
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
    }
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
