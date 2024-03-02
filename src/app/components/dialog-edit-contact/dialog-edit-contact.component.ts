import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ContactService } from 'src/app/shared/services/contact.service';
import { ContactData } from 'src/app/shared/task-interface';
import { DialogErrorComponent } from '../dialog-error/dialog-error.component';

@Component({
  selector: 'app-dialog-edit-contact',
  templateUrl: './dialog-edit-contact.component.html',
  styleUrls: ['./dialog-edit-contact.component.scss']
})
export class DialogEditContactComponent implements OnInit {
  contact!: ContactData;
  editForm!: FormGroup;
  submitted = false;

  constructor(
    private dialogRef: MatDialogRef<DialogEditContactComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private contService: ContactService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog) { }


  ngOnInit(): void {
    this.loadContactsById();
    this.initFormGroup();
  }


  /**
   * Asynchronously loads a contact by its ID and updates the edit form with the contact's details.
   * Fetches the contact data using the `getContactById` method of the contService.
   * Patches the edit form with the contact's information if successfully retrieved.
   * In case of an error, the HttpErrorInterceptor triggers the dialog-error-component with the error message
   * and logs the error in the console.
   */
  async loadContactsById() {
    try {
      const contact = await this.contService.getContactById(this.data.contactId);
      this.contact = contact;
      this.editForm.patchValue({
        firstname: contact.firstname,
        lastname: contact.lastname,
        email: contact.email,
        phone: contact.phone || '',
        color: contact.color || '#000000'
      });
    } catch (error) {
      console.error('Could not load contact!', error);
      this.handleError();
    }
  }


  /**
   * Initializes the edit form with form controls and validation rules.
   * The form includes 'firstname', 'lastname', 'email', 'phone', and 'color' fields.
   * 'firstname', 'lastname', and 'email' are required fields, with 'email' also requiring a valid email format.
   * 'phone' and 'color' have default values but no validation requirements.
   */
  initFormGroup() {
    this.editForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      color: ['#000000']
    });
  }


  /**
   * Asynchronously sumbits the editForm.
   * Sets the 'submitted' flag to true and checks for form validity.
   * If valid, it sends the form data for updating the contact using the contService.
   * Closes the dialog with the updated contact data on success.
   * In case of an error, the HttpErrorInterceptor triggers the dialog-error-component with the error message
   * and logs the error in the console.
   */
  async onSubmit() {
    this.submitted = true;
    if (this.editForm.invalid) {
      return;
    }

    try {
      const formData: ContactData = this.editForm.value;
      const updatedContact = await this.contService.updateContact(this.data.contactId, formData);
      this.contService.notifyContactUpdate();
      this.dialogRef.close(updatedContact);
    } catch (err) {
      console.error('Could not create contact!', err);
      this.handleError();
    }
  }


  /**
   * Closes the dialog-edit-contact.
   */
  closeDialogEditContact() {
    this.dialogRef.close();
  }


  
  /**
  * Opens a dialog using DialogErrorComponent to show error messages in a unified manner.
  * @returns {void} Nothing is returned by this method.
   */
  handleError(): void {
    this.dialog.open(DialogErrorComponent, {
    });
  }

}
