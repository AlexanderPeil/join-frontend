import { Component, OnInit } from '@angular/core';
import { TodoService } from 'src/app/shared/services/todo.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { CategoryData, ContactData, TodoData } from 'src/app/shared/todo-interface';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ContactService } from 'src/app/shared/services/contact.service';


@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {
  todoForm!: FormGroup;
  tasks: TodoData[] = [];
  categories: CategoryData[] = [];
  contacts: ContactData[] = [];


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
    private catService: CategoryService,
    private contService: ContactService,
    private fb: FormBuilder,
    private router: Router) {
  }


  ngOnInit() {
    this.initFormGroup();
    this.initAllTasks();
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


  async initAllTasks() {
    try {
      this.tasks = await this.ts.getAllTodos();
      console.log(this.tasks);
    } catch (err) {
      console.error('Could not load tasks to add-task.comp!', err);
    }
  }


  async initAllCategories() {
    try {
      this.categories = await this.catService.loadAllCategories();
      console.log(this.categories);
    } catch (err) {
      console.error('Could not load catgeories in add-task.comnp', err);
    }
  }


  async initAllContacts() {
    try {
      this.contacts = await this.contService.loadAllContacts();
      console.log(this.contacts);
    } catch (err) {
      console.error('Could not load contacts in add-task.comp', err);
    }
  }


  async onSubmit() {
    if (this.todoForm.valid) {
      try {
        const formData: TodoData = this.todoForm.value;
        await this.ts.createTodo(formData);
        this.router.navigateByUrl('/summary');
      } catch (err) {
        console.error(err);
      }
    }
  }


  onSubmitAndNavigate() {

  }


  clickOnCategory(category: CategoryData) {

  }


  selectContact(contact: ContactData) {

  }


  cancelSelection() {

  }


  membersSelected() {

  }


  isSelected(contact: ContactData): any {

  }


  toggleAssignedToMenu() {

  }

}
