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


  createTodo(taskData: TodoData) {
    const url = environment.baseUrl + '/tasks/';
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return lastValueFrom(this.http.post<TodoData>(url, taskData, { headers: headers }));
  }


  updateTodo(taskId: number, updatedData: Partial<TodoData>) {
    const url = `${environment.baseUrl}/tasks/${taskId}/`;
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return lastValueFrom(this.http.patch<TodoData>(url, updatedData, { headers: headers }));
  }


  createSubtask(taskId: number, subtaskData: SubtaskData) {
    const url = `${environment.baseUrl}/tasks/${taskId}/subtasks/`;
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return lastValueFrom(this.http.post(url, subtaskData, { headers }));
  }


  updateSubtask(taskId: number, subtaskId: number, updatedData: SubtaskData) {
    const url = `${environment.baseUrl}/tasks/${taskId}/subtasks/${subtaskId}/`;
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return lastValueFrom(this.http.patch(url, updatedData, { headers }));
  }


  getSubtaskCountsForTask(task: TodoData): { total: number, checked: number } {
    const totalSubtasks = task.subtasks.length;
    const checkedSubtasks = task.subtasks.filter(st => st.checked).length;
    return {
      total: totalSubtasks,
      checked: checkedSubtasks
    };
  }


  deleteSubtask(taskId: number, subtaskId: number) {
    const url = `${environment.baseUrl}/tasks/${taskId}/subtasks/${subtaskId}/`;
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return lastValueFrom(this.http.delete<TodoData>(url, { headers: headers }));
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

}
