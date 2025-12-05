import { Directive, ElementRef } from '@angular/core';

// Directive pour styliser les devoirs non rendus
@Directive({
  selector: '[appNonRendu]'
})
export class NonRendu {

  // Constructeur

  // Injection de l'élément DOM
  constructor(el: ElementRef) {
    const element = el.nativeElement;
    element.style.fontWeight = 'bold';
    element.style.color = 'red';
    element.style.border = '2px dashed red';
  }
}
