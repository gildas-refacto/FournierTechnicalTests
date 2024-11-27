import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    title: 'Liste des pokemons',
    loadComponent: () => import('@pages/pokemon-list-page').then((m) => m.PokemonListPageComponent),
  },
  {
    path: 'pokemon/:id',
    title: 'Pokémon',
    loadComponent: () => import('@pages/pokemon-details-page').then((m) => m.PokemonDetailsPageComponent),
  }
];
