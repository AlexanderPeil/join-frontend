import { Component, Inject, OnInit, LOCALE_ID } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TodoService } from 'src/app/shared/services/todo.service';
import { TodoData } from 'src/app/shared/todo-interface';


@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  greeting = '';
  firstname = '';
  tasks: TodoData[] = [];
  isMobile: boolean = false;
  showMobileGreet = false;
  urgentTasks: TodoData[] = [];
  nearestUrgentTaskDate: Date | undefined;

  constructor
    (private as: AuthService,
      private ts: TodoService) { }


  ngOnInit(): void {
    this.initAllTasks();
    this.checkWindowWidth();
    this.setUsername();
    this.setGreeting();
    this.checkMobile();
    this.getNearestUrgentTaskDate();
  }


  /**
   * Asynchronously initializes and loads all tasks.
   * Fetches tasks using the `getAllTodos` method from the task service.
   * In case of an error, the HttpErrorInterceptor triggers the dialog-error-component with the error message
   * and logs the error in the console.
   */
  async initAllTasks() {
    try {
      this.tasks = await this.ts.getAllTodos();
    } catch (err) {
      console.error('Could not load tasks!', err);
    }
  }


  /**
   * Checks the window width to determine if the current view is on a mobile device.
   * Sets the 'isMobile' flag based on the window's inner width being less than 1000 pixels.
   */
  private checkWindowWidth() {
    this.isMobile = window.innerWidth < 1000;
  }


  /**
   * Asynchronously retrieves the logged-in user's data and sets the username.
   * Fetches the user's information using `getLoggedUserData` from the authentication service.
   * Sets the 'firstname' property with the user's first name from the retrieved data.
   * In case of an error, the HttpErrorInterceptor triggers the dialog-error-component with the error message
   * and logs the error in the console.
   */
  async setUsername() {
    try {
      const userInfo = await this.as.getLoggedUserData();
      this.firstname = userInfo.first_name;
    } catch (error) {
      console.error('Error fetching user info', error);
    }
  }


  /**
   * Determines and sets the date of the nearest urgent task.
   * Calls `calculateNearestUrgentTaskDate` to compute the date and assigns it to `nearestUrgentTaskDate`.
   */
  getNearestUrgentTaskDate() {
    this.nearestUrgentTaskDate = this.calculateNearestUrgentTaskDate();
  }


  /**
   * Calculates the date of the nearest urgent task.
   * Maps each urgent task to its due date, then finds the earliest date among them.
   * Returns the earliest date as a Date object if there are urgent tasks; otherwise, returns undefined.
   *
   * @returns {Date | undefined} The nearest date of an urgent task, or undefined if no urgent tasks exist.
   */
  calculateNearestUrgentTaskDate(): Date | undefined {
    const urgentDates: Date[] = this.urgentTasks.map(task => new Date(task.due_date));
    if (urgentDates.length > 0) {
      const nearestTimestamp: number = Math.min(...urgentDates.map(date => date.getTime()));
      return new Date(nearestTimestamp);
    }
    return undefined;
  }


  /**
   * Checks if the current device is mobile and sets a greeting display flag accordingly.
   * If 'isMobile' is true, sets 'showMobileGreet' to true and then resets it after a delay.
   * The greeting display is automatically hidden after 3 seconds.
   */
  checkMobile() {
    if (this.isMobile) {
      this.showMobileGreet = true;
      setTimeout(() => this.showMobileGreet = false, 3000);
    }
  }


  /**
   * Sets a time-appropriate greeting based on the current hour of the day.
   * Assigns 'Good morning', 'Good afternoon', or 'Good evening' to 'greeting' depending on the time.
   */
  setGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) {
      this.greeting = 'Good morning';
    } else if (hour < 17) {
      this.greeting = 'Good afternoon';
    } else {
      this.greeting = 'Good evening';
    }
  }


  /**
   * Get all tasks.
   * @returns length of the tassks array.
   */
  getTotalTasks(): number {
    return this.tasks.length;
  }


  /**
   * Get all tasks with status "in_progress".
   * @returns filtered tasks by status "in_progress".
   */
  getTasksInProgress(): number {
    return this.tasks.filter(task => task.status === 'in_progress').length;
  }


  /**
   * Get all tasks with status "awaiting_feedback".
   * @returns filtered tasks by status "awaiting_feedback".
   */
  getTasksAwaitingFeedback(): number {
    return this.tasks.filter(task => task.status === 'awaiting_feedback').length;
  }


  /**
   * Get all tasks with status "todo".
   * @returns filtered tasks by status "todo".
   */
  getTasksTodo(): number {
    return this.tasks.filter(task => task.status === 'todo').length;
  }


  /**
   * Get all tasks with status "done".
   * @returns filtered tasks by status "done".
   */
  getTasksDone(): number {
    return this.tasks.filter(task => task.status === 'done').length;
  }


  /**
   * Get all tasks with priority "urgent".
   * @returns filtered tasks by priority "urgent".
   */
  getTasksUrgent(): number {
    return this.tasks.filter(task => task.priority === 'urgent').length;
  }


  /**
   * Formats the due date of the nearest urgent task.
   * Filters urgent tasks, sorts them by due date, and formats the date of the earliest task.
   * Returns the formatted date of the nearest urgent task, or a message if no urgent tasks are present.
   *
   * @returns {string} The formatted due date of the nearest urgent task, or 'No urgent tasks' if none exist.
   */
  formatNearestUrgentTaskDate(): string {
    const urgentTasksWithDueDate = this.tasks
      .filter(task => task.priority === 'urgent' && task.due_date);

    urgentTasksWithDueDate.sort((a, b) => {
      const dateA = new Date(a.due_date);
      const dateB = new Date(b.due_date);
      return dateA.getTime() - dateB.getTime();
    });

    const nextUrgentTask = urgentTasksWithDueDate[0];
    if (nextUrgentTask) {
      return this.formatDate(nextUrgentTask.due_date);
    } else {
      return 'No urgent tasks';
    }
  }


  /**
   * Formats a date into a more readable string.
   * Converts the input date into a local date string with a specified format.
   * The format includes the year, month (as its full name), and day.
   *
   * @param {Date | string} date - The date to be formatted, either as a Date object or a date string.
   * @returns {string} The formatted date string.
   */
  formatDate(date: Date | string): string {
    const d = new Date(date);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return d.toLocaleDateString(undefined, options);
  }

}
