import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { CategoryData } from '../todo-interface';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }


  createCategory() {

  }


  editCategory() {

  }


  deleteCategory() {

  }


  loadAllCategories() {
    const url = environment.baseUrl + '/categories/';
    return lastValueFrom(this.http.get<CategoryData[]>(url))
  }
}
