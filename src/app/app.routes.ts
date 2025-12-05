import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignmentsComponent } from './assignments/assignments.component';
import { AddAssignmentComponent } from './assignments/add-assignment/add-assignment.component';
import { AssignmentDetailComponent } from './assignments/assignment-detail/assignment-detail.component';
import { EditAssignmentComponent } from './assignments/edit-assignment/edit-assignment';
import { DeleteAssignmentComponent } from './assignments/delete-assignment/delete-assignment';
import { AssignmentLogin } from './assignments/assignment-login/assignment-login';
import { authGuard } from './shared/auth-guard';


/**
 * Définition des routes de l'application
 */
export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: AssignmentsComponent },
  { path: 'login', component: AssignmentLogin },
  { path: 'add', component: AddAssignmentComponent },
  { path: 'edit', component: EditAssignmentComponent, canActivate: [authGuard] },
  { path: 'delete', component: DeleteAssignmentComponent, canActivate: [authGuard] },
  { path: 'assignment/:id', component: AssignmentDetailComponent},
  { path: 'assignment/:id/edit', component: EditAssignmentComponent, canActivate: [authGuard] }
];

// Module de routage de l'application
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}