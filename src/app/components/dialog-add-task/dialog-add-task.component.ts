import { Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TaskService } from 'src/app/shared/services/task.service';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { CategoryData, ContactData, TaskData } from 'src/app/shared/task-interface';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ContactService } from 'src/app/shared/services/contact.service';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogHandleCategoriesComponent } from '../dialog-handle-categories/dialog-handle-categories.component';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-dialog-add-task',
  templateUrl: './dialog-add-task.component.html',
  styleUrls: ['./dialog-add-task.component.scss']
})
export class DialogAddTaskComponent implements OnInit, OnDestroy {
  @ViewChild('handleCategoryMenu') handleCategoryMenu!: ElementRef;
  @ViewChild('handleASsignedToMenu') handleASsignedToMenu!: ElementRef;

  taskForm!: FormGroup;
  categoryForm!: FormGroup;
  categories: CategoryData[] = [];
  categoryMenu = false;
  categoryAlreadyExist!: boolean;
  submitted = false;
  tasks: TaskData[] = [];
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
  categorySubscritpion!: Subscription;


  constructor(
    private taskService: TaskService,
    private catService: CategoryService,
    private contService: ContactService,
    private formBuilder: FormBuilder,
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
    this.initAllCategories();
    this.initAllContacts();
    this.initCategoryGroup();
    this.preselectContact();
    this.categoryUpdateListener();
  }


  /**
   * Initializes a subscription to category updates using `catService`.
   * On receiving updates, it refreshes the category list and resets the selected category.
   */
  categoryUpdateListener() {
    this.categorySubscritpion = this.catService.getCategoriesUpdateListener().subscribe(() => {
      this.initAllCategories();
      this.selectedCategory = null;
    });
  }


  /**
   * Initializes the category form with default values and validators.
   * The form includes 'name' and 'color' fields, both required.
   */
  initCategoryGroup() {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      color: ['#000000', Validators.required]
    })
  }


  /**
   * Sets the current status based on the provided data.
   * If 'status' exists in 'data', it is used; otherwise, defaults to 'todo'.
   */
  getCurrentStatus() {
    if (this.data.status) {
      this.currentStatus = this.data.status;
    } else {
      this.currentStatus = 'todo';
    }
  }


  /**
   * Assigns the currentContactId from the provided data if contact Id is available.
   */
  getContactId() {
    if (this.data.contactId) {
      this.currentContactId = this.data.contactId;
    }
  }


  /**
   * Initializes the task form with necessary fields and default values.
   * Fields include title, description, due_date, category, priority, status, assigned_to, and subtasks.
   * All fields except 'subtasks' are required (if the user doesn't select a value to priority and status
   * the default value will be used).
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
   * Asynchronously retrieves all categories.
   * Uses `loadAllCategories` from the catService to fetch categories.
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
   * Asynchronously fetches all contacts.
   * Retrieves contacts using `loadAllContacts` from the contService.
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
    if (subtaskTitle != '') {
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
   * Preselects a contact for assignment based on the currentContactId.
   * If a contact with the currentContactId is found, it is selected using selectContact method.
   * If not found, the currentContactId is added to the 'assigned_to' form array.
   */
  preselectContact() {
    if (this.currentContactId) {
      const contactToPreselect = this.contacts.find(contact => contact.id === this.currentContactId);
      if (contactToPreselect) {
        this.selectContact(contactToPreselect);
      } else {
        const assignedTo = this.taskForm.get('assigned_to') as FormArray;
        assignedTo.push(this.formBuilder.control(this.currentContactId));
      }
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
   * Handles the selection of a category from the category menu.
   * Sets the 'category' field in the task form to the selected category's ID.
   * Updates the selectedCategory with the chosen category and closes the category menu.
   *
   * @param category - The CategoryData object representing the selected category.
   */
  clickOnCategory(cat: CategoryData) {
    const categoryForm = this.taskForm.get('category') as FormControl;
    if (categoryForm) {
      categoryForm.setValue(cat.id);
      this.selectedCategory = cat;
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
   * Closes the dialog-add-task.
   */
  closeDialogAddTask() {
    this.dialogRef.close();
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
      console.error('Could not create task!', err);
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
    setTimeout(() => {
      this.dialogRef.close();
      this.router.navigate(['/board']);
      this.taskService.notifyTaskUpdate();
    }, 3000);
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


  ngOnDestroy() {
    this.categorySubscritpion?.unsubscribe();
  }

}
