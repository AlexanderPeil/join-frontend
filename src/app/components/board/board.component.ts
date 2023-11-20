import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AuthService } from "../../shared/services/auth.service";
import { TodoService } from 'src/app/shared/services/todo.service';


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  tasks: TodoData[] = [];


  constructor(private ts: TodoService) {

  }


  ngOnInit(): void {
    this.initAllTasks();
  }


  async initAllTasks() {
    try {
      this.tasks = await this.ts.getAllTodos();
      console.log(this.tasks);
    } catch(err) {
      console.error(err);
      
    }
     
  }

}
