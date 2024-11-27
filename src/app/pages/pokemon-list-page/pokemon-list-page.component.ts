import { Component, effect, inject, signal } from '@angular/core';
import { PokeListComponent, PokemonQuery, PokemonService } from '@components/pokemon';
import { PokemonList } from '@components/pokemon/services';
import { LIMIT, START_PAGE } from '@pages/pokemon-list-page';
import { take, tap } from 'rxjs';
import { Pagination, PaginationComponent } from 'src/app/shared/components/pagination';
import { SearchBarComponent } from 'src/app/shared/components/search-bar';

@Component({
  selector: 'app-pokemon-list-page',
  standalone: true,
  imports: [PokeListComponent, SearchBarComponent, PaginationComponent],
  templateUrl: './pokemon-list-page.component.html',
})
export class PokemonListPageComponent {
  pokemonsList = signal<Pagination<PokemonList>>(null!);

  readonly #pokemonService = inject(PokemonService);
  #queryStore = this.#pokemonService.queryStore;
  currentPage = signal(this.#queryStore()?.page ?? START_PAGE);
  searchValue = signal<string>(this.#queryStore()?.search ?? '');

  constructor() {
    let previousParams: Omit<PokemonQuery, 'limit'> | null = null;

    effect(() => {
      if (
        previousParams &&
        previousParams.page === this.currentPage() &&
        previousParams.search === this.searchValue()
      ) return;
      if (previousParams && previousParams.search !== this.searchValue()) {
        this.currentPage.set(START_PAGE);
      }
      previousParams = { page: this.currentPage(), search: this.searchValue() };
      this.#retrievePokemons();
    }, { allowSignalWrites: true });
  }

  #retrievePokemons(): void {
    this.#pokemonService.list({
      page: this.currentPage(),
      limit: LIMIT,
      search: this.searchValue(),
    })
      .pipe(
        take(1),
        tap(list => {
          this.pokemonsList.set(list);
        }),
      )
      .subscribe();
  }
}
