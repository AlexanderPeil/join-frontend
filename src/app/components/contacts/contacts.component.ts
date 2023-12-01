import { Component, OnInit } from '@angular/core';
import { CategoryData, ContactData, TodoData } from 'src/app/shared/todo-interface';
import { ContactService } from 'src/app/shared/services/contact.service';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogEditContactComponent } from '../dialog-edit-contact/dialog-edit-contact.component';
import { DialogAddContactComponent } from '../dialog-add-contact/dialog-add-contact.component';
import { DialogAddTaskComponent } from '../dialog-add-task/dialog-add-task.component';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  contacts: ContactData[] = [];
  selectedContact: ContactData | null = null;

  constructor(
    private contService: ContactService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
  ) { }



  ngOnInit(): void {
    this.initAllContacts();
  }


  async initAllContacts() {
    try {
      this.contacts = await this.contService.loadAllContacts();
    } catch (err) {
      console.error('Could not load contacts in add-task.comp', err);
    }
  }


  selectContact(contact: ContactData) {
    this.selectedContact = contact;
  }


  editContact(contactId: number) {
    const dialogRef = this.dialog.open(DialogEditContactComponent, {
      data: { contactId: contactId }
    });
    dialogRef.afterClosed().subscribe(updatedContact => {
      if (updatedContact) {
        this.updateContactInList(updatedContact);
        this.updateSelectedContact(updatedContact);
      }
    });
  }


  updateSelectedContact(updatedContact: ContactData) {
    if (this.selectedContact && this.selectedContact.id === updatedContact.id) {
      this.selectedContact = updatedContact;
    }
  }


  updateContactInList(updatedContact: ContactData) {
    const index = this.contacts.findIndex(contact => contact.id === updatedContact.id);
    if (index !== -1) {
      this.contacts[index] = updatedContact;
    }
  }


  addContact() {
    const dialogRef = this.dialog.open(DialogAddContactComponent, {
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.initAllContacts();
      }
    });

  }



  async deleteContact(contactId: number) {
    if (contactId) {
      try {
        await this.contService.deleteContact(contactId);
        this.initAllContacts();
        this.selectedContact = null;
      } catch (err) {
        console.error(err);
      }
    }
  }


  openDialogAddTask(contactId: number) {
    const dialogRef = this.dialog.open(DialogAddTaskComponent, {
      data: { contactId: contactId }
    });
  }

}
