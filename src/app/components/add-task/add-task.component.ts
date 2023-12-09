import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { TodoService } from 'src/app/shared/services/todo.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { CategoryData, ContactData, TodoData } from 'src/app/shared/todo-interface';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ContactService } from 'src/app/shared/services/contact.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogHandleCategoriesComponent } from '../dialog-handle-categories/dialog-handle-categories.component';



@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {
  @ViewChild('handleCategoryMenu') handleCategoryMenu!: ElementRef;
  @ViewChild('handleASsignedToMenu') handleASsignedToMenu!: ElementRef;

  taskForm!: FormGroup;
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
  windowWidth!: number;
  newSubtaskTitle = '';
  taskAddedInfo!: boolean;
  isButtonDisabled = false;


  constructor(
    private ts: TodoService,
    private catService: CategoryService,
    private contService: ContactService,
    private fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog) {
    this.minDate = new Date().toISOString().split('T')[0];
  }


  ngOnInit() {
    this.initFormGroup();
    this.initCategoryGroup();
    this.initAllTasks();
    this.initAllCategories();
    this.initAllContacts();
    this.catService.getCategoriesUpdateListener().subscribe(() => {
      this.initAllCategories();
      this.selectedCategory = null;
    });
    this.windowWidth = window.innerWidth
  }


  @HostListener('window:resize')
  onResize() {
    this.windowWidth = window.innerWidth;
  }


  initCategoryGroup() {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      color: ['#000000', Validators.required]
    })
  }


  initFormGroup() {
    this.taskForm = this.fb.group({
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
    this.taskForm.get('priority')?.setValue(priority);

    this.prioUrgent = priority === 'urgent';
    this.prioMedium = priority === 'medium';
    this.prioLow = priority === 'low';
  }



  addSubtask(subtaskTitle: string) {
    if (subtaskTitle != '') {
      const subtask = this.taskForm.get('subtasks') as FormArray;
      subtask.push(this.fb.group({
        title: [subtaskTitle],
        check: [false]
      }));
    }
  }


  removeSubtask(index: number) {
    const subtask = this.taskForm.get('subtasks') as FormArray;
    subtask.removeAt(index);
  }


  get subtasks(): FormArray {
    return this.taskForm.get('subtasks') as FormArray;
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


  clickOnCategory(category: CategoryData) {
    const categoryForm = this.taskForm.get('category') as FormControl;
    if (categoryForm) {
      categoryForm.setValue(category.id);
      this.selectedCategory = category;
      this.categoryMenu = false;
    }
  }


  async createNewCategory() {
    if (this.categoryForm.valid) {
      console.log('CategoryForm is Valid!');
      try {
        const categoryData: CategoryData = this.categoryForm.value;
        await this.catService.createCategory(categoryData)
        this.selectedCategory = categoryData;
        this.initAllCategories();
      } catch (err) {
        console.error(err);
      }
    }
  }


  openDialogHandleCategories(categoryId: number, event: MouseEvent): void {
    event.stopPropagation();
    this.dialog.open(DialogHandleCategoriesComponent, {
      data: { categoryId }
    });
  }


  selectContact(contact: ContactData) {
    const assignedTo = this.taskForm.get('assigned_to') as FormArray;

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
    const assignedTo = this.taskForm.get('assigned_to') as FormArray;
    return assignedTo.controls.some(control => control.value === contact.id);
  }


  cancelSelection() {
    const assignedTo = this.taskForm.get('assigned_to') as FormArray;
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


  async onSubmit() {
    if (this.taskForm.valid) {
      try {
        const formData: TodoData = this.taskForm.value;
        await this.ts.createTodo(formData);
        this.isButtonDisabled = true;
        this.taskAddedInfo = true;
        setTimeout(() => {
          this.router.navigate(['/board']);
        }, 3000);
      } catch (err) {
        console.error(err);
      }
    }
  }


  onSubmitAndNavigate() {
    this.onSubmit();
  }


  onClear($event: MouseEvent) {
    this.taskForm.reset();
    this.feedbackMessageMembers = 'Select your Members';
    this.selectedCategory = null;
    this.categoryMenu = false;
    this.assignedToMenu = false;
    this.createdSubtasks = [];
    this.prioUrgent = false;
    this.prioMedium = false;
    this.prioLow = true;
    this.subtaskInput = false;
    const subtask = this.taskForm.get('subtasks') as FormArray;
    subtask.clear();
  }

}
