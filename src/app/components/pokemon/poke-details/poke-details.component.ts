import { NgOptimizedImage } from '@angular/common';
import { Component, ElementRef, input, OnInit, signal, viewChild } from '@angular/core';
import { Pokemon } from '@components/pokemon/services/models';

@Component({
  selector: 'app-poke-details',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './poke-details.component.html',
})
export class PokeDetailsComponent implements OnInit {
  pokemon = input.required<Pokemon>();
  slidesElements = viewChild<ElementRef<HTMLElement>>('slides')
  image = signal('Classique')

  currentScroll = 0;
  clientWidth = 0;

  ngOnInit(): void {
    this.clientWidth = this.slidesElements()?.nativeElement?.clientWidth ?? 0;
  }

  toggleImage(): void {
    this.image.update(image => {
      return (image === 'Classique') ? 'Shiny' : 'Classique';
    })
    if (this.currentScroll < this.clientWidth) {
      this.currentScroll += this.clientWidth;
    } else {
      this.currentScroll = 0;
    }
    this.slidesElements()?.nativeElement.scrollTo({ left: this.currentScroll })
  }
}
