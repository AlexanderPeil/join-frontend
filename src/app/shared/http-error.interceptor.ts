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

        const errorMessage = this.getErrorMessage(error);
        this.dialog.open(DialogErrorComponent, { data: { message: errorMessage } });

        return throwError(() => error);
      })
    );
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 403:
        return 'Please sign up to enjoy all the functionalities of this app.';
      case 400:
        return 'A bad request was detected.';
      case 401:
        return 'You are not authorized. Please log in.';
      default:
        return 'An unexpected error has occurred.';
    }
  }
}
