import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule  } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Assignment } from './assignment.model';
import { AssignmentsService } from '../shared/assignments.service';
import { RouterLink } from '@angular/router';
import { Auth } from '../shared/auth';


/**
 * Composant principal pour gérer les devoirs
 */
@Component({
  selector: 'app-assignments',
  imports: [CommonModule,
            MatDividerModule,
            DatePipe,
            MatButtonModule, 
            FormsModule, 
            MatInputModule, 
            MatDatepickerModule, 
            MatFormFieldModule, 
            MatListModule,
            MatPaginatorModule,
            MatCardModule,
            MatIconModule,
            MatChipsModule,
            RouterLink],
  providers: [provideNativeDateAdapter()],
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css']
})
export class AssignmentsComponent implements OnInit {

  // Attributs

  // Titre de l'application
  titre = "Mon application sur les Assignments !";

  // Pagination
  page: number = 1;
  limit: number = 10;
  totalDocs!: number;
  totalPage!: number;
  nextPage!: number;
  prevPage!: number;
  hasPrevPage!: boolean;
  hasNextPage!: boolean;

  ajoutActive = false;
  formVisible = false;
  devoirSelectionne!: Assignment;
  assignments: Assignment[];


  // Constructeur

  // Injection du service des devoirs
  constructor(private assignmentsService: AssignmentsService,
              private authService: Auth) {}


  // Méthodes
  
  // Méthode appelée à l'initialisation du composant
  ngOnInit(): void {
    console.log("ngOnInit appelé !");
    // Activer le bouton après 2 secondes
    setTimeout(() => {
      this.ajoutActive = true;
    }, 2000);
    this.getAssignmentsPaginated();
  }

  // Méthode pour obtenir les assignments paginés
  getAssignmentsPaginated(): void {
    this.assignmentsService.getAssignmentsPagine(this.page, this.limit).subscribe(data => {
      console.log("Données paginées reçues:", data);
      this.assignments = data.docs;
      this.totalDocs = data.totalDocs;
      this.totalPage = data.totalPages;
      this.nextPage = data.nextPage;
      this.prevPage = data.prevPage;
      this.hasPrevPage = data.hasPrevPage;
      this.hasNextPage = data.hasNextPage;
      this.page = data.page;
      console.log("Assignments:", this.assignments);
    });
  }

  // Méthode pour obtenir la couleur en fonction du rendu
  getColor(a: { rendu: boolean }): string {
    return a.rendu ? 'green' : 'red';
  }

  // Méthode appelée lors du clic sur un devoir
  devoirClique(assignment: Assignment) {
    this.devoirSelectionne = assignment;
  }

  // Méthode pour peupler la BD
  peuplerBD(): void {
    // Vérifier que l'utilisateur est admin
    if (!this.isAdmin()) {
      alert('Seul un administrateur peut peupler la base de données');
      return;
    }

    // Vérifier que la BD est vide
    if (!this.isBDVide()) {
      alert('La base de données contient déjà des assignments');
      return;
    }

    console.log("Début du peuplement de la BD...");
    this.assignmentsService.peuplerBD().subscribe({
      next: (data) => {
        console.log("BD peuplée avec succès!", data);
        // Recharger les assignments après le peuplement
        this.getAssignmentsPaginated();
      },
      error: (error) => {
        console.error("Erreur lors du peuplement de la BD:", error);
      }
    });
  }

  // Méthode pour vérifier si l'utilisateur est admin
  isAdmin(): boolean {
    return this.authService.isAdminSync();
  }

  // Méthode pour vérifier si la BD est vide
  isBDVide(): boolean {
    return this.totalDocs === 0;
  }

  // Méthode pour vérifier si le bouton peuplerBD doit être désactivé
  isPeuplerBDDisabled(): boolean {
    return !this.isAdmin() || !this.isBDVide();
  }

  // Méthodes de navigation pour la pagination
  premierePage(): void {
    this.page = 1;
    this.getAssignmentsPaginated();
  }

  // Méthodes de navigation pour la pagination - page précedente
  pagePrecedente(): void {
    if (this.hasPrevPage) {
      this.page = this.prevPage;
      this.getAssignmentsPaginated();
    }
  }

  // Méthodes de navigation pour la pagination - page suivante
  pageSuivante(): void {
    if (this.hasNextPage) {
      this.page = this.nextPage;
      this.getAssignmentsPaginated();
    }
  }

  // Méthodes de navigation pour la pagination - dernière page
  dernierePage(): void {
    this.page = this.totalPage;
    this.getAssignmentsPaginated();
  }

  // Méthode pour gérer le changement de page avec le widget Material Paginator
  onPageChange(event: any): void {
    console.log("Page change event:", event);
    this.page = event.pageIndex + 1; // pageIndex commence à 0, notre API commence à 1
    this.limit = event.pageSize;
    this.getAssignmentsPaginated();
  }
}
