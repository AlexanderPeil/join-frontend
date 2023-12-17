import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { TaskService } from 'src/app/shared/services/task.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { CategoryData, ContactData, TaskData } from 'src/app/shared/task-interface';
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
  tasks: TaskData[] = [];
  categoryForm!: FormGroup;
  categoryMenu = false;
  categories: CategoryData[] = [];
  categoryAlreadyExist!: boolean;
  submitted = false;
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
  windowWidth!: number;
  newSubtaskTitle = '';
  taskAddedInfo!: boolean;
  isButtonDisabled = false;


  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private contService: ContactService,
    private formBuilder: FormBuilder,
    private router: Router,
    public dialog: MatDialog) {
    this.categoryService.getCategoriesUpdateListener().subscribe(() => {
      this.initAllCategories();
      this.selectedCategory = null;
    });
    this.minDate = new Date().toISOString().split('T')[0];
  }


  ngOnInit() {
    this.initCategoryGroup();
    this.initFormGroup();
    this.initAllCategories();
    this.initAllContacts();
    this.windowWidth = window.innerWidth
  }


  /**
   * Handles window resize events (in the onInit).
   * Updates the `windowWidth` property of the component with the current inner width of the window.
   * This function is triggered automatically whenever the window is resized.
   */
  @HostListener('window:resize')
  onResize() {
    this.windowWidth = window.innerWidth;
  }


  /**
   * Initializes the category form with default values and validators (in the onInit).
   * The form includes 'name' and 'color' fields, both required.
   */
  initCategoryGroup() {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      color: ['#000000', Validators.required]
    });
  }



  /**
   * Initializes the task form group (in the onInit).
   * Sets up form fields for a task with validators where necessary.
   * All fields except 'priority' and 'subtasks' are required.
   */
  initFormGroup() {
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      due_date: ['', Validators.required],
      category: ['', Validators.required],
      priority: 'low',
      status: 'todo',
      assigned_to: this.formBuilder.array([], Validators.required),
      subtasks: this.formBuilder.array([])
    });
  }


  /**
   * Asynchronously retrieves all categories (in the onInit).
   * Uses `loadAllCategories` from the categoryService to fetch categories.
   * In case of an error, the HttpErrorInterceptor triggers the dialog-error-component with the error message
   * and logs the error in the console.
   */
  async initAllCategories() {
    try {
      this.categories = await this.categoryService.loadAllCategories();
    } catch (err) {
      console.error('Could not load categories!', err);
    }
  }


  /**
   * Asynchronously fetches all contacts (in the onInit).
   * Retrieves contacts using `loadAllContacts` from the contService.
   * In case of an error, the HttpErrorInterceptor triggers the dialog-error-component with the error message
   * and logs the error in the console
   */
  async initAllContacts() {
    try {
      this.contacts = await this.contService.loadAllContacts();
    } catch (err) {
      console.error('Could not load contacts!', err);
    }
  }


  /**
   * Sets the priority of a task in the task form and updates priority flags.
   * Updates the task form's 'priority' field and sets boolean flags for 'urgent', 'medium', and 'low' priorities.
   *
   * @param {string} priority - The priority level to be set ('urgent', 'medium', 'low').
   */
  setPriority(priority: string) {
    this.taskForm.get('priority')?.setValue(priority);

    this.prioUrgent = priority === 'urgent';
    this.prioMedium = priority === 'medium';
    this.prioLow = priority === 'low';
  }


  /**
    * Adds a new subtask to the task form's 'subtasks' array.
    * Only adds the subtask if the provided title is not empty.
    * Each subtask includes a title and a 'check' flag, initially set to false.
    *
    * @param {string} subtaskTitle - The title of the subtask to be added.
    */
  addSubtask(subtaskTitle: string) {
    if (subtaskTitle !== '') {
      const subtask = this.taskForm.get('subtasks') as FormArray;
      subtask.push(this.formBuilder.group({
        title: [subtaskTitle],
        check: [false]
      }));
    }
  }


  /**
   * Removes a subtask from the task form's 'subtasks' array at the specified index.
   *
   * @param {number} index - The index of the subtask to be removed.
   */
  removeSubtask(index: number) {
    const subtask = this.taskForm.get('subtasks') as FormArray;
    subtask.removeAt(index);
  }



  /**
   * Getter for the 'subtasks' form array from the task form.
   * Returns the FormArray instance corresponding to 'subtasks'.
   *
   * @returns {FormArray} The FormArray instance for 'subtasks'.
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
   * Validates the form, checks for the category's existence, and then creates the category using the categoryService.
   * Updates the selectedCategory and refreshes all categories upon successful creation.
   * Sets a temporary flag 'categoryAlreadyExist' if the category already exists.
   */
  async createNewCategory() {
    if (this.categoryForm.valid) {
      const categoryData: CategoryData = this.categoryForm.value;

      if (!this.categoryExists(categoryData.name)) {
        try {
          await this.categoryService.createCategory(categoryData);
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
   * Updates the selectedCategory based on the current values of the category name and color in the task form.
   * Retrieves the category name and color from the form and sets selectedCategory if both are present.
   * Logs an error to the console if either the category name or color is not selected.
   */
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
      assignedTo.push(this.formBuilder.control(contact.id));
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
   * Attempts to create a new task item using the form data.
   * On successful submission, it calls `handleTaskSuccess` to manage post-submission behavior.
   * In case of an error, the HttpErrorInterceptor triggers the dialog-error-component with the error message
   * and logs the error in the console.
   */
  async submitTask() {
    try {
      const formData: TaskData = this.taskForm.value;
      await this.taskService.createTask(formData);
      this.handleTaskSuccess();
    } catch (err) {
      console.error('Could not create taks!', err);
    }
  }


  /**
   * Manages the interface and navigation after successful task addition.
   * Disables the submission button and shows a success message.
   * Navigates to the 'board' route after a delay of 3000 milliseconds.
   */
  handleTaskSuccess() {
    this.isButtonDisabled = true;
    this.taskAddedInfo = true;
    setTimeout(() => this.router.navigate(['/board']), 3000);
  }


  /**
   * Triggers the onSubmit process.
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
