import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { Assignment } from '../assignment.model';
import { AssignmentsService } from '../../shared/assignments.service';
import { Auth } from '../../shared/auth';


/**
 * Composant pour supprimer des devoirs
 */
@Component({
  selector: 'app-delete-assignment',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatPaginatorModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './delete-assignment.html',
  styleUrls: ['./delete-assignment.css']
})
export class DeleteAssignmentComponent implements OnInit {

  // Attributs

  // Liste des assignments
  assignments: Assignment[] = [];

  // Pagination
  page: number = 1;
  limit: number = 10;
  totalDocs: number = 0;
  totalPages: number = 0;


  // Constructeur

  // Injection du service des devoirs, du service d'authentification et du routeur
  constructor(
      private assignmentsService: AssignmentsService,
      private authService: Auth,
      private router: Router) {}

      
  // Méthodes

  // Initialisation
  ngOnInit(): void {
      // Vérifier que l'utilisateur est admin
      if (!this.isAdmin()) {
      alert('Seul un administrateur peut accéder à cette page');
      this.router.navigate(['/home']);
      return;
      }
      this.getAssignments();
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

  // Supprimer un assignment
  onDelete(assignment: Assignment): void {
      if (confirm(`Êtes-vous sûr de vouloir supprimer le devoir "${assignment.nom}" ?`)) {
      this.assignmentsService.deleteAssignment(assignment).subscribe({
          next: (message) => {
          console.log('Devoir supprimé:', message);
          // Rediriger vers la page principale
          this.router.navigate(['/home']);
          },
          error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          alert('Erreur lors de la suppression du devoir');
          }
      });
      }
  }

  // Vérifier si l'utilisateur est admin
  isAdmin(): boolean {
      return this.authService.isAdminSync();
  }
}
