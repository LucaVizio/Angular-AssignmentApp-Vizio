import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Auth } from './shared/auth';
import { AssignmentsService } from './shared/assignments.service';


/**
 * Composant racine de l'application
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
            RouterLink,
            RouterLinkActive,
            MatButtonModule,
            MatIconModule,
            MatDividerModule,
            MatInputModule,
            MatFormFieldModule,
            MatNativeDateModule,
            MatToolbarModule,
            MatSidenavModule,
            MatListModule,
            MatSlideToggleModule,
            MatMenuModule,
            MatTooltipModule,
            MatSnackBarModule
          ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  
  // Attributs

  protected readonly title = signal('Assignment App');
  opened = false;
  bdIsEmpty = true; // Indique si la BD est vide


  // Constructeur

  // Injection du service d'authentification, du routeur, du service des devoirs et du snackbar
  constructor(private authService: Auth,
              private router: Router,
              private assignmentsService: AssignmentsService,
              private snackBar: MatSnackBar) {}


  // Méthodes

  // Méthode appelée à l'initialisation du composant
  ngOnInit() {
    this.checkBdStatus();
  }

  // Vérifier si la BD contient des données
  checkBdStatus(): void {
    this.assignmentsService.getAssignmentsPagine(1, 1).subscribe({
      next: (data) => {
        this.bdIsEmpty = data.totalDocs === 0;
      },
      error: () => {
        this.bdIsEmpty = true;
      }
    });
  }

  // Méthodes pour la navigation et l'authentification
  goToLogin() {
    this.router.navigate(['/login']);
  }

  // Méthode pour la déconnexion
  logout() {
    this.authService.logOut();
    this.router.navigate(['/home']);
  }

  // Méthodes pour vérifier l'état de connexion et le rôle de l'utilisateur
  isLogged(): boolean {
    return this.authService.isLogged();
  }

  // Méthode pour obtenir le rôle de l'utilisateur
  getUserRole(): string {
    return this.authService.currentUser?.role === 'admin' ? 'Admin' : 'Utilisateur';
  }

  // Méthode pour vérifier si l'utilisateur est admin
  isAdmin(): boolean {
    return this.authService.isAdminSync();
  }

  // Méthode pour vérifier si le bouton peuplerBD doit être désactivé
  // Désactivé si: pas admin OU BD déjà peuplée
  isPeuplerBDDisabled(): boolean {
    return !this.isAdmin() || !this.bdIsEmpty;
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

  // Méthode appelée au clic sur Ajouter un devoir
  onAddClick(): void {
    if (!this.isLogged()) {
      console.warn('[Ajouter] Utilisateur non connecté');
      this.showNotification('Vous devez être connecté pour ajouter un devoir', 'warning');
      return;
    }
    // Utilisateur connecté, navigation autorisée
    console.log('[Ajouter] Navigation vers la page d\'ajout');
    this.router.navigate(['/add']);
  }

  // Méthode appelée au clic sur Modifier un devoir
  onEditClick(): void {
    if (!this.isLogged()) {
      console.warn('[Modifier] Utilisateur non connecté');
      this.showNotification('Vous devez être connecté pour modifier un devoir', 'warning');
      return;
    }
    if (!this.isAdmin()) {
      console.warn('[Modifier] Utilisateur connecté mais pas admin');
      this.showNotification('Seul un administrateur peut modifier les devoirs', 'warning');
      return;
    }
    // Admin connecté, navigation autorisée
    console.log('[Modifier] Navigation vers la page de modification');
    this.router.navigate(['/edit']);
  }

  // Méthode appelée au clic sur Supprimer un devoir
  onDeleteClick(): void {
    if (!this.isLogged()) {
      console.warn('[Supprimer] Utilisateur non connecté');
      this.showNotification('Vous devez être connecté pour supprimer un devoir', 'warning');
      return;
    }
    if (!this.isAdmin()) {
      console.warn('[Supprimer] Utilisateur connecté mais pas admin');
      this.showNotification('Seul un administrateur peut supprimer les devoirs', 'warning');
      return;
    }
    // Admin connecté, navigation autorisée
    console.log('[Supprimer] Navigation vers la page de suppression');
    this.router.navigate(['/delete']);
  }

  // Méthode appelée au clic sur Peupler BD
  onPeuplerBDClick(): void {
    // Vérifier si l'utilisateur est connecté
    if (!this.isLogged()) {
      console.warn('[PeuplerBD] Utilisateur non connecté');
      this.showNotification('Vous devez être connecté pour accéder à cette fonctionnalité', 'warning');
      return;
    }

    // Vérifier si l'utilisateur est admin
    if (!this.isAdmin()) {
      console.warn('[PeuplerBD] Utilisateur connecté mais pas admin');
      this.showNotification('Seul un administrateur peut peupler la base de données', 'warning');
      return;
    }

    // Vérifier si la BD est déjà peuplée
    if (!this.bdIsEmpty) {
      console.warn('[PeuplerBD] La base de données contient déjà des données');
      this.showNotification('La base de données contient déjà des assignments', 'info');
      return;
    }

    // Tout est OK, on peut peupler
    this.peuplerBD();
  }

  // Méthode pour peupler la BD
  peuplerBD(): void {
    console.log("[PeuplerBD] Début du peuplement de la BD...");
    this.showNotification('Peuplement de la base de données en cours...', 'info');
    
    this.assignmentsService.peuplerBD().subscribe({
      next: (result) => {
        console.log("[PeuplerBD] BD peuplée avec succès!", result);
        this.bdIsEmpty = false;
        this.showNotification('Base de données peuplée avec succès!', 'success');
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error("[PeuplerBD] Erreur lors du peuplement de la BD:", error);
        this.showNotification('Erreur lors du peuplement de la base de données', 'error');
      }
    });
  }
}
