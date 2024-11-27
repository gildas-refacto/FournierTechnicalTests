export interface Pokemon {
  id: number;
  name: string;
  image: {
    regular: string;
    shiny: string;
  }
  types: { name: string; image: string; }[];
  height: number;
  weight: number;
}
