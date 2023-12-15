import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * I use this component to display the error triggered from the HttpErrorInterceptor.
 */
@Component({
  selector: 'app-dialog-error',
  templateUrl: './dialog-error.component.html',
  styleUrls: ['./dialog-error.component.scss']
})
export class DialogErrorComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { message: string }) { }


}
