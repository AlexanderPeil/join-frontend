import { NgModule } from '@angular/core';
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
import { EditTaskComponent } from './components/edit-task/edit-task.component';
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
import { HttpClientModule } from '@angular/common/http';


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
    EditTaskComponent,
    HelpPageComponent,
    LegalNoticeComponent,
    DialogAddContactComponent,
    DialogAddTaskComponent,
    DialogEditTaskComponent,
    DialogEditContactComponent,
    AddTaskComponent,
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
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
