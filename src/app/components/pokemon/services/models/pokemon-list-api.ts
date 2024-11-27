export interface PokemonListApi {
  pokedex_id: number;
  name: {
    fr: string;
  };
  sprites: {
    regular: string;
    shiny: string;
  };
  types: { name: string; image: string; }[];
  height: number;
  weight: number;
}
