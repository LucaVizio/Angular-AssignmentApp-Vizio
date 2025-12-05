import { Injectable } from '@angular/core';


/**
 * Service pour le logging des actions sur les devoirs
 */
@Injectable({
  providedIn: 'root'
})
export class Logging {

  // Méthodes

  // Méthode pour logger une action sur un devoir
  log(nomDevoir: string, action: string) {
    console.log(`Le devoir "${nomDevoir}" a été ${action}.`);
  }
}
