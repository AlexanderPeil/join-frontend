// import { Injectable } from '@angular/core';
// import {
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpInterceptor,
//   HttpErrorResponse
// } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';
// import { MatDialog } from '@angular/material/dialog';
// import { DialogErrorComponent } from '../components/dialog-error/dialog-error.component';

// @Injectable()
// export class HttpErrorInterceptor implements HttpInterceptor {

//   constructor(public dialog: MatDialog) { }


//   /**
//    * Intercepts HTTP requests and handles errors.
//    *
//    * This method intercepts all outgoing HTTP requests and applies error handling. If the request is for
//    * login or signup and returns a 400 error, it rethrows the error. For all other errors, it extracts
//    * and formats the error message using `getErrorMessage`, displays it using a DialogErrorComponent, 
//    * and then rethrows the error. This centralized error handling is useful for displaying consistent 
//    * error messages across the application.
//    *
//    * @param req - The outgoing HttpRequest object.
//    * @param next - The HttpHandler for the next interceptor in the chain.
//    * @returns An Observable that emits the HttpEvent stream.
//    */
//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     return next.handle(req).pipe(
//       catchError((error: HttpErrorResponse) => {
//         if ((req.url.endsWith('/login/') || req.url.endsWith('/signup/')) && error.status === 400) {
//           return throwError(() => error);
//         }

//         const errorMessage = this.getErrorMessage(error);
//         this.dialog.open(DialogErrorComponent, { data: { message: errorMessage } });

//         return throwError(() => error);
//       })
//     );
//   }


//   /**
//    * Generates an appropriate error message based on the HTTP error status.
//    *
//    * This private method interprets the HTTP error response and returns a user-friendly error message.
//    * It handles various HTTP status codes such as 403 (Forbidden), 400 (Bad Request), and 401 (Unauthorized),
//    * providing specific messages for each. For all other unexpected error statuses, it returns a generic 
//    * error message. This method is typically used in conjunction with error handling in HTTP request 
//    * interceptors or similar contexts.
//    *
//    * @param error - The HttpErrorResponse object containing the error details.
//    * @returns A string representing a user-friendly error message.
//    */
//   private getErrorMessage(error: HttpErrorResponse): string {
//     switch (error.status) {
//       case 403:
//         return 'Please sign up to enjoy all the functionalities of this app.';
//       case 400:
//         return 'A bad request was detected.';
//       case 401:
//         return 'You are not authorized. Please log in.';
//       default:
//         return 'An unexpected error has occurred.';
//     }
//   }
// }
