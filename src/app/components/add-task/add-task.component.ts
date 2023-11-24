import { Component, OnInit } from '@angular/core';
import { TodoService } from 'src/app/shared/services/todo.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { TodoData } from 'src/app/shared/todo-interface';


@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {
onSubmitAndNavigate() {
throw new Error('Method not implemented.');
}
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
    private ts: TodoService,
    private fb: FormBuilder,
    private router: Router) {
  }


  ngOnInit() {
    this.initFormGroup();
  }


  initFormGroup() {
    this.todoForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      due_date: ['', Validators.required],
      category: ['', Validators.required],
      priority: ('medium'),
      status: ('todo'),
      assigned_to: this.fb.array([], Validators.required),
      subtasks: this.fb.array([])
    });
  }


  async onSubmit() {
    if (this.todoForm.valid) {
      try {
        const formData:TodoData = this.todoForm.value;
        await this.ts.createTodo(formData);
        this.router.navigateByUrl('/summary');
      } catch (err) {
        console.error(err);
      }
    }
  }

}
