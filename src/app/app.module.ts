import { ErrorHandler, NgModule, APP_INITIALIZER  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/signup/signup.component';
import { SummaryComponent } from './components/summary/summary.component';
import { BoardComponent } from './components/board/board.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { HeaderComponent } from './components/header/header.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { HelpPageComponent } from './components/help-page/help-page.component';
import { LegalNoticeComponent } from './components/legal-notice/legal-notice.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogAddContactComponent } from './components/dialog-add-contact/dialog-add-contact.component';
import { DialogAddTaskComponent } from './components/dialog-add-task/dialog-add-task.component';
import { DialogEditTaskComponent } from './components/dialog-edit-task/dialog-edit-task.component';
import { DialogEditContactComponent } from './components/dialog-edit-contact/dialog-edit-contact.component';
import { AddTaskComponent } from './components/add-task/add-task.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { TaskMenuComponent } from './components/task-menu/task-menu.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { MatMenuModule } from '@angular/material/menu';
import { DialogHandleCategoriesComponent } from './components/dialog-handle-categories/dialog-handle-categories.component';
import { DialogErrorComponent } from './components/dialog-error/dialog-error.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AuthInterceptorService } from './shared/services/auth-interceptor.service';
import { DialogGuestLoginComponent } from './components/dialog-guest-login/dialog-guest-login.component';
import * as Sentry from "@sentry/angular-ivy";
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    SummaryComponent,
    BoardComponent,
    ContactsComponent,
    HeaderComponent,
    NavBarComponent,
    HelpPageComponent,
    LegalNoticeComponent,
    DialogAddContactComponent,
    DialogAddTaskComponent,
    DialogEditTaskComponent,
    DialogEditContactComponent,
    AddTaskComponent,
    TaskMenuComponent,
    PrivacyPolicyComponent,
    DialogHandleCategoriesComponent,
    DialogErrorComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    DialogGuestLoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    DragDropModule,
    CdkDropList,
    CdkDrag,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    MatProgressBarModule,
    MatMenuModule,
    MatProgressSpinnerModule
  ],
  providers: [
    {
     provide: HTTP_INTERCEPTORS,
     useClass: AuthInterceptorService,
     multi: true
    },
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({
        showDialog: true, // Während der Entwicklung hilfreich, für Produktion überdenken
      }),
    }, {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {},
      deps: [Sentry.TraceService],
      multi: true,
    }
 ],
  bootstrap: [AppComponent]
})
export class AppModule { }
