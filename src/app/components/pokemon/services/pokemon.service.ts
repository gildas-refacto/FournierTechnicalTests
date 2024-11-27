import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { Pagination } from 'src/app/shared/components/pagination/models';
import { Pokemon, PokemonList, PokemonListApi, PokemonQuery } from './models';

const API_URL = 'https://tyradex.app/api/v1';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  #httpClient = inject(HttpClient);

  #pokemonsListStore = signal<PokemonList[] | null>(null);
  #pokemonDetailsStore = signal(new Map<number, Pokemon>());
  #queryStore = signal<PokemonQuery>(null!)
  queryStore = this.#queryStore.asReadonly();

  list(query: PokemonQuery): Observable<Pagination<PokemonList>> {
    if (this.#pokemonsListStore() === null) {
      return this.#retrievePokemonList().pipe(
        map(pokemons => this.#applyFilters(pokemons, query))
      )
    } else {
      return of(this.#applyFilters(this.#pokemonsListStore()!, query));
    }
  }

  read(id: string): Observable<Pokemon> {
    if (this.#pokemonDetailsStore().get(Number(id))) {
      return of(this.#pokemonDetailsStore().get(Number(id))!);
    } else {
      return this.#httpClient.get<PokemonListApi>(`${API_URL}/pokemon/${id}`)
        .pipe(
          map(pokemon => ({
            id: pokemon.pokedex_id,
            name: pokemon.name.fr,
            image: {
              regular: pokemon.sprites.regular,
              shiny: pokemon.sprites.shiny
            },
            types: pokemon.types,
            height: pokemon.height,
            weight: pokemon.weight,
          })),
          tap(pokemon => this.#pokemonDetailsStore.update(pokemonDetails =>
            pokemonDetails.set(pokemon.id, pokemon)
          ))
        )
    }
  }

  #retrievePokemonList(): Observable<PokemonList[]> {
    return this.#httpClient.get<PokemonListApi[]>(`${API_URL}/gen/1`)
      .pipe(
        map(pokemonsList => pokemonsList.map(pokemon => ({
          id: pokemon.pokedex_id,
          name: pokemon.name.fr,
          image: pokemon.sprites.regular
        }))),
        tap(pokemonsList => this.#pokemonsListStore.set(pokemonsList)),
      );
  }

  #applyFilters(pokemons: PokemonList[], query: PokemonQuery): Pagination<PokemonList> {
    let filteredPokemons = [...pokemons];

    if (query.search) {
      const searchLower = query.search.toLowerCase();
      filteredPokemons = filteredPokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchLower)
      );
    }

    const startIndex = (query.page - 1) * query.limit;
    const endIndex = startIndex + query.limit;
    const results = filteredPokemons.slice(startIndex, endIndex);
    this.#queryStore.set(query);
    return { items: results, limit: query.limit, page: query.page, total: filteredPokemons.length ?? 0 };
  }
}
