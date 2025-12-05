import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Assignment } from '../assignment.model';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AssignmentsService } from '../../shared/assignments.service';
import { Auth } from '../../shared/auth';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';


/**
 * Composant pour afficher les détails d'un devoir
 */
@Component({
  selector: 'app-assignment-detail',
  imports: [CommonModule,
            MatCardModule,
            MatCheckboxModule,
            DatePipe,
            MatButtonModule,
            MatIconModule,
            MatChipsModule,
            MatDividerModule,
            MatSnackBarModule,
            RouterLink],
  templateUrl: './assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.css']
})
export class AssignmentDetailComponent implements OnInit {

  // Devoir transmis en entrée
  devoirTransmis?: Assignment;
  

  // Constructeur

  // Injection du service des devoirs
  constructor(private assignmentsService: AssignmentsService,
              private authService: Auth,
              private route: ActivatedRoute,
              private router: Router,
              private snackBar: MatSnackBar) {}


  // Méthodes

  // Méthode appelée à l'initialisation du composant
  ngOnInit(): void {
    this.getAssignment();
  }

  // Méthode pour récupérer le devoir à afficher
  getAssignment(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.assignmentsService.getAssignment(id).subscribe(assignment => {
      this.devoirTransmis = assignment;
    });
  }

  // Méthode pour afficher une notification
  showNotification(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info'): void {
    const panelClass = {
      'success': 'snackbar-success',
      'error': 'snackbar-error',
      'warning': 'snackbar-warning',
      'info': 'snackbar-info'
    };
    this.snackBar.open(message, 'Fermer', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: [panelClass[type]]
    });
  }

  // Méthode appelée lors du clic sur la case à cocher
  OnDevoirRendu(): void {
    // Vérifier que l'utilisateur est connecté
    if (!this.authService.isLogged()) {
      console.warn('[RenduDevoir] Utilisateur non connecté');
      this.showNotification('Vous devez être connecté pour rendre un devoir', 'warning');
      return;
    }

    // Inverser l'état du devoir
    if (this.devoirTransmis) {
      this.devoirTransmis.rendu = !this.devoirTransmis.rendu;
      console.log('[RenduDevoir] Mise à jour du devoir:', this.devoirTransmis.nom);
      
      this.assignmentsService.updateAssignment(this.devoirTransmis).subscribe({
        next: (message) => {
          console.log('[RenduDevoir] Devoir mis à jour avec succès:', message);
          this.showNotification('Devoir marqué comme rendu avec succès!', 'success');
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('[RenduDevoir] Erreur lors de la mise à jour:', err);
          this.showNotification('Erreur lors de la mise à jour du devoir', 'error');
          // Annuler le changement en cas d'erreur
          if (this.devoirTransmis) {
            this.devoirTransmis.rendu = !this.devoirTransmis.rendu;
          }
        }
      });
    }
  }

  // Méthode appelée lors du clic sur le bouton d'édition
  onClickEdit() {
    if (!this.devoirTransmis) return;
    this.router.navigate(['/assignment', this.devoirTransmis.id, 'edit'], 
      {queryParams: {nom: this.devoirTransmis.nom}, fragment: 'edition'});
  }

  // Méthode appelée lors du clic sur le bouton de suppression
  onSupprimerDevoir() {
    if (!this.devoirTransmis) return;
    this.assignmentsService.deleteAssignment(this.devoirTransmis)
      .subscribe(message => {
        console.log(message);
        this.router.navigate(['/home']);
    });
  }

  // Méthode pour vérifier si l'utilisateur est admin
  isAdmin(): boolean {
    return this.authService.isAdminSync();
  }
}
