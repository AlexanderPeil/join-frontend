import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DialogErrorComponent } from '../components/dialog-error/dialog-error.component';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(public dialog: MatDialog) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if ((req.url.endsWith('/login/') || req.url.endsWith('/signup/')) && error.status === 400) {
          return throwError(() => error);
        }

        let errorMessage = 'An unexpected error has occurred.';

        if (error.status === 403) {
          errorMessage = 'Please sign up to enjoy all the functionalities of this app.';
        } else if (error.status === 400) {
          errorMessage = 'A bad request was detected.';
        } else if (error.status === 401) {
          errorMessage = 'You are not authorized. Please log in.';
        }

        this.dialog.open(DialogErrorComponent, {
          data: { message: errorMessage }
        });

        return throwError(() => error);
      })
    );
  }


}
