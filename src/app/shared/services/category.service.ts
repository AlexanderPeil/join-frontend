import { Injectable } from '@angular/core';
import { Subject, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CategoryData, TaskData } from '../task-interface';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  categoryListUpdated = new Subject<void>();


  constructor(private http: HttpClient) { }


  /**
   * Creates a new category.
   *
   * Forms a URL to post a new category to the server using the base URL from the environment configuration.
   * An 'Authorization' header is set with a token from localStorage for authentication. Sends the
   * `newCategory` data as a POST request to the server. Converts the Observable to a Promise using
   * `lastValueFrom`, and the response is expected to be an array of CategoryData objects.
   *
   * @param newCategory - CategoryData object containing the details of the new category.
   * @returns A Promise resolving with an array of CategoryData objects, including the newly created category.
   */
  createCategory(newCategory: CategoryData) {
    const url = environment.baseUrl + 'categories/';
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return lastValueFrom(this.http.post<CategoryData[]>(url, newCategory, { headers }));
  }


  /**
   * Retrieves all categories from the server.
   *
   * Forms a URL to fetch all category data using the base URL from the environment configuration.
   * Sets an 'Authorization' header with a token from localStorage for secure access. Makes a GET 
   * request to retrieve an array of CategoryData objects representing all categories. Utilizes 
   * `lastValueFrom` to convert the returned Observable into a Promise.
   *
   * @returns A Promise resolving with an array of CategoryData objects, representing all available categories.
   */
  loadAllCategories() {
    const url = environment.baseUrl + 'categories/';
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return lastValueFrom(this.http.get<CategoryData[]>(url, { headers }));
  }


  /**
   * Fetches a specific category by its ID.
   *
   * Constructs a URL targeting a specific category based on the provided `categoryId`, using the base URL 
   * from the environment configuration. An 'Authorization' header is set using a token from localStorage 
   * for secure access. Makes a GET request to retrieve the category data as a CategoryData object. 
   * Utilizes `lastValueFrom` to convert the Observable into a Promise.
   *
   * @param categoryId - The unique identifier of the category to be retrieved.
   * @returns A Promise resolving with the CategoryData object for the requested category.
   */
  getCategoryById(categoryId: number) {
    const url = `${environment.baseUrl}/categories/${categoryId}/`;
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return lastValueFrom(this.http.get<CategoryData>(url, { headers }));
  }


  /**
   * Updates a specific category with new data.
   *
   * Forms a URL to target a specific category using its `categoryId`, based on the base URL from the 
   * environment configuration. Sets an 'Authorization' header with a token from localStorage for 
   * authentication. Sends the `updatedData` for the category as a PATCH request. Converts the 
   * Observable to a Promise using `lastValueFrom`, expecting an array of CategoryData objects as the response.
   *
   * @param categoryId - The unique identifier of the category to be updated.
   * @param updatedData - CategoryData object containing the updated category information.
   * @returns A Promise resolving with an array of CategoryData objects, including the updated category.
   */
  updateCategory(categoryId: number, updatedData: CategoryData) {
    const url = `${environment.baseUrl}/categories/${categoryId}/`;
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return lastValueFrom(this.http.patch<CategoryData[]>(url, updatedData, { headers }));
  }


  /**
   * Notifies subscribers about an update in the category list.
   *
   * Triggers the `next` method on the `categoryListUpdated` Subject, signaling to all subscribers 
   * that there has been an update in the category list. This method is used after adding, 
   * or updating category data, to inform components or services that are observing 
   * `categoryListUpdated`.
   */
  notifyCategoriesUpdate() {
    this.categoryListUpdated.next();
  }


  /**
   * Provides an Observable for category list updates.
   *
   * Returns an Observable derived from the `categoryListUpdated` Subject, allowing components and 
   * services to subscribe to updates in the category list. This is for reacting to changes 
   * additions or modifications in the category data.
   *
   * @returns An Observable that subscribers can use to be notified of updates to the category list.
   */
  getCategoriesUpdateListener() {
    return this.categoryListUpdated.asObservable();
  }


}
