import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/signup/signup.component';
import { SummaryComponent } from './components/summary/summary.component';
import { BoardComponent } from './components/board/board.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { AddTaskComponent } from './components/add-task/add-task.component';
import { DialogEditContactComponent } from './components/dialog-edit-contact/dialog-edit-contact.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'summary', component: SummaryComponent },
  { path: 'board', component: BoardComponent },
  { path: 'contacts', component: ContactsComponent },
  { path: 'add-task', component: AddTaskComponent },
  // { path: 'edit-contact', component: DialogEditContactComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
