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
  categories: CategoryData[] = [];
  selectedCategory: any;
  categoryMenu = false;
  categoryAlreadyExist!: boolean;
  task!: TodoData;
  contacts: ContactData[] = [];
  subtaskInput: boolean = false;
  prioUrgent: boolean = false;
  prioMedium: boolean = false;
  prioLow: boolean = false;
  minDate!: string;
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
    this.loadTaskById();
    this.initAllCategories();
    this.initAllContacts();
    this.taskUpdateListener();
  }


  /**
   * Sets up a subscription to listen for task updates.
   * When a task update is received, it calls `loadtaskbyId()` to refresh the task data.
   */
  taskUpdateListener() {
    this.ts.getTaskUpdateListener().subscribe(() => {
      this.loadTaskById();
    });
  }


  /**
   * Initializes the category form with validation rules.
   * The form consists of 'name' and 'color' fields, both of which are required.
   */
  initCategoryGroup() {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      color: ['', Validators.required]
    })
  }


  /**
   * Initializes the todo form with necessary fields and default values.
   * Fields include title, description, due_date, category, priority, status, assigned_to, and subtasks.
   * All fields except 'priority' and 'subtasks' are required.
   */
  initFormGroup() {
    this.todoForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      due_date: ['', Validators.required],
      category: ['', Validators.required],
      priority: '',
      status: 'todo',
      assigned_to: this.fb.array([], Validators.required),
      subtasks: this.fb.array([])
    });
  }


  /**
   * Asynchronously loads a task by its ID and updates the form and assigned users.
   * Retrieves the task data using `getTaskById` from the task service.
   * Upon successful retrieval, updates the form with task details and the assigned users.
   * In case of an error, the HttpErrorInterceptor triggers the dialog-error-component with the error message
   * and logs the error in the console. 
   */
  async loadTaskById() {
    try {
      const task = await this.ts.getTaskById(this.data.taskId);
      this.task = task;
      this.updateFormWithTask(task);
      this.updateAssignedTo(task.assigned_to);
    } catch (err) {
      console.error('Could not load task!', err);
    }
  }


  /**
   * Updates the todo form with values from a given task.
   * Patches the todo form with task details including title, description, due date, category, priority, status, and subtasks.
   * Also updates the UI to show the current priority of the task.
   *
   * @param {TodoData} task - The task data used to update the form.
   */
  updateFormWithTask(task: TodoData) {
    this.todoForm.patchValue({
      title: task.title,
      description: task.description,
      due_date: task.due_date,
      category: task.category.id,
      priority: task.priority,
      status: task.status,
      subtasks: task.subtasks
    });
    this.showCurrentTaskPrio(task.priority);
  }


  /**
   * Updates the 'assigned_to' form array in the todo form with given contact data.
   * Clears the existing 'assigned_to' form array and repopulates it with the IDs of the provided contacts.
   *
   * @param {ContactData[]} assignedTo - An array of contact data to update the 'assigned_to' field.
   */
  updateAssignedTo(assignedTo: ContactData[]) {
    const assignedToFormArray = this.todoForm.get('assigned_to') as FormArray;
    assignedToFormArray.clear();
    assignedTo.forEach(contact => {
      assignedToFormArray.push(this.fb.control(contact.id));
    });
  }


  /**
   * Sets the appropriate priority flag based on the given priority level.
   * Updates flags for 'low', 'medium', and 'urgent' priorities based on the input.
   *
   * @param {string} prio - The priority level ('low', 'medium', 'urgent') of the task.
   */
  showCurrentTaskPrio(prio: string) {
    this.prioLow = prio === 'low';
    this.prioMedium = prio === 'medium';
    this.prioUrgent = prio === 'urgent';
  }


  /**
   * Asynchronously retrieves and initializes all categories.
   * Fetches categories using the `loadAllCategories` method from the catService.
   * In case of an error, the HttpErrorInterceptor triggers the dialog-error-component with the error message
   * and logs the error in the console. 
   */
  async initAllCategories() {
    try {
      this.categories = await this.catService.loadAllCategories();
    } catch (err) {
      console.error('Could not load categories!', err);
    }
  }


  /**
   * Asynchronously loads all contacts.
   * Retrieves the contacts using `loadAllContacts` from the contService.
   * In case of an error, the HttpErrorInterceptor triggers the dialog-error-component with the error message
   * and logs the error in the console. 
   */
  async initAllContacts() {
    try {
      this.contacts = await this.contService.loadAllContacts();
    } catch (err) {
      console.error('Could not load contacts!', err);
    }
  }


  /**
   * Sets the priority of a task in the todo form and updates priority state flags.
   * Updates the todo form's 'priority' field and sets boolean flags for 'urgent', 'medium', and 'low' priorities.
   *
   * @param {string} priority - The priority level to be set ('urgent', 'medium', 'low').
   */
  setPriority(priority: string) {
    this.todoForm.get('priority')?.setValue(priority);

    this.prioUrgent = priority === 'urgent';
    this.prioMedium = priority === 'medium';
    this.prioLow = priority === 'low';
  }

  /**
   * Adds a new subtask to the todo form and updates the database.
   * Creates a subtask object with the provided title and a default 'check' value set to false.
   * Calls `addSubtaskToDb` to update the subtask in the database.
   * Pushes the new subtask into the 'subtasks' form array and notifies about the task update.
   *
   * @param {string} subtaskTitle - The title of the subtask to be added.
   */
  addSubtask(subtaskTitle: string) {
    const newSubtaskData = { title: subtaskTitle, check: false };
    this.addSubtaskToDb(newSubtaskData);

    const subtasks = this.todoForm.get('subtasks') as FormArray;
    subtasks.push(this.fb.group(newSubtaskData));
    this.ts.notifyTaskUpdate();
  }


  /**
   * Asynchronously deletes a subtask by its ID.
   * If a valid subtaskId is provided, it calls the deleteSubtask method from the task service.
   * Notifies about the task update after successful deletion.
   * In case of an error, the HttpErrorInterceptor triggers the dialog-error-component with the error message
   * and logs the error in the console. 
   *
   * @param {number} subtaskId - The ID of the subtask to be deleted.
   */
  async deleteCurrentSubtask(subtaskId: number) {
    if (subtaskId) {
      try {
        await this.ts.deleteSubtask(this.task.id, subtaskId);
        this.ts.notifyTaskUpdate();
      } catch (err) {
        console.error('Could not delete subtask!', err);
      }
    }
  }


  /**
   * Getter for the 'subtasks' form array from the todo form.
   * Returns the FormArray instance corresponding to 'subtasks'.
   *
   * @returns {FormArray} The FormArray instance for 'subtasks'.
   */
  get subtasks(): FormArray {
    return this.todoForm.get('subtasks') as FormArray;
  }


  /**
   * Asynchronously adds a subtask to the database.
   * Calls the createSubtask method from the task service with the current task's ID and subtask data.
   * Notifies about the task update after successfully adding the subtask.
   * In case of an error, the HttpErrorInterceptor triggers the dialog-error-component with the error message
   * and logs the error in the console. 
   *
   * @param {SubtaskData} subtaskData - The data of the subtask to be added.
   */
  async addSubtaskToDb(subtaskData: SubtaskData) {
    try {
      await this.ts.createSubtask(this.data.taskId, subtaskData);
      this.ts.notifyTaskUpdate();
    } catch (err) {
      console.error('Could not add subtask!', err);
    }
  }


  /**
   * Handles click events on the document.
   * Closes the category menu and assigned-to menu if the click is outside their respective elements.
   *
   * @param event - The click event captured on the document.
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.categoryMenu && !this.handleCategoryMenu.nativeElement.contains(event.target)) {
      this.categoryMenu = false;
    }

    if (this.assignedToMenu && !this.handleASsignedToMenu.nativeElement.contains(event.target)) {
      this.assignedToMenu = false;
    }
  }


  /**
   * Toggles the visibility of the category menu.
   * Prevents the click event from propagating further.
   *
   * @param event - The click event that triggered this function.
   */
  toggleCategoryMenu(event: Event) {
    event.stopPropagation();
    this.categoryMenu = !this.categoryMenu;
  }


  /**
   * Closes the category menu.
   * Stops the mouse event from propagating to prevent triggering other click events.
   *
   * @param event - The MouseEvent that triggered this function.
  */
  closeCategoryMenu(event: MouseEvent) {
    event.stopPropagation();
    this.categoryMenu = false;
  }


  /**
   * Closes the category menu.
   * Stops the mouse event from propagating to prevent triggering other click events.
   *
   * @param event - The MouseEvent that triggered this function.
  */
  clickOnCategory(cat: CategoryData) {
    const categoryForm = this.todoForm.get('category') as FormControl;
    if (categoryForm) {
      categoryForm.setValue(cat.id);
      this.selectedCategory = cat;
      this.categoryMenu = false;
    }
  }


  /**
   * Updates the selectedCategory based on the current values of the category name and color in the task form.
   * Retrieves the category name and color from the form and sets selectedCategory if both are present.
   * In case of an error, the HttpErrorInterceptor triggers the dialog-error-component with the error message.
   */
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
    }
  }


  /**
   * Checks if a category with the given name already exists in the categories list.
   * Compares the provided name with existing category names in a case-insensitive manner.
   *
   * @param name - The name of the category to check for existence.
   * @returns boolean - True if the category exists, false otherwise.
   */
  categoryExists(name: string): boolean {
    return this.categories.some(category => category.name.toLowerCase() === name.toLowerCase());
  }


  /**
   * Creates a new category if the category form is valid and the category does not already exist.
   * Validates the form, checks for the category's existence, and then creates the category using the catService.
   * Updates the selectedCategory and refreshes all categories upon successful creation.
   * Sets a temporary flag 'categoryAlreadyExist' if the category already exists.
   */
  async createNewCategory() {
    if (this.categoryForm.valid) {
      const categoryData: CategoryData = this.categoryForm.value;

      if (!this.categoryExists(categoryData.name)) {
        try {
          await this.catService.createCategory(categoryData);
          this.selectedCategory = categoryData;
          await this.initAllCategories();
        } catch (err) {
          console.error('Could not create category!', err);
        }
      } else {
        this.categoryAlreadyExist = true;
        setTimeout(() => {
          this.categoryAlreadyExist = false;
        }, 2500);
      }
    }
  }


  /**
   * Opens a dialog for handling category-related operations.
   * Prevents the mouse event from propagating to avoid unintended interactions.
   * Passes the specified categoryId to the DialogHandleCategoriesComponent.
   *
   * @param categoryId - The ID of the category to be handled in the dialog.
   * @param event - The MouseEvent that triggered this function.
   */
  openDialogHandleCategories(categoryId: number, event: MouseEvent): void {
    event.stopPropagation();
    this.dialog.open(DialogHandleCategoriesComponent, {
      data: { categoryId }
    });
  }


  /**
    * Toggles the selection of a contact for assignment.
    * If the contact is already selected, it is removed from the 'assigned_to' FormArray.
    * If the contact is not selected, it is added to the 'assigned_to' FormArray.
    *
    * @param contact - The ContactData object representing the contact to be toggled.
    */
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


  /**
   * Checks if a contact is already selected in the 'assigned_to' FormArray.
   * Returns true if the contact's ID is found in the FormArray, indicating it's selected.
   *
   * @param contact - The ContactData object to check for selection.
   * @returns boolean - True if the contact is selected, false otherwise.
   */
  isSelected(contact: ContactData) {
    const assignedTo = this.todoForm.get('assigned_to') as FormArray;
    return assignedTo.controls.some(control => control.value === contact.id);
  }


  /**
   * Clears all selections in the 'assigned_to' FormArray and closes the assigned-to menu.
   * This function is used to reset the state of task assignment selections.
   */
  cancelSelection() {
    const assignedTo = this.todoForm.get('assigned_to') as FormArray;
    assignedTo.clear();
    this.assignedToMenu = false;
  }


  /**
   * Handles the event after members are selected.
   * Closes the assigned-to menu and displays a temporary feedback message.
   * The feedback message changes back after a delay of 2000 milliseconds.
   */
  membersSelected() {
    this.assignedToMenu = false;
    this.feedbackMessageMembers = 'Members selected';
    setTimeout(() => {
      this.feedbackMessageMembers = 'Select your Members';
    }, 2000);
  }


  /**
   * Toggles the visibility of the assigned-to menu.
   * Prevents the event from propagating to other elements.
   *
   * @param event - The Event that triggered this function.
   */
  toggleAssignedToMenu(event: Event) {
    event.stopPropagation();
    this.assignedToMenu = !this.assignedToMenu;
  }


  /**
   * Closes the dialog-edit-task
   */
  closeDialogEditTask() {
    this.dialogRef.close();
  }


  /**
   * Handles the submission of the todo form.
   * Checks for form validity and then attempts to update the todo item using the task service.
   * Notifies about the task update after successful submission.
   * In case of an error, the HttpErrorInterceptor triggers the dialog-error-component with the error message 
   * and logs it in the console.
   */
  async onSubmit() {
    if (this.todoForm.valid) {
      try {
        const formData: TodoData = this.todoForm.value;
        await this.ts.updateTodo(this.data.taskId, formData);
        this.ts.notifyTaskUpdate();
      } catch (err) {
        console.error('Could not create category!', err);
      }
    }
  }


  /**
   * Executes the onSubmit method and closes the dialog if the todo form is valid.
   * Calls onSubmit to handle form submission, and then closes the dialog upon successful submission.
   */
  onSubmitAndNavigate() {
    this.onSubmit();
    if (this.todoForm.valid) {
      this.dialogRef.close();
    }
  }


  /**
   * Closes the dialog
   */
  onClear() {
    this.dialogRef.close();
  }

}
