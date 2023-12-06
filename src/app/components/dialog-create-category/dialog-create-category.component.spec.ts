import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreateCategoryComponent } from './dialog-create-category.component';

describe('DialogCreateCategoryComponent', () => {
  let component: DialogCreateCategoryComponent;
  let fixture: ComponentFixture<DialogCreateCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogCreateCategoryComponent]
    });
    fixture = TestBed.createComponent(DialogCreateCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
