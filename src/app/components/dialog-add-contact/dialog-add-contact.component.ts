import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ContactService } from 'src/app/shared/services/contact.service';
import { ContactData } from 'src/app/shared/task-interface';

@Component({
  selector: 'app-dialog-add-contact',
  templateUrl: './dialog-add-contact.component.html',
  styleUrls: ['./dialog-add-contact.component.scss']
})
export class DialogAddContactComponent implements OnInit {
  contactForm!: FormGroup;
  submitted = false;


  constructor(
    private formBuilder: FormBuilder,
    private contactService: ContactService,
    private dialogRef: MatDialogRef<DialogAddContactComponent>) { }


  ngOnInit(): void {
    this.initFormGroup();
  }


  /**
   * Initializes the contact form group with fields and validators.
   * Sets up form fields 'firstname' and 'lastname' as required.
   * Includes an email field with required and email format validators.
   * Phone and color fields are optional, with a default value for color.
   */
  initFormGroup() {
    this.contactForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      color: ['#000000']
    });
  }


  /**
   * Handles the submission of the contact form.
   * Sets a flag indicating the form has been submitted.
   * If the contactForm is valid, attempts to create a new contact using the form data.
   * Closes the dialog and returns true on successful creation.
   * In case of an error, the HttpErrorInterceptor triggers the dialog-error-component with the error message
   * and logs the error in the console.
   */
  async onSubmit() {
    this.submitted = true;
    if (this.contactForm.invalid) {
      return;
    }

    try {
      const formData: ContactData = this.contactForm.value;
      await this.contactService.createContact(formData);
      this.contactService.notifyContactUpdate();
      this.dialogRef.close(true);
    } catch (err) {
      console.error('Could not create contact!', err);
    }
  }


  /**
   * Close the dialog-add-contact.
   */
  closeDialogAddContact() {
    this.dialogRef.close();
  }

}
