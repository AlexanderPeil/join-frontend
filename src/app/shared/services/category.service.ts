import { Injectable } from '@angular/core';
import { Subject, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CategoryData, TodoData } from '../todo-interface';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  categoryListUpdated = new Subject<void>();
  

  constructor(private http: HttpClient) { }


  createCategory(newCategory: CategoryData) {
    const url = environment.baseUrl + '/categories/';
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return lastValueFrom(this.http.post<CategoryData[]>(url, newCategory, { headers }));
  }


  loadAllCategories() {
    const url = environment.baseUrl + '/categories/';
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return lastValueFrom(this.http.get<CategoryData[]>(url, { headers }));
  }


  getCategoryById(categoryId: number) {
    const url = `${environment.baseUrl}/categories/${categoryId}/`;
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return lastValueFrom(this.http.get<CategoryData>(url, { headers }));
  }


  updateCategory(categoryId: number, updatedData: CategoryData) {
    const url = `${environment.baseUrl}/categories/${categoryId}/`;
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return lastValueFrom(this.http.patch<CategoryData[]>(url, updatedData, { headers }));
  }


  // deleteCategory(categoryId: number) {
  //   const url = `${environment.baseUrl}/categories/${categoryId}/`;
  //   const headers = new HttpHeaders({
  //     'Authorization': `Token ${localStorage.getItem('token')}`
  //   });
  //   return lastValueFrom(this.http.delete<CategoryData>(url, { headers: headers }));
  // }


  notifyCategoriesUpdate() {
    this.categoryListUpdated.next();
  }


  getCategoriesUpdateListener() {
    return this.categoryListUpdated.asObservable();
  }


}
