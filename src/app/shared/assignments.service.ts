import { Injectable } from '@angular/core';
import { Assignment } from '../assignments/assignment.model';
import { Observable, of, forkJoin } from 'rxjs';
import { Logging } from './logging';
import { HttpClient } from '@angular/common/http';
import { bdInitialAssignments } from './data';


/**
 * Service pour gérer les devoirs
 */
@Injectable({
  providedIn: 'root'
})
export class AssignmentsService {

  // URL du backend
  backendUrl: string = 'https://api-angular-assignmentapp-vizio.onrender.com/api/assignments';

  // Constructeur

  // Injection du service de logging
  constructor(private logging: Logging,
              private http: HttpClient) {}


  // Méthodes

  // Méthode pour obtenir la liste des devoirs
  getAssignments(): Observable<any> {
    return this.http.get<any>(this.backendUrl);
  }

  // Méthode pour obtenir un devoir par son ID
  getAssignment(id: number): Observable<any> {
    return this.http.get<any>(this.backendUrl + '/' + id);
  }

  // Méthode pour ajouter un devoir
  addAssignment(assignment: Assignment): Observable<any> {
    this.logging.log(assignment.nom, 'ajouté');
    return this.http.post<any>(this.backendUrl, assignment);
  }

  // Méthode pour mettre à jour un devoir
  updateAssignment(assignment: Assignment): Observable<any> {
    this.logging.log(assignment.nom, 'mis à jour');
    return this.http.put<any>(this.backendUrl + '/' + assignment.id, assignment);
  }

  // Méthode pour supprimer un devoir
  deleteAssignment(assignment: Assignment): Observable<any> {
    this.logging.log(assignment.nom, 'supprimé');
    return this.http.delete<any>(this.backendUrl + '/' + assignment.id);
  }

  // Code fournit pour remplir la BD :

  peuplerBDavecForkJoin(): Observable<any> {
    let appelsVersAddAssignment: Observable<any>[] = [];

    bdInitialAssignments.forEach(a => {
      const nouvelAssignment = new Assignment();
      nouvelAssignment.id = a.id;
      nouvelAssignment.nom = a.nom;
      nouvelAssignment.dateDeRendu = new Date(a.dateDeRendu);
      nouvelAssignment.rendu = a.rendu;

      appelsVersAddAssignment.push(this.addAssignment(nouvelAssignment));
    });

    return forkJoin(appelsVersAddAssignment);
  }

  peuplerBD(): Observable<any> {
    // Meilleure version avec forkJoin
    return this.peuplerBDavecForkJoin();
  }

  getAssignmentsPagine(page: number, limit: number): Observable<any> {
    return this.http.get<any>(this.backendUrl + `?page=${page}&limit=${limit}`);
  }
}
