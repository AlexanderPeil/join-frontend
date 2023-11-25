import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
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
    return lastValueFrom(this.http.get<ContactData[]>(url))
  }

}
