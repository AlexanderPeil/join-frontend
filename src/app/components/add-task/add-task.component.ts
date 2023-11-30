import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { TodoService } from 'src/app/shared/services/todo.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { CategoryData, ContactData, TodoData } from 'src/app/shared/todo-interface';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ContactService } from 'src/app/shared/services/contact.service';


@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {
  @ViewChild('handleCategoryMenu') handleCategoryMenu!: ElementRef;
  @ViewChild('handleASsignedToMenu') handleASsignedToMenu!: ElementRef;
  todoForm!: FormGroup;
  categoryForm!: FormGroup;
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
  newSubtaskTitle = '';


  constructor(
    private ts: TodoService,
    private catService: CategoryService,
    private contService: ContactService,
    private fb: FormBuilder,
    private router: Router,
    private elRef: ElementRef) {
  }


  ngOnInit() {
    this.initFormGroup();
    this.initCategoryGroup();
    this.initAllTasks();
    this.initAllCategories();
    this.initAllContacts();
  }

  initCategoryGroup() {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      color: ['', Validators.required]
    })
  }


  initFormGroup() {
    this.todoForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      due_date: ['', Validators.required],
      category: ['', Validators.required],
      priority: 'medium',
      status: 'todo',
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


  setPriority(priority: string) {
    this.todoForm.get('priority')?.setValue(priority);

    this.prioUrgent = priority === 'urgent';
    this.prioMedium = priority === 'medium';
    this.prioLow = priority === 'low';
  }



  addSubtask(subtaskTitle: string) {
    const subtask = this.todoForm.get('subtasks') as FormArray;
    subtask.push(this.fb.group({
      title: [subtaskTitle],
      check: [false]
    }));
  }


  removeSubtask(index: number) {
    const subtask = this.todoForm.get('subtasks') as FormArray;
    subtask.removeAt(index);
  }


  get subtasks(): FormArray {
    return this.todoForm.get('subtasks') as FormArray;
  }



  async onSubmit() {
    if (this.todoForm.valid) {
      try {
        const formData: TodoData = this.todoForm.value;
        await this.ts.createTodo(formData);
      } catch (err) {
        console.error(err);
      }
    }
  }


  onSubmitAndNavigate() {
    // this.onSubmit();
    // this.router.navigate(['/board']);
  }


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.categoryMenu && !this.handleCategoryMenu.nativeElement.contains(event.target)) {
      this.categoryMenu = false;
    }

    if (this.assignedToMenu && !this.handleASsignedToMenu.nativeElement.contains(event.target)) {
      this.assignedToMenu = false;
    }
  }


  toggleCategoryMenu(event: Event) {
    event.stopPropagation();
    this.categoryMenu = !this.categoryMenu;
  }


  closeCategoryMenu(event: MouseEvent) {
    event.stopPropagation();
    this.categoryMenu = false;
  }

  createCategory() {
    // create category in db
    // this.scrumCat.create(this.categoryForm.value);
  }


  clickOnCategory(cat: CategoryData) {
    const categoryForm = this.todoForm.get('category') as FormControl;
    if (categoryForm) {
      categoryForm.setValue(cat.id);
      this.selectedCategory = cat;
      this.categoryMenu = false;
    }
  }


  categorySelected() {
    let categoryValue = this.todoForm.get('category.name')?.value;
    let colorValue = this.todoForm.get('category.color')?.value;

    if (categoryValue && colorValue) {
      let newCategory = {
        name: categoryValue,
        color: colorValue
      };
      this.selectedCategory = newCategory;
    } else {
      console.error('Please select a category and a color.');
    }
  }

  selectContact(contact: ContactData) {
    const assignedTo = this.todoForm.get('assigned_to') as FormArray;

    if (this.isSelected(contact)) {
      const index = assignedTo.controls.findIndex(control => control.value === contact.id);
      if (index !== -1) {
        assignedTo.removeAt(index);
      }
    } else {
      assignedTo.push(this.fb.control(contact.id));
    }
  }


  isSelected(contact: ContactData) {
    const assignedTo = this.todoForm.get('assigned_to') as FormArray;
    return assignedTo.controls.some(control => control.value === contact.id);
  }


  cancelSelection() {
    const assignedTo = this.todoForm.get('assigned_to') as FormArray;
    assignedTo.clear();
    this.assignedToMenu = false;
  }


  membersSelected() {
    this.assignedToMenu = false;
    this.feedbackMessageMembers = 'Members selected';
    setTimeout(() => {
      this.feedbackMessageMembers = 'Select your Members';
    }, 2000);
  }


  toggleAssignedToMenu(event: Event) {
    event.stopPropagation();
    this.assignedToMenu = !this.assignedToMenu;
  }


  onClear($event: MouseEvent) {

  }

}
