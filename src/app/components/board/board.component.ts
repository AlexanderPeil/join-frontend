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


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  tasks: TodoData[] = [];
  todo: TodoData[] = [];
  inProgress: TodoData[] = [];
  awaitingFeedback: TodoData[] = [];
  done: TodoData[] = [];


  constructor(private ts: TodoService) {

  }


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
      console.error(err);
    }
  }


  // async initAllTasks() {
  //   try {
  //     this.tasks = await this.ts.getAllTodos();
  //     console.log(this.tasks);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }


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

}
