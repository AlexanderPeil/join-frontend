import { Injectable } from '@angular/core';
import { Subject, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SubtaskData, TodoData } from '../todo-interface';



@Injectable({
  providedIn: 'root'
})
export class TodoService {
  taskUpdated = new Subject<void>();


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


  updateSubtaskCheck(tasks: number, subtaskId: number, updatedData: SubtaskData) {
    const url = `${environment.baseUrl}/tasks/${tasks}/subtasks/${subtaskId}/`; 
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return lastValueFrom(this.http.patch(url, updatedData, { headers }));
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


  notifyTaskUpdate() {
    this.taskUpdated.next();
  }


  getTaskUpdateListener() {
    return this.taskUpdated.asObservable();
  }


  getSubtaskCountsForTask(task: TodoData): { total: number, checked: number } {
    const totalSubtasks = task.subtasks.length;
    const checkedSubtasks = task.subtasks.filter(st => st.checked).length;
    return {
      total: totalSubtasks,
      checked: checkedSubtasks
    };
  }

}
