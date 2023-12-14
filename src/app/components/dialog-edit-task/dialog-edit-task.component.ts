import { Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { TodoService } from 'src/app/shared/services/todo.service';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CategoryData, ContactData, SubtaskData, TodoData } from 'src/app/shared/todo-interface';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ContactService } from 'src/app/shared/services/contact.service';
import { DialogHandleCategoriesComponent } from '../dialog-handle-categories/dialog-handle-categories.component';

@Component({
  selector: 'app-dialog-edit-task',
  templateUrl: './dialog-edit-task.component.html',
  styleUrls: ['./dialog-edit-task.component.scss']
})
export class DialogEditTaskComponent implements OnInit {
  @ViewChild('handleCategoryMenu') handleCategoryMenu!: ElementRef;
  @ViewChild('handleASsignedToMenu') handleASsignedToMenu!: ElementRef;
  todoForm!: FormGroup;
  categoryForm!: FormGroup;
  task!: TodoData;
  categories: CategoryData[] = [];
  contacts: ContactData[] = [];
  subtaskInput: boolean = false;
  selectedCategory: any;
  prioUrgent: boolean = false;
  prioMedium: boolean = false;
  prioLow: boolean = true;
  minDate!: string;
  categoryMenu = false;
  assignedToMenu = false;
  feedbackMessageMembers = 'Select your Members';
  createdSubtasks: string[] = [];
  newSubtaskTitle = '';


  constructor(
    private ts: TodoService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<DialogEditTaskComponent>,
    private catService: CategoryService,
    private contService: ContactService
  ) { }


  ngOnInit(): void {
    this.initFormGroup();
    this.initCategoryGroup();
    this.loadtaskbyId();
    this.initAllCategories();
    this.initAllContacts();
    this.ts.getTaskUpdateListener().subscribe(() => {
      this.loadtaskbyId();
    });
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


  async loadtaskbyId() {
    try {
      const task = await this.ts.getTaskById(this.data.taskId);
      this.task = task;
      this.todoForm.patchValue({
        title: task.title,
        description: task.description,
        due_date: task.due_date,
        category: task.category.id,
        priority: task.priority,
        status: task.status,
        subtasks: task.subtasks
      });
      const assignedToFormArray = this.todoForm.get('assigned_to') as FormArray;
      assignedToFormArray.clear();
      task.assigned_to.forEach((contact) => {
        assignedToFormArray.push(this.fb.control(contact.id));
      });
    } catch (err) {
      console.error(err);
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
    this.todoForm.get('priority')?.setValue(priority);

    this.prioUrgent = priority === 'urgent';
    this.prioMedium = priority === 'medium';
    this.prioLow = priority === 'low';
  }


  addSubtask(subtaskTitle: string) {
    const newSubtaskData = { title: subtaskTitle, check: false };
    this.addSubtaskToDb(newSubtaskData);

    const subtasks = this.todoForm.get('subtasks') as FormArray;
    subtasks.push(this.fb.group(newSubtaskData));
    this.ts.notifyTaskUpdate();
  }


  async deleteCurrentSubtask(subtaskId: number) {
    if (subtaskId) {
      try {
        await this.ts.deleteSubtask(this.task.id, subtaskId);
        this.ts.notifyTaskUpdate();
      } catch (err) {
        console.error(err);
      }
    }
  }


  get subtasks(): FormArray {
    return this.todoForm.get('subtasks') as FormArray;
  }


  async addSubtaskToDb(subtaskData: SubtaskData) {
    try {
      await this.ts.createSubtask(this.data.taskId, subtaskData);
      this.ts.notifyTaskUpdate();
    } catch (err) {
      console.error(err);
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


  async createNewCategory() {
    if (this.categoryForm.valid) {
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


  closeDialogEditTask() {
    this.dialogRef.close();
  }


  async onSubmit() {
    if (this.todoForm.valid) {
      try {
        const formData: TodoData = this.todoForm.value;
        await this.ts.updateTodo(this.data.taskId, formData);
        this.ts.notifyTaskUpdate();
      } catch (err) {
        console.error(err);
      }
    }
  }


  onSubmitAndNavigate() {
    this.onSubmit();
    if (this.todoForm.valid) {
      this.dialogRef.close();
    }
  }


  onClear() {
    this.dialogRef.close();
  }

}
