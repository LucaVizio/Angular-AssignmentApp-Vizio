import { Injectable } from '@angular/core';


// Interface pour les utilisateurs
interface User {
  login: string;
  password: string;
  role: 'user' | 'admin';
}


/**
 * Service pour l'authentification des utilisateurs
 */
@Injectable({
  providedIn: 'root'
})
export class Auth {

  // Attributs
  loggedIn = false;
  currentUser: User | null = null;


  // Tableau des utilisateurs avec login/password/role
  private users: User[] = [
    { login: 'admin', password: 'admin', role: 'admin' },
    { login: 'user', password: 'user', role: 'user' }
  ];


  // Constructeur

  constructor() { }


  // Méthodes

  // Méthode pour se connecter avec login/password
  logIn(login: string, password: string): boolean {
    const user = this.users.find(u => u.login === login && u.password === password);
    if (user) {
      this.loggedIn = true;
      this.currentUser = user;
      return true;
    }
    return false;
  }

  // Méthode pour se déconnecter
  logOut() {
    this.loggedIn = false;
    this.currentUser = null;
  }

  // Méthode pour vérifier si l'utilisateur est connecté
  isLogged(): boolean {
    return this.loggedIn;
  }

  // Méthode pour vérifier si l'utilisateur est admin
  isAdmin(): Promise<boolean> {
    const isUserAdmin = new Promise<boolean>(
      (resolve, reject) => {
        resolve(this.loggedIn && this.currentUser?.role === 'admin');
      }
    )
    return isUserAdmin;
  }

  // Méthode synchrone pour vérifier si l'utilisateur est admin
  isAdminSync(): boolean {
    return this.loggedIn && this.currentUser?.role === 'admin';
  }
}
