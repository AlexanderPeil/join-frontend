import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ContactData } from '../todo-interface';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  constructor(private http: HttpClient) { }


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


  deleteContact() {

  }


  loadAllContacts() {
    const url = environment.baseUrl + '/contacts/';
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return lastValueFrom(this.http.get<ContactData[]>(url, { headers: headers }))
  }


  getContactById(id: number): Promise<ContactData> {
    const url = `${environment.baseUrl}/contacts/${id}/`;
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return lastValueFrom(this.http.get<ContactData>(url, { headers }));
  }

}
