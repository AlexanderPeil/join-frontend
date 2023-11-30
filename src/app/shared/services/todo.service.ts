import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TodoData } from '../todo-interface';



@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(private http: HttpClient) { }


  createTodo(todoData: TodoData) {
    const url = environment.baseUrl + '/tasks/';
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return lastValueFrom(this.http.post<TodoData>(url, todoData, { headers: headers }));
  }


  updateTodo(todoId: number, updatedData: Partial<TodoData>) {
    const url = `${environment.baseUrl}/tasks/${todoId}/`;
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return lastValueFrom(this.http.patch<TodoData>(url, updatedData, { headers: headers }));
  }


  deleteTask(taskId: number) {
    const url = `${environment.baseUrl}/tasks/${taskId}/`;
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return lastValueFrom(this.http.delete<TodoData>(url, { headers: headers }));
  }


  getAllTodos() {
    const url = environment.baseUrl + '/tasks/';
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return lastValueFrom(this.http.get<TodoData[]>(url, { headers: headers }));
  }


  getTaskById(id: number): Promise<TodoData> {
    const url = `${environment.baseUrl}/tasks/${id}/`;
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return lastValueFrom(this.http.get<TodoData>(url, { headers }));
  }

}
