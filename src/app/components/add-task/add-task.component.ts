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
  submitted = false;
  tasks: TodoData[] = [];
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
    this.catService.getCategoriesUpdateListener().subscribe(() => {
      this.initAllCategories();
      this.selectedCategory = null;
    });
    this.minDate = new Date().toISOString().split('T')[0];
  }


  ngOnInit() {
    this.initFormGroup();
    this.initCategoryGroup();
    this.initAllTasks();
    this.initAllCategories();
    this.initAllContacts();
    this.windowWidth = window.innerWidth
  }


  /**
   * Handles window resize events.
   * Updates the `windowWidth` property of the component with the current inner width of the window.
   * This function is triggered automatically whenever the window is resized.
   */
  @HostListener('window:resize')
  onResize() {
    this.windowWidth = window.innerWidth;
  }


  /**
   * Initializes the category form group.
   * Creates a form group with 'name' and 'color' fields using FormBuilder.
   * The 'name' field is an empty string by default and is required.
   * The 'color' field defaults to '#000000' (black) and is also required.
   */
  initCategoryGroup() {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      color: ['#000000', Validators.required]
    });
  }



  /**
   * Initializes the task form group.
   * Sets up form fields for a task with validators where necessary.
   * Fields include 'title', 'description', 'due_date', 'category', each marked as required.
   * 'priority' defaults to 'low', and 'status' defaults to 'todo'.
   * 'assigned_to' is an array field with a required validator.
   * 'subtasks' is an array field with no initial validators.
   */
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


  /**
   * Asynchronously initializes all tasks.
   * Attempts to fetch all tasks from the backend using `ts.getAllTodos()` and assigns them to `this.tasks`.
   * In case of an error, the HttpErrorInterceptor triggers the dialog-error-component with the error message.
   */
  async initAllTasks() {
    try {
      this.tasks = await this.ts.getAllTodos();
    } catch (err) {
    }
  }



  /**
   * Asynchronously initializes all categories.
   * Fetches categories from the backend using `catService.loadAllCategories()` and assigns them to `this.categories`.
   * In case of an error, the HttpErrorInterceptor triggers the dialog-error-component with the error message.
   */
  async initAllCategories() {
    try {
      this.categories = await this.catService.loadAllCategories();
    } catch (err) {
    }
  }


  /**
   * Asynchronously initializes all contacts.
   * Fetches contacts from the backend using `catService.loadAllContacts()` and assigns them to `this.contacts`.
   * In case of an error, the HttpErrorInterceptor triggers the dialog-error-component with the error message.
   */
  async initAllContacts() {
    try {
      this.contacts = await this.contService.loadAllContacts();
    } catch (err) {
    }
  }


  /**
   * Sets the priority of a task.
   * Updates the 'priority' field in the task form with the given priority value.
   * Also sets boolean flags for 'prioUrgent', 'prioMedium', and 'prioLow' based on the priority.
   * 
   * @param priority - The priority value to set ('urgent', 'medium', or 'low').
   */
  setPriority(priority: string) {
    this.taskForm.get('priority')?.setValue(priority);

    this.prioUrgent = priority === 'urgent';
    this.prioMedium = priority === 'medium';
    this.prioLow = priority === 'low';
  }


  /**
   * Adds a subtask to the task form.
   * If the provided subtask title is not empty, it creates a new subtask form group 
   * with the title and a 'check' (default is false). 
   * This subtask is then added to the 'subtasks' FormArray in the task form.
   *
   * @param subtaskTitle - The title of the subtask to be added.
   */
  addSubtask(subtaskTitle: string) {
    if (subtaskTitle !== '') {
      const subtask = this.taskForm.get('subtasks') as FormArray;
      subtask.push(this.fb.group({
        title: [subtaskTitle],
        check: [false]
      }));
    }
  }


  /**
   * Removes a subtask from the task form's subtasks array at the specified index.
   *
   * @param index - The index of the subtask to be removed from the subtasks FormArray.
   */
  removeSubtask(index: number) {
    const subtask = this.taskForm.get('subtasks') as FormArray;
    subtask.removeAt(index);
  }



  /**
   * Getter for the 'subtasks' FormArray from the task form.
   * Returns the FormArray containing the subtasks of the task.
   *
   * @returns FormArray of subtasks.
   */
  get subtasks(): FormArray {
    return this.taskForm.get('subtasks') as FormArray;
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
   * Handles the selection of a category from the category menu.
   * Sets the 'category' field in the task form to the selected category's ID.
   * Updates the selectedCategory with the chosen category and closes the category menu.
   *
   * @param category - The CategoryData object representing the selected category.
   */
  clickOnCategory(category: CategoryData) {
    const categoryForm = this.taskForm.get('category') as FormControl;
    if (categoryForm) {
      categoryForm.setValue(category.id);
      this.selectedCategory = category;
      this.categoryMenu = false;
    }
  }


  /**
   * Asynchronously creates a new category.
   * If the categoryForm is valid, it sends the form data to the category service
   * to create a new category. Upon successful creation, it updates the selectedCategory
   * with the new category data and reinitializes all categories.
   * In case of an error, the HttpErrorInterceptor triggers the dialog-error-component with the error message.
   */
  async createNewCategory() {
    if (this.categoryForm.valid) {
      try {
        const categoryData: CategoryData = this.categoryForm.value;
        await this.catService.createCategory(categoryData)
        this.selectedCategory = categoryData;
        this.initAllCategories();
      } catch (err) {
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


  /**
   * Checks if a contact is already selected in the 'assigned_to' FormArray.
   * Returns true if the contact's ID is found in the FormArray, indicating it's selected.
   *
   * @param contact - The ContactData object to check for selection.
   * @returns boolean - True if the contact is selected, false otherwise.
   */
  isSelected(contact: ContactData) {
    const assignedTo = this.taskForm.get('assigned_to') as FormArray;
    return assignedTo.controls.some(control => control.value === contact.id);
  }


  /**
   * Clears all selections in the 'assigned_to' FormArray and closes the assigned-to menu.
   * This function is used to reset the state of task assignment selections.
   */
  cancelSelection() {
    const assignedTo = this.taskForm.get('assigned_to') as FormArray;
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
   * Asynchronously handles the submission of the task form.
   * Sets a flag to indicate the form has been submitted.
   * If the task form is invalid or a category is not selected, the submission is aborted.
   * Otherwise, it proceeds to call `submitTask` to handle the actual submission process.
   */
  async onSubmit() {
    this.submitted = true;
    if (this.taskForm.invalid && !this.selectedCategory) return;
    await this.submitTask();
  }


  /**
   * Asynchronously submits the task form data.
   * Attempts to create a new todo item using the form data.
   * On successful submission, it calls `handleTaskSuccess` to manage post-submission behavior.
   * In case of an error, the HttpErrorInterceptor triggers the dialog-error-component with the error message.
   */
  async submitTask() {
    try {
      const formData: TodoData = this.taskForm.value;
      await this.ts.createTodo(formData);
      this.handleTaskSuccess();
    } catch (err) {
    }
  }


  /**
   * Manages the interface and navigation after successful task addition.
   * Disables the submission button and shows a success message.
   * Navigates to the '/board' route after a delay of 3000 milliseconds.
   */
  handleTaskSuccess() {
    this.isButtonDisabled = true;
    this.taskAddedInfo = true;
    setTimeout(() => this.router.navigate(['/board']), 3000);
  }


  /**
   * Gtriggers the onSubmit process.
   */
  onSubmitAndNavigate() {
    this.onSubmit();
  }


  /**
   * Resets the task form and related component properties.
   * @param $event - The MouseEvent that triggered this function.
   */
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
