import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Assignment } from '../assignment.model';
import { AssignmentsService } from '../../shared/assignments.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '../../shared/auth';


/**
 * Composant pour éditer un devoir
 */
@Component({
selector: 'app-edit-assignment',
standalone: true,
providers: [provideNativeDateAdapter()],
imports: [
  CommonModule,
  FormsModule,
  MatInputModule,
  MatFormFieldModule,
  MatDatepickerModule,
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatListModule,
  MatDividerModule,
  MatPaginatorModule,
  MatTooltipModule
],
templateUrl: './edit-assignment.html',
styleUrl: './edit-assignment.css',
})
export class EditAssignmentComponent implements OnInit {

  // Mode: 'list' pour afficher la liste, 'edit' pour éditer un devoir
  mode: 'list' | 'edit' = 'list';

  // Liste des assignments
  assignments: Assignment[] = [];

  // Pagination
  page: number = 1;
  limit: number = 10;
  totalDocs: number = 0;
  totalPages: number = 0;

  // Devoir en cours d'édition
  assignment: Assignment | undefined;
  nomAssignment = '';
  dateDeRendu?: Date = undefined;


  // Constructeur

  // Injection du service des devoirs
  constructor(
    private assignmentsService: AssignmentsService,
    private authService: Auth,
    private router: Router,
    private route: ActivatedRoute
  ) {}


  // Méthodes

  // Méthode appelée à l'initialisation du composant
  ngOnInit(): void {
    // Vérifier que l'utilisateur est admin
    if (!this.isAdmin()) {
      alert('Seul un administrateur peut accéder à cette page');
      this.router.navigate(['/home']);
      return;
    }

    // Vérifier si on accède directement à l'édition d'un devoir (via URL)
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadAssignmentForEdit(Number(id));
    } else {
      this.getAssignments();
    }
  }

  // Récupérer les assignments paginés
  getAssignments(): void {
    this.assignmentsService.getAssignmentsPagine(this.page, this.limit).subscribe(data => {
      this.assignments = data.docs;
      this.totalDocs = data.totalDocs;
      this.totalPages = data.totalPages;
    });
  }

  // Gestion de la pagination
  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.getAssignments();
  }

  // Charger un devoir pour l'édition
  loadAssignmentForEdit(id: number): void {
    this.assignmentsService.getAssignment(id).subscribe(a => {
      this.assignment = a;
      if (a === undefined) {
        this.router.navigate(['/home']);
        return;
      }
      this.nomAssignment = a.nom;
      this.dateDeRendu = a.dateDeRendu;
      this.mode = 'edit';
    });
  }

  // Sélectionner un devoir à éditer
  onEdit(assignment: Assignment): void {
    this.assignment = assignment;
    this.nomAssignment = assignment.nom;
    this.dateDeRendu = assignment.dateDeRendu;
    this.mode = 'edit';
  }

  // Annuler l'édition
  onCancel(): void {
    this.mode = 'list';
    this.assignment = undefined;
    this.nomAssignment = '';
    this.dateDeRendu = undefined;
  }

  // Sauvegarder le devoir
  onSaveAssignment(): void {
    if (!this.assignment) return;
    if (this.nomAssignment === '' || this.dateDeRendu === undefined) return;

    this.assignment.nom = this.nomAssignment;
    this.assignment.dateDeRendu = this.dateDeRendu;
    this.assignmentsService.updateAssignment(this.assignment)
      .subscribe((message) => {
        console.log(message);
        this.router.navigate(['/home']);
      });
  }

  // Vérifier si l'utilisateur est admin
  isAdmin(): boolean {
    return this.authService.isAdminSync();
  }
}
