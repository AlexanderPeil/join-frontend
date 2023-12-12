import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ContactService } from 'src/app/shared/services/contact.service';
import { ContactData } from 'src/app/shared/todo-interface';

@Component({
  selector: 'app-dialog-add-contact',
  templateUrl: './dialog-add-contact.component.html',
  styleUrls: ['./dialog-add-contact.component.scss']
})
export class DialogAddContactComponent implements OnInit {
  contactForm!: FormGroup;
  submitted = false;


  constructor(
    private fb: FormBuilder,
    private contService: ContactService,
    private dialogRef: MatDialogRef<DialogAddContactComponent>) { }


  ngOnInit(): void {
    this.initFormGroup();
  }


  initFormGroup() {
    this.contactForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      color: ['#000000']
    });
  }


  async onSubmit() {
    this.submitted = true;

    if (this.contactForm.invalid) {
      return;
    }

    try {
      const formData: ContactData = this.contactForm.value;
      await this.contService.createContact(formData);
      this.dialogRef.close(true);
    } catch (err) {
      console.error(err);
    }
  }


  closeDialogAddContact() {
    this.dialogRef.close();
  }

}
