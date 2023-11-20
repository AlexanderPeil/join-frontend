import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(private http: HttpClient) { }


  createTodo(todoData: TodoData) {
    const url = environment.baseUrl + '/todos/';
    const body = {todoData};
    return lastValueFrom(this.http.post<TodoData>(url, body));
  }


  getAllTodos() {
    const url = environment.baseUrl + '/todos/';
    return lastValueFrom(this.http.get<TodoData[]>(url));
  }

}
