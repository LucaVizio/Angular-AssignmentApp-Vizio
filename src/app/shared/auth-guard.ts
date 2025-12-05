import { CanActivateFn, Router } from '@angular/router';
import { Auth } from './auth';
import { inject } from '@angular/core';


/**
 * Gardien de route pour protéger les routes nécessitant une authentification admin
 */
export const authGuard: CanActivateFn = (route, state) => {
  
  // Injection des services nécessaires
  let authService = inject(Auth);
  let router = inject(Router);

  // Vérification de l'authentification
  return authService.isAdmin().then(authentifie => {
    if(authentifie) {
      console.log("Vous êtes administrateur/trice, navigation autorisée !");
      return true;
    }
    else {
      console.log("Vous n'êtes pas administrateur/trice, navigation refusée !");
      router.navigate(['/home']);
      return false;
    }
  })
}
