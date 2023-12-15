import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContactService } from 'src/app/shared/services/contact.service';
import { ContactData } from 'src/app/shared/todo-interface';

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
    private fb: FormBuilder) { }


  ngOnInit(): void {
    this.loadContactsById();
    this.initFormGroup();
  }


  /**
   * Asynchronously loads a contact by its ID and updates the edit form with the contact's details.
   * Fetches the contact data using the `getContactById` method of the contService.
   * Patches the edit form with the contact's information if successfully retrieved.
   * In case of an error, the HttpErrorInterceptor triggers the dialog-error-component with the error message.
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
    }
  }


  /**
   * Initializes the edit form with form controls and validation rules.
   * The form includes 'firstname', 'lastname', 'email', 'phone', and 'color' fields.
   * 'firstname', 'lastname', and 'email' are required fields, with 'email' also requiring a valid email format.
   * 'phone' and 'color' have default values but no validation requirements.
   */
  initFormGroup() {
    this.editForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      color: ['#000000']
    });
  }


  /**
   * Handles the submission of the edit form.
   * Sets the 'submitted' flag to true and checks for form validity.
   * If valid, it sends the form data for updating the contact using the contService.
   * Closes the dialog with the updated contact data on success.
   * In case of an error, the HttpErrorInterceptor triggers the dialog-error-component with the error message.
   */
  async onSubmit() {
    this.submitted = true;

    if (this.editForm.invalid) {
      return;
    }

    try {
      const formData: ContactData = this.editForm.value;
      const updatedContact = await this.contService.updateContact(this.data.contactId, formData);
      this.dialogRef.close(updatedContact);
    } catch (err) {
      console.error(err);
    }
  }


  /**
   * Closes the dialog-edit-contact.
   */
  closeDialogEditContact() {
    this.dialogRef.close();
  }

}
