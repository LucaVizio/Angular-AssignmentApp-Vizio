import { Directive, ElementRef } from '@angular/core';

// Directive pour styliser les devoirs rendus
@Directive({
  selector: '[appRendu]'
})
export class Rendu {

  // Constructeur

  // Injection de l'élément DOM
  constructor(el: ElementRef) { const element = el.nativeElement;
                                element.style.fontWeight = 'bold';
                                element.style.color = 'green';
                                element.style.border = '2px solid green';
  }
}
