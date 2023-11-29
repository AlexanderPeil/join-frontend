import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContactService } from 'src/app/shared/services/contact.service';
import { CategoryData, ContactData, TodoData } from 'src/app/shared/todo-interface';

@Component({
  selector: 'app-dialog-edit-contact',
  templateUrl: './dialog-edit-contact.component.html',
  styleUrls: ['./dialog-edit-contact.component.scss']
})
export class DialogEditContactComponent implements OnInit {
  contact!: ContactData;
  editForm!: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<DialogEditContactComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private contService: ContactService,
    private fb: FormBuilder) { }


  ngOnInit(): void {
    this.loadContactsById();
    this.initFormGroup();
  }


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
      console.error('Error loading contact', error);
    }
  }


  initFormGroup() {
    this.editForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      color: ['']
    });
  }


  async onSubmit() {
    if (this.editForm.valid) {
      try {
        const formData: ContactData = this.editForm.value;
        const updatedContact = await this.contService.updateContact(this.data.contactId, formData);
        this.dialogRef.close(updatedContact);
      } catch (err) {
        console.error(err);
      }
    }
  }


  closeDialogEditContact() {
    this.dialogRef.close();
  }

}
