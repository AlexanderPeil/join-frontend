import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
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
    private router: Router,
    private elRef: ElementRef) {
  }


  ngOnInit() {
    this.initFormGroup();
    this.initAllTasks();
    this.initAllCategories();
    this.initAllContacts();
  }


  initFormGroup() {
    this.todoForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      due_date: ['', Validators.required],
      category: this.fb.group({
        name: ['', Validators.required],
        color: ''
      }),
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
  


  addSubtask() {
    const subtask = this.todoForm.get('subtasks') as FormArray;
    subtask.push(this.fb.group({
      title: [''],
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
        this.router.navigateByUrl('/summary');
      } catch (err) {
        console.error(err);
      }
    }
  }


  onSubmitAndNavigate() {

  }


  // @HostListener('document:click', ['$event'])
  // onClick(event: MouseEvent) {
  //   if (!this.elRef.nativeElement.contains(event.target) && this.categoryMenu) {
  //     this.categoryMenu = false;
  //   }
  // }


  toggleCategoryMenu() {
    this.categoryMenu = !this.categoryMenu;
  }


  closeCategoryMenu(event: MouseEvent) {
    event.stopPropagation();
    this.categoryMenu = false;
  }


  clickOnCategory(cat: CategoryData) {
    const categoryForm = this.todoForm.get('category') as FormGroup;
    if (categoryForm) {
      categoryForm.get('name')!.setValue(cat.name);
      categoryForm.get('color')!.setValue(cat.color);
      this.selectedCategory = cat;
      this.categoryMenu = false;
    }
  }


  categorySelected() {
    let categoryValue = this.todoForm.get('category.category')?.value;
    let colorValue = this.todoForm.get('category.color')?.value;

    if (categoryValue && colorValue) {
      let newCategory = {
        name: categoryValue,
        color: colorValue
      };
      // this.saveCategory(newCategory);
      this.selectedCategory = newCategory;
      this.toggleCategoryMenu();
    } else {
      console.error('Please select a category and a color.');
    }
  }


  selectContact(contact: ContactData) {
    const assignedTo = this.todoForm.get('assigned_to') as FormArray;

    if (this.isSelected(contact)) {
      const index = assignedTo.controls.findIndex((control) => {
        const assignedContact = control.value as ContactData;
        return (
          assignedContact.firstname === contact.firstname &&
          assignedContact.lastname === contact.lastname
        );
      });

      if (index !== -1) {
        assignedTo.removeAt(index);
      }
    } else {
      assignedTo.push(this.fb.group(contact));
    }
  }



  isSelected(contact: ContactData): boolean {
    const assignedTo = this.todoForm.get('assigned_to') as FormArray;
    return assignedTo.controls.some((control) => {
      const assignedContact = control.value as ContactData;
      return (
        assignedContact.firstname === contact.firstname &&
        assignedContact.lastname === contact.lastname
      );
    });
  }


  cancelSelection() {
    const assignedTo = this.todoForm.get('assigned_to') as FormArray;
    assignedTo.clear(); 
    this.toggleAssignedToMenu(); 
  }
  


  membersSelected() {
    this.toggleAssignedToMenu();
    this.feedbackMessageMembers = 'Members selected';
    setTimeout(() => {
      this.feedbackMessageMembers = 'Select your Members';
    }, 2000);
  }


  toggleAssignedToMenu() {
    this.assignedToMenu = !this.assignedToMenu;
  }


  onClear($event: MouseEvent) {

  }

}
