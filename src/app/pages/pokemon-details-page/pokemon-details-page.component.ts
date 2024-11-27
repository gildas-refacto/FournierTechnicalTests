import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonService } from '@components/pokemon';
import { PokeDetailsComponent } from '@components/pokemon/poke-details';
import { Pokemon } from '@components/pokemon/services/models';
import { tap } from 'rxjs';

@Component({
  selector: 'app-pokemon-details-page',
  standalone: true,
  imports: [PokeDetailsComponent],
  templateUrl: './pokemon-details-page.component.html',
})
export class PokemonDetailsPageComponent implements OnInit {
  pokemon = signal<Pokemon>(null!);
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);
  readonly #pokemonService = inject(PokemonService);

  ngOnInit(): void {
    const id = this.#route.snapshot.paramMap.get('id');
    if (!id) return;
    this.#pokemonService.read(id)
      .pipe(
        tap(pokemon => this.pokemon.set(pokemon))
      )
      .subscribe()
  }

  back(): void {
    void this.#router.navigate(['']);
  }
}
