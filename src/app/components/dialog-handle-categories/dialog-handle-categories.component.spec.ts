import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogHandleCategoriesComponent } from './dialog-handle-categories.component';

describe('DialogHandleCategoriesComponent', () => {
  let component: DialogHandleCategoriesComponent;
  let fixture: ComponentFixture<DialogHandleCategoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogHandleCategoriesComponent]
    });
    fixture = TestBed.createComponent(DialogHandleCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
