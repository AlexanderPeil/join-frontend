import { Component, OnInit } from '@angular/core';
import { TodoService } from 'src/app/shared/services/todo.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';


@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {
  todoForm!: FormGroup;
  subtaskInput: boolean = false;
  selectedCategory: any;
  taskAdded: boolean = false;
  taskCreationError: boolean = false;
  prioUrgent: boolean = false;
  prioMedium: boolean = false;
  prioLow: boolean = true;
  minDate!: string;
  categoryMenu = false;
  assignedToMenu = false;
  feedbackMessageMembers = 'Select your Members';
  createdSubtasks: string[] = [];
  loading: boolean = false;


  constructor(
    private todoService: TodoService,
    private router: Router) {
  }


  ngOnInit() {
    this.initializeForm();
  }


  initializeForm() {
    this.todoForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      due_date: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      priority: new FormControl('medium'),
      status: new FormControl('todo'),
      assigned_to: new FormArray([]),
      subtasks: new FormArray([])
    });
  }


  async onSubmit() {
    if (this.todoForm.valid) {
      try {
        const formData:TodoData = this.todoForm.value;
        await this.todoService.createTodo(formData);
        this.router.navigateByUrl('/summary');
      } catch (err) {
        console.error(err);
      }
    }
  }

}
