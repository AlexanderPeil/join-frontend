import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ContactData } from '../todo-interface';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient) { }


  createContact() {

  }


  editContacts() {

  }


  deleteContact() {

  }


  loadAllContacts() {
    const url = environment.baseUrl + '/contacts/';
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return lastValueFrom(this.http.get<ContactData[]>(url, { headers }))
  }

}
