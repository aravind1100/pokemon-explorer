export interface PokeApiNamedResource {
  name: string;
  url: string;
}

export interface PokeApiListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokeApiNamedResource[];
}

export interface PokemonListItem {
  id: number;
  name: string;
  displayName: string;
  image: string;
  sprite: string;
}

export interface PokemonAbilityEntry {
  is_hidden: boolean;
  slot: number;
  ability: {
    name: string;
    url: string;
  };
}

export interface PokemonTypeEntry {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonStatEntry {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonMoveEntry {
  move: {
    name: string;
    url: string;
  };
  version_group_details: Array<{
    level_learned_at: number;
    move_learn_method: {
      name: string;
    };
  }>;
}

export interface PokeApiDetailResponse {
  id: number;
  name: string;
  height: number; // Decimeters
  weight: number; // Hectograms
  base_experience: number;
  abilities: PokemonAbilityEntry[];
  types: PokemonTypeEntry[];
  stats: PokemonStatEntry[];
  moves: PokemonMoveEntry[];
  sprites: {
    front_default: string | null;
    front_shiny: string | null;
    other?: {
      'official-artwork'?: {
        front_default: string | null;
        front_shiny: string | null;
      };
      home?: {
        front_default: string | null;
      };
    };
  };
}

export interface PokemonDetailData {
  id: number;
  name: string;
  displayName: string;
  genus: string;
  flavorText: string;
  heightMeters: string;
  weightKg: string;
  baseExperience: number;
  artworkDefault: string;
  artworkShiny: string;
  spriteDefault: string;
  types: string[];
  abilities: Array<{
    name: string;
    isHidden: boolean;
  }>;
  stats: Array<{
    key: string;
    label: string;
    value: number;
  }>;
  totalBaseStats: number;
  moves: Array<{
    name: string;
    learnMethod: string;
    levelLearnedAt: number;
  }>;
}
