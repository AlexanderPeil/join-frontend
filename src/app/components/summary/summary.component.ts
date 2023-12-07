import { DatePipe } from '@angular/common';
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
      private ts: TodoService,
      @Inject(LOCALE_ID) private locale: string) { }


  ngOnInit(): void {
    this.initAllTasks();
    this.checkWindowWidth();
    this.setUsername();
    this.setGreeting();
    this.checkMobile();
    this.getNearestUrgentTaskDate();
  }


  async initAllTasks() {
    try {
      this.tasks = await this.ts.getAllTodos();
      console.log(this.tasks);
    } catch (err) {
      console.error('Could not load tasks to add-task.comp!', err);
    }
  }


  private checkWindowWidth() {
    this.isMobile = window.innerWidth < 1000;
  }


  async setUsername() {
    try {
      const userInfo = await this.as.getLoggedUserData();
      this.firstname = userInfo.first_name;
    } catch (error) {
      console.error('Error fetching user info', error);
    }
  }


  getNearestUrgentTaskDate() {
    this.nearestUrgentTaskDate = this.calculateNearestUrgentTaskDate();
  }


  calculateNearestUrgentTaskDate(): Date | undefined {
    const urgentDates: Date[] = this.urgentTasks.map(task => new Date(task.due_date));
    if (urgentDates.length > 0) {
      const nearestTimestamp: number = Math.min(...urgentDates.map(date => date.getTime()));
      return new Date(nearestTimestamp);
    }
    return undefined;
  }


  checkMobile() {
    if (this.isMobile) {
      this.showMobileGreet = true;
      setTimeout(() => this.showMobileGreet = false, 3000);
    }
  }


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


  getTotalTasks(): number {
    return this.tasks.length;
  }


  getTasksInProgress(): number {
    return this.tasks.filter(task => task.status === 'in_progress').length;
  }


  getTasksAwaitingFeedback(): number {
    return this.tasks.filter(task => task.status === 'awaiting_feedback').length;
  }


  getTasksTodo(): number {
    return this.tasks.filter(task => task.status === 'todo').length;
  }


  getTasksDone(): number {
    return this.tasks.filter(task => task.status === 'done').length;
  }

  getTasksUrgent(): number {
    return this.tasks.filter(task => task.priority === 'urgent').length;
  }


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


  formatDate(date: Date | string): string {
    const d = new Date(date);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return d.toLocaleDateString(undefined, options);
  }


}
