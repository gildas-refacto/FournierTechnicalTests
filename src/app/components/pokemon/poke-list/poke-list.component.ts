import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PokemonList } from '@components/pokemon/services';

@Component({
  selector: 'app-poke-list',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink
  ],
  templateUrl: './poke-list.component.html',
})
export class PokeListComponent {
  pokemonsList = input.required<PokemonList[]>();
}
