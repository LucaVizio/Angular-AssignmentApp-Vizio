/**
 * Modèle représentant un devoir
 */
export class Assignment {

    // Attributs du devoir
    
    _id?: string;
    id!: number;
    nom!: string;
    dateDeRendu!: Date;
    rendu!: boolean
}