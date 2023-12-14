import { Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { TodoService } from 'src/app/shared/services/todo.service';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { CategoryData, ContactData, TodoData } from 'src/app/shared/todo-interface';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ContactService } from 'src/app/shared/services/contact.service';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogHandleCategoriesComponent } from '../dialog-handle-categories/dialog-handle-categories.component';


@Component({
  selector: 'app-dialog-add-task',
  templateUrl: './dialog-add-task.component.html',
  styleUrls: ['./dialog-add-task.component.scss']
})
export class DialogAddTaskComponent implements OnInit {
  @ViewChild('handleCategoryMenu') handleCategoryMenu!: ElementRef;
  @ViewChild('handleASsignedToMenu') handleASsignedToMenu!: ElementRef;

  taskForm!: FormGroup;
  categoryForm!: FormGroup;
  categories: CategoryData[] = [];
  categoryMenu = false;
  categoryAlreadyExist!: boolean;
  submitted = false;
  tasks: TodoData[] = [];
  contacts: ContactData[] = [];
  subtaskInput: boolean = false;
  selectedCategory: any;
  prioUrgent: boolean = false;
  prioMedium: boolean = false;
  prioLow: boolean = true;
  minDate!: string;
  assignedToMenu = false;
  feedbackMessageMembers = 'Select your Members';
  createdSubtasks: string[] = [];
  isButtonDisabled!: boolean;
  taskAddedInfo!: boolean;
  newSubtaskTitle = '';
  currentStatus!: string;
  currentContactId!: number;


  constructor(
    private ts: TodoService,
    private catService: CategoryService,
    private contService: ContactService,
    private fb: FormBuilder,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<DialogAddTaskComponent>,) {
    this.minDate = new Date().toISOString().split('T')[0];
  }


  ngOnInit() {
    this.getCurrentStatus();
    this.getContactId();
    this.initFormGroup();
    this.initAllTasks();
    this.initAllCategories();
    this.initAllContacts();
    this.initCategoryGroup();
    this.preselectContact();
    this.catService.getCategoriesUpdateListener().subscribe(() => {
      this.initAllCategories();
      this.selectedCategory = null;
    });
  }


  initCategoryGroup() {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      color: ['#000000', Validators.required]
    })
  }


  getCurrentStatus() {
    if (this.data.status) {
      this.currentStatus = this.data.status;
    } else {
      this.currentStatus = 'todo';
    }
  }


  getContactId() {
    if (this.data.contactId) {
      this.currentContactId = this.data.contactId;
    }
  }


  initFormGroup() {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      due_date: ['', Validators.required],
      category: ['', Validators.required],
      priority: 'low',
      status: 'todo',
      assigned_to: this.fb.array([], Validators.required),
      subtasks: this.fb.array([])
    });
  }


  async initAllTasks() {
    try {
      this.tasks = await this.ts.getAllTodos();
    } catch (err) {
      console.error('Could not load tasks to add-task.comp!', err);
    }
  }


  async initAllCategories() {
    try {
      this.categories = await this.catService.loadAllCategories();
    } catch (err) {
      console.error('Could not load catgeories in add-task.comnp', err);
    }
  }


  async initAllContacts() {
    try {
      this.contacts = await this.contService.loadAllContacts();
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


  preselectContact() {
    if (this.currentContactId) {
      const contactToPreselect = this.contacts.find(contact => contact.id === this.currentContactId);
      if (contactToPreselect) {
        this.selectContact(contactToPreselect);
      } else {
        const assignedTo = this.taskForm.get('assigned_to') as FormArray;
        assignedTo.push(this.fb.control(this.currentContactId));
      }
    }
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


  openDialogHandleCategories(categoryId: number, event: MouseEvent): void {
    event.stopPropagation();
    this.dialog.open(DialogHandleCategoriesComponent, {
      data: { categoryId }
    });
  }


  clickOnCategory(cat: CategoryData) {
    const categoryForm = this.taskForm.get('category') as FormControl;
    if (categoryForm) {
      categoryForm.setValue(cat.id);
      this.selectedCategory = cat;
      this.categoryMenu = false;
    }
  }


  categoryExists(name: string): boolean {
    return this.categories.some(category => category.name.toLowerCase() === name.toLowerCase());
  }


  async createNewCategory() {
    if (this.categoryForm.valid) {
      const categoryData: CategoryData = this.categoryForm.value;

      if (!this.categoryExists(categoryData.name)) {
        try {
          await this.catService.createCategory(categoryData);
          this.selectedCategory = categoryData;
          await this.initAllCategories();
        } catch (err) {
        }
      } else {
        this.categoryAlreadyExist = true;
        setTimeout(() => {
          this.categoryAlreadyExist = false;
        }, 2500);
      }
    }
  }


  categorySelected() {
    let categoryValue = this.taskForm.get('category.name')?.value;
    let colorValue = this.taskForm.get('category.color')?.value;

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


  closeDialogAddTask() {
    this.dialogRef.close();
  }


  async onSubmit() {
    this.submitted = true;

    if (this.taskForm.invalid && !this.selectedCategory) {
      return;
    }

    try {
      const formData: TodoData = this.taskForm.value;
      await this.ts.createTodo(formData);
      this.isButtonDisabled = true;
      this.taskAddedInfo = true;
      setTimeout(() => {
        this.dialogRef.close();
        this.router.navigate(['/board']);
        this.ts.notifyTaskUpdate();
      }, 3000);
    } catch (err) {
      console.error(err);
    }
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
    this.submitted = false;
    subtask.clear();
  }

}
