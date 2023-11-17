import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditContactComponent } from './dialog-edit-contact.component';

describe('DialogEditContactComponent', () => {
  let component: DialogEditContactComponent;
  let fixture: ComponentFixture<DialogEditContactComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogEditContactComponent]
    });
    fixture = TestBed.createComponent(DialogEditContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
