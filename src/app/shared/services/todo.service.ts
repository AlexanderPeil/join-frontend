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


  /**
   * Creates a new todo task.
   *
   * Constructs a URL for creating a new todo task using the base URL from the environment configuration.
   * Sets an 'Authorization' header with a token from localStorage for authenticated access. Sends the 
   * `taskData` containing details of the new task as a POST request. Utilizes `lastValueFrom` to convert
   * the Observable to a Promise, which resolves with the created TodoData object.
   *
   * @param taskData - TodoData object containing information about the new task.
   * @returns A Promise resolving with the TodoData object of the newly created task.
   */
  createTodo(taskData: TodoData) {
    const url = environment.baseUrl + '/tasks/';
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return lastValueFrom(this.http.post<TodoData>(url, taskData, { headers: headers }));
  }


  /**
   * Updates an existing todo task with new data.
   *
   * Forms a URL targeting a specific task using its `taskId`, based on the base URL 
   * from the environment configuration. Sets an 'Authorization' header with a token 
   * from localStorage for authentication. Sends the `updatedData` as a PATCH request 
   * to modify the existing task. Converts the Observable to a Promise using 
   * `lastValueFrom`, which resolves with the updated TodoData object.
   *
   * @param taskId - The unique identifier of the task to be updated.
   * @param updatedData - Partial<TodoData> object containing updated information for the task.
   * @returns A Promise resolving with the updated TodoData object.
   */
  updateTodo(taskId: number, updatedData: Partial<TodoData>) {
    const url = `${environment.baseUrl}/tasks/${taskId}/`;
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return lastValueFrom(this.http.patch<TodoData>(url, updatedData, { headers: headers }));
  }


  /**
   * Creates a new subtask for a specific todo task.
   *
   * Constructs a URL to add a subtask to a specified task using the `taskId`, based on the base URL 
   * from the environment configuration. Sets an 'Authorization' header using a token from localStorage 
   * for secure access. Sends the `subtaskData` containing the details of the new subtask as a POST 
   * request. Utilizes `lastValueFrom` to convert the Observable to a Promise.
   *
   * @param taskId - The unique identifier of the parent task to which the subtask will be added.
   * @param subtaskData - SubtaskData object containing information about the new subtask.
   * @returns A Promise resolving with the response from the server.
   */
  createSubtask(taskId: number, subtaskData: SubtaskData) {
    const url = `${environment.baseUrl}/tasks/${taskId}/subtasks/`;
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return lastValueFrom(this.http.post(url, subtaskData, { headers }));
  }


  /**
   * Updates an existing subtask with new data.
   *
   * Forms a URL targeting a specific subtask of a task using both `taskId` and `subtaskId`, 
   * based on the base URL from the environment configuration. Sets an 'Authorization' header 
   * with a token from localStorage for authentication. Sends the `updatedData` for the subtask 
   * as a PATCH request to update its details. Utilizes `lastValueFrom` to convert the Observable 
   * to a Promise, which resolves with the server's response.
   *
   * @param taskId - The unique identifier of the parent task.
   * @param subtaskId - The unique identifier of the subtask to be updated.
   * @param updatedData - SubtaskData object containing the updated information for the subtask.
   * @returns A Promise resolving with the response for the update request.
   */
  updateSubtask(taskId: number, subtaskId: number, updatedData: SubtaskData) {
    const url = `${environment.baseUrl}/tasks/${taskId}/subtasks/${subtaskId}/`;
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return lastValueFrom(this.http.patch(url, updatedData, { headers }));
  }


  /**
   * Calculates the count of total and checked subtasks for a given task.
   *
   * Determines the total number of subtasks and the number of completed (checked) subtasks 
   * within the given task. This method is useful for displaying summary information about 
   * the progress of a task based on its subtasks.
   *
   * @param task - A TodoData object representing the task whose subtasks are to be counted.
   * @returns An object with two properties: 'total' indicating the total number of subtasks, 
   *          and 'checked' indicating the number of subtasks that are marked as completed.
   */
  getSubtaskCountsForTask(task: TodoData): { total: number, checked: number } {
    const totalSubtasks = task.subtasks.length;
    const checkedSubtasks = task.subtasks.filter(st => st.checked).length;
    return {
      total: totalSubtasks,
      checked: checkedSubtasks
    };
  }


  /**
   * Deletes a specific subtask of a task.
   *
   * Constructs a URL targeting a subtask using both `taskId` and `subtaskId`, based on the base URL 
   * from the environment configuration. Sets an 'Authorization' header with a token from localStorage 
   * for authentication. Sends a DELETE request to remove the specified subtask. Utilizes 
   * `lastValueFrom` to convert the Observable to a Promise, which resolves with the updated TodoData 
   * object reflecting the deletion.
   *
   * @param taskId - The unique identifier of the parent task.
   * @param subtaskId - The unique identifier of the subtask to be deleted.
   * @returns A Promise resolving with the updated TodoData object post deletion.
   */
  deleteSubtask(taskId: number, subtaskId: number) {
    const url = `${environment.baseUrl}/tasks/${taskId}/subtasks/${subtaskId}/`;
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return lastValueFrom(this.http.delete<TodoData>(url, { headers: headers }));
  }


  /**
   * Deletes a specific task by its identifier.
   *
   * Forms a URL to target the task using the provided `taskId`, based on the base URL from the
   * environment configuration. Sets an 'Authorization' header with a token from localStorage for
   * authentication. Sends a DELETE request to remove the specified task. Uses `lastValueFrom` to
   * convert the Observable to a Promise, which resolves with the TodoData object reflecting the
   * deletion.
   *
   * @param taskId - The unique identifier of the task to be deleted.
   * @returns A Promise resolving with the TodoData object post deletion.
   */
  deleteTask(taskId: number) {
    const url = `${environment.baseUrl}/tasks/${taskId}/`;
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return lastValueFrom(this.http.delete<TodoData>(url, { headers: headers }));
  }


  /**
   * Retrieves all todo tasks from the server.
   *
   * Constructs a URL to fetch all todo tasks using the base URL from the environment configuration.
   * Sets an 'Authorization' header with a token from localStorage for secure access. Makes a GET
   * request to retrieve an array of TodoData objects representing all tasks. Utilizes `lastValueFrom`
   * to convert the returned Observable into a Promise.
   *
   * @returns A Promise resolving with an array of TodoData objects, representing all todo tasks.
   */
  getAllTodos() {
    const url = environment.baseUrl + '/tasks/';
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return lastValueFrom(this.http.get<TodoData[]>(url, { headers: headers }));
  }


  /**
   * Fetches a specific todo task by its unique identifier.
   *
   * Constructs a URL targeting the task using the provided `id`, based on the base URL 
   * from the environment configuration. An 'Authorization' header is set with a token 
   * from localStorage for secure access. Makes a GET request to retrieve the task data 
   * as a TodoData object. Utilizes `lastValueFrom` to convert the Observable into a Promise.
   *
   * @param id - The unique identifier of the todo task to be retrieved.
   * @returns A Promise resolving with the TodoData object for the requested task.
   */
  getTaskById(id: number): Promise<TodoData> {
    const url = `${environment.baseUrl}/tasks/${id}/`;
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return lastValueFrom(this.http.get<TodoData>(url, { headers }));
  }


  /**
   * Notifies subscribers about an update of the tasks.
   *
   * Triggers the `next` method on the `taskUpdated` Subject, signaling to all subscribers 
   * that there has been an update in the task list. This method is used after adding, 
   * or updating task data, to inform components or services that are observing 
   * `taskUpdated`.
   */
  notifyTaskUpdate() {
    this.taskUpdated.next();
  }


  /**
   * Provides an Observable for task updates.
   *
   * Returns an Observable derived from the `taskUpdated` Subject, allowing components and 
   * services to subscribe to updates o the tasks. This is for reacting to changes 
   * additions or modifications in the task data.
   *
   * @returns An Observable that subscribers can use to be notified of updates of the tasks.
   */
  getTaskUpdateListener() {
    return this.taskUpdated.asObservable();
  }

}
