import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Auth } from '../../shared/auth';


/**
 * Composant pour la connexion des utilisateurs
 */
@Component({
  selector: 'app-assignment-login',
  imports: [CommonModule,
            FormsModule,
            MatInputModule,
            MatButtonModule,
            MatFormFieldModule,
            MatCardModule,
            MatIconModule],
  templateUrl: './assignment-login.html',
  styleUrl: './assignment-login.css'
})
export class AssignmentLogin {

  // Attributs

  login: string = '';
  password: string = '';
  errorMessage: string = '';


  // Constructeur

  // Injection du service d'authentification et du routeur
  constructor(private authService: Auth,
              private router: Router) {}


  // Méthode

  // Méthode appelée lors de la soumission du formulaire
  onSubmit() {
    const success = this.authService.logIn(this.login, this.password);
    if (success) {
      this.router.navigate(['/home']);
    } else {
      this.errorMessage = 'Login ou mot de passe incorrect';
    }
  }
}
