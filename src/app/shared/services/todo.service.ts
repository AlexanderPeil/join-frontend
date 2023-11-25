import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { TodoData } from '../todo-interface';



@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(private http: HttpClient) { }


  createTodo(todoData: TodoData) {
    const url = environment.baseUrl + '/tasks/';
    const body = { todoData };
    return lastValueFrom(this.http.post<TodoData>(url, body));
  }


  editTodo() {

  }


  deleteTodo() {

  }


  getAllTodos() {
    const url = environment.baseUrl + '/tasks/';
    return lastValueFrom(this.http.get<TodoData[]>(url));
  }

}
