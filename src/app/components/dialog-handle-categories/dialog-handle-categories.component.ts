import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'src/app/shared/services/category.service';
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
    private catService: CategoryService
  ) { }


  ngOnInit(): void {
    this.loadCategoryById();
  }


  async loadCategoryById() {
    try {
      this.category = await this.catService.getCategoryById(this.data.categoryId)
    } catch (err) {
      console.error(err);
    }
  }

}
