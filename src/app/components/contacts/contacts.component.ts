import { Component, OnDestroy, OnInit } from '@angular/core';
import { ContactData } from 'src/app/shared/task-interface';
import { ContactService } from 'src/app/shared/services/contact.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditContactComponent } from '../dialog-edit-contact/dialog-edit-contact.component';
import { DialogAddContactComponent } from '../dialog-add-contact/dialog-add-contact.component';
import { DialogAddTaskComponent } from '../dialog-add-task/dialog-add-task.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit, OnDestroy {
  contacts: ContactData[] = [];
  sortedContacts: { [key: string]: ContactData[] } = {};
  selectedContact: ContactData | null = null;
  uniqueLetters: string[] = [];
  contactSubscritpion!: Subscription;

  constructor(
    private contactService: ContactService,
    public dialog: MatDialog,
  ) { }


  ngOnInit(): void {
    this.initAllContacts();
    this.contactUpdateListener();
  }


  contactUpdateListener() {
    this.contactSubscritpion = this.contactService.getContactUpdateListener().subscribe(() => {
      this.initAllContacts();
    })
  }


  /**
   * Asynchronously initializes and loads all contacts.
   * Fetches contacts using `contactService.loadAllContacts()` and stores them in `this.contacts`.
   * After fetching, it sorts and groups the contacts by calling `sortAndGroupContacts`.
   * In case of an error, the HttpErrorInterceptor triggers the dialog-error-component with the error message
   * and logs the error in the console.
   */
  async initAllContacts() {
    try {
      this.contacts = await this.contactService.loadAllContacts();
      this.sortAndGroupContacts(this.contacts);
    } catch (err) {
      console.error('Could not load contacts!', err);
    }
  }


  /**
   * Sorts and groups contacts by the first letter of their last names.
   * Organizes contacts into groups where each group's key is the initial letter of the last name.
   * The contacts are sorted within these groups and stored in `this.sortedContacts`.
   * Also generates a sorted list of unique initial letters in `this.uniqueLetters`.
   *
   * @param contacts - An array of ContactData objects to be sorted and grouped.
   */
  sortAndGroupContacts(contacts: ContactData[]) {
    const groups: { [key: string]: ContactData[] } = {};

    contacts.forEach(contact => {
      const letter = contact.lastname.charAt(0).toUpperCase();
      if (!groups[letter]) {
        groups[letter] = [];
      }
      groups[letter].push(contact);
    });

    this.sortedContacts = groups;
    this.uniqueLetters = Object.keys(groups).sort();
  }


  /**
   * Selects a contact and updates the component's state.
   * Sets the `selectedContact` property to the chosen contact.
   *
   * @param contact - The ContactData object representing the contact to be selected.
   */
  selectContact(contact: ContactData) {
    this.selectedContact = contact;
  }


  /**
   * Opens the DialogEditContactComponent to edit a contact.
   * Passes the contact ID to the dialog for editing.
   * Upon closing the dialog, if the contact was updated, updates the contact in the list 
   * and refreshes the currently selected contact information.
   *
   * @param contactId - The ID of the contact to be edited.
   */
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


  /**
   * Updates the currently selected contact if it matches the provided updated contact.
   * Compares the IDs of the selected contact and the updated contact.
   * If they match, updates `this.selectedContact` with the new details.
   *
   * @param updatedContact - The ContactData object with updated information.
   */
  updateSelectedContact(updatedContact: ContactData) {
    if (this.selectedContact && this.selectedContact.id === updatedContact.id) {
      this.selectedContact = updatedContact;
    }
  }


  /**
   * Updates a contact in the contacts list with new details.
   * Finds the contact by its ID and replaces its data with the updated contact information.
   * Only performs the update if the contact is found in the list.
   *
   * @param updatedContact - The ContactData object containing the updated information.
   */
  updateContactInList(updatedContact: ContactData) {
    const index = this.contacts.findIndex(contact => contact.id === updatedContact.id);
    if (index !== -1) {
      this.contacts[index] = updatedContact;
    }
  }


  /**
   * Opens the DialogAddContactComponent to add a new contact.
   * After the dialog is closed, if a new contact was successfully added (indicated by a result),
   * re-initializes all contacts by calling `initAllContacts`.
   */
  addContact() {
    const dialogRef = this.dialog.open(DialogAddContactComponent, {
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.initAllContacts();
      }
    });
  }


  /**
   * Asynchronously deletes a contact by its ID.
   * Calls the contact service to delete the contact if a valid ID is provided.
   * After deletion, re-initializes all contacts and resets the selected contact to null.
   * In case of an error, the HttpErrorInterceptor triggers the dialog-error-component with the error message
   * and logs the error in the console. 
   *
   * @param contactId - The ID of the contact to be deleted.
   */
  async deleteContact(contactId: number) {
    if (contactId) {
      try {
        await this.contactService.deleteContact(contactId);
        this.initAllContacts();
        this.selectedContact = null;
      } catch (err) {
        console.error('Could not deöete contact!', err);
      }
    }
  }


  /**
   * Opens the DialogAddTaskComponent in a dialog with the provided contact ID.
   * Passes the contact ID to the dialog component for use in task-related actions.
   *
   * @param contactId - The ID of the contact related to the task being added or edited.
   */
  openDialogAddTask(contactId: number) {
    const dialogRef = this.dialog.open(DialogAddTaskComponent, {
      data: { contactId: contactId }
    });
  }


  /**
   * Sets selectedContact to null.
   */
  deselectContact(): void {
    this.selectedContact = null;
  }


  ngOnDestroy() {
    this.contactSubscritpion?.unsubscribe();
  }

}
