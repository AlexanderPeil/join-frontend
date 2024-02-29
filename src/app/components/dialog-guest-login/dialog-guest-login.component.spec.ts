import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogGuestLoginComponent } from './dialog-guest-login.component';

describe('DialogGuestLoginComponent', () => {
  let component: DialogGuestLoginComponent;
  let fixture: ComponentFixture<DialogGuestLoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogGuestLoginComponent]
    });
    fixture = TestBed.createComponent(DialogGuestLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
