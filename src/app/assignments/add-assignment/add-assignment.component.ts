import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { Assignment } from '../assignment.model';
import { AssignmentsService } from '../../shared/assignments.service';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../shared/auth';


/**
 * Composant pour ajouter un nouveau devoir
 */
@Component({
  selector: 'app-add-assignment',
  imports: [CommonModule,
            MatInputModule,
            MatFormFieldModule,
            MatButtonModule,
            MatDatepickerModule,
            MatCardModule,
            MatIconModule,
            FormsModule,
            RouterLink],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.css']
})
export class AddAssignmentComponent {

  // Champs du formulaire
  nomDevoir: string = '';
  dateDeRendu!: Date;


  // Constructeur

  // Injection du service des devoirs
  constructor(private assignmentsService: AssignmentsService,
              private router: Router,
              private authService: Auth) {}


  // Méthodes

  // Méthode appelée lors de la soumission du formulaire
  onAjouterDevoir(event:any) {
    // Vérifier que l'utilisateur est connecté (sécurité supplémentaire)
    if (!this.authService.isLogged()) {
      alert('Vous devez être connecté pour ajouter un devoir');
      this.router.navigate(['/login']);
      return;
    }

    console.log("Ajout NOM = " + this.nomDevoir + " date = " + this.dateDeRendu);
    
    // Création d'un nouveau devoir
    const nouveauDevoir: Assignment = new Assignment();
    nouveauDevoir.id = Math.floor(Math.random() * 1000000); // Génération d'un ID aléatoire
    nouveauDevoir.nom = this.nomDevoir;
    nouveauDevoir.dateDeRendu = this.dateDeRendu;
    nouveauDevoir.rendu = false; // Par défaut, il n'est pas rendu

    console.log(nouveauDevoir);

    this.assignmentsService.addAssignment(nouveauDevoir).subscribe(message => {
      console.log(message);
    this.router.navigate(['/home']);
    });
  }
}
