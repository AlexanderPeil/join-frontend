import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/shared/services/category.service';
import { CategoryData } from 'src/app/shared/task-interface';

@Component({
  selector: 'app-dialog-handle-categories',
  templateUrl: './dialog-handle-categories.component.html',
  styleUrls: ['./dialog-handle-categories.component.scss']
})
export class DialogHandleCategoriesComponent implements OnInit {
  category!: CategoryData;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogHandleCategoriesComponent>,
    private catService: CategoryService
  ) { }


  ngOnInit(): void {
    this.loadCategoryById();
  }


  /**
   * Asynchronously loads a category by its ID.
   * Retrieves the category data using `getCategoryById` from the catService.
   * Sets the retrieved category to the local `category` variable.
   * In case of an error, the HttpErrorInterceptor triggers the dialog-error-component with the error message
   * and logs the error in the console.
   */
  async loadCategoryById() {
    try {
      const category = await this.catService.getCategoryById(this.data.categoryId);
      this.category = category;
    } catch (err) {
      console.error('Could not load category!', err);
      
    }
  }


  /**
   * Asynchronously updates the name of a category specified by its ID.
   * Checks if the categoryId is defined, then calls the updateCategory method from the catService.
   * Notifies about the category update and closes the dialog upon successful update.
   * In case of an error, the HttpErrorInterceptor triggers the dialog-error-component with the error message
   * and logs the error in the console.
   *
   * @param {number} categoryId - The ID of the category to be updated.
   */
  async updateCategoryName(categoryId: number) {
    if (categoryId !== undefined) {
      try {
        await this.catService.updateCategory(categoryId, this.category);
        this.catService.notifyCategoriesUpdate();
        this.dialogRef.close();
      } catch (err) {
        console.error('Could not update category!', err);
      }
    }
  }


  /**
   * Closes the dialog.
   */
  closeMenu() {
    this.dialogRef.close();
  }

}
