import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/shared/services/category.service';
import { TodoService } from 'src/app/shared/services/todo.service';
import { CategoryData } from 'src/app/shared/todo-interface';

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
    private catService: CategoryService,
    private ts: TodoService
  ) { }


  ngOnInit(): void {
    this.loadCategoryById();
  }


  async loadCategoryById() {
    try {
      const category = await this.catService.getCategoryById(this.data.categoryId);
      this.category = category;
    } catch (err) {
      console.error(err);
    }
  }


  async updateCategoryName(categoryId: number) {
    if (categoryId !== undefined) {
      try {
        await this.catService.updateCategory(categoryId, this.category);
        this.catService.notifyCategoriesUpdate();
        this.dialogRef.close();
      } catch (err) {
        console.error(err);
      }
    }
  }


  closeMenu() {
    this.dialogRef.close();
  }

}
