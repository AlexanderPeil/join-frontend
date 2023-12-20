import { Injectable } from '@angular/core';
import { Subject, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ContactData } from '../task-interface';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactUpdated = new Subject<void>();

  constructor(private http: HttpClient) { }


  /**
   * Submits new contact information to the server.
   *
   * Constructs a URL for creating a new contact using the base URL from the environment configuration.
   * Sets an 'Authorization' header using a token from localStorage for secure access. Sends the `formData`
   * containing the new contact details as a POST request to the server. Utilizes `lastValueFrom` to convert
   * the Observable to a Promise.
   *
   * @param formData - ContactData object containing the details of the new contact.
   * @returns A Promise resolving with the ContactData object of the newly created contact.
   */
  createContact(formData: ContactData) {
    const url = environment.baseUrl + '/contacts/';
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return lastValueFrom(this.http.post<ContactData>(url, formData, { headers: headers }));
  }


  updateContact(contactId: string, updatedContact: ContactData) {
    const url = `${environment.baseUrl}/contacts/${contactId}/`;
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return lastValueFrom(this.http.patch<ContactData>(url, updatedContact, { headers: headers }));
  }


  /**
   * Updates an existing contact with new data.
   *
   * Forms a URL targeting a specific contact using its `contactId`, based on the base URL 
   * from the environment configuration. Sets an 'Authorization' header with a token from 
   * localStorage for authentication. Sends the `updatedContact` data as a PATCH request 
   * to update the contact information. Converts the Observable to a Promise using `lastValueFrom`.
   *
   * @param contactId - The unique identifier of the contact to be updated.
   * @param updatedContact - ContactData object containing the updated information for the contact.
   * @returns A Promise resolving with the updated ContactData object.
   */
  deleteContact(contactId: number) {
    const url = `${environment.baseUrl}/contacts/${contactId}/`;
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return lastValueFrom(this.http.delete<ContactData>(url, { headers: headers }));
  }


  /**
   * Retrieves all contacts from the server.
   *
   * Constructs a URL to fetch all contact data using the base URL from the environment configuration.
   * Sets an 'Authorization' header using a token from localStorage for secure access. Makes a GET 
   * request to retrieve an array of ContactData objects representing all contacts. Uses `lastValueFrom` 
   * to convert the returned Observable into a Promise.
   *
   * @returns A Promise resolving with an array of ContactData objects, representing all contacts.
   */
  loadAllContacts() {
    const url = environment.baseUrl + '/contacts/';
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return lastValueFrom(this.http.get<ContactData[]>(url, { headers: headers }))
  }


  /**
   * Fetches a specific contact by its unique identifier.
   *
   * Constructs a URL targeting a contact using the provided `id`, based on the base URL from 
   * the environment configuration. An 'Authorization' header is set with a token from localStorage 
   * for secure access. Makes a GET request to retrieve the contact data as a ContactData object. 
   * Utilizes `lastValueFrom` to convert the Observable into a Promise.
   *
   * @param id - The unique identifier of the contact to be retrieved.
   * @returns A Promise resolving with the ContactData object for the requested contact.
   */
  getContactById(id: number): Promise<ContactData> {
    const url = `${environment.baseUrl}/contacts/${id}/`;
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return lastValueFrom(this.http.get<ContactData>(url, { headers }));
  }



  /**
   * Notifies subscribers about an update of the contact.
   *
   * Triggers the `next` method on the `contactUpdated` Subject, signaling to all subscribers 
   * that there has been an update in the contact list. This method is used after adding, 
   * or updating contact data, to inform components or services that are observing 
   * `contactUpdated`.
   */
  notifyContactUpdate() {
    this.contactUpdated.next();
  }


  /**
   * Provides an Observable for contact updates.
   *
   * Returns an Observable derived from the `contactUpdated` Subject, allowing components and 
   * services to subscribe to updates o the contacts. This is for reacting to changes 
   * additions or modifications in the contact data.
   *
   * @returns An Observable that subscribers can use to be notified of updates of the contacts.
   */
  getContactUpdateListener() {
    return this.contactUpdated.asObservable();
  }

}
