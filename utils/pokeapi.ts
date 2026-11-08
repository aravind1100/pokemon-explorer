import {
  PokeApiListResponse,
  PokeApiDetailResponse,
  PokemonListItem,
  PokemonDetailData,
} from '@/types/pokemon';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

export function formatDisplayName(rawName: string): string {
  return rawName
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function formatDexNumber(id: number): string {
  return `#${String(id).padStart(4, '0')}`;
}

export function extractPokemonIdFromUrl(url: string): number {
  const segments = url.replace(/\/$/, '').split('/');
  return Number(segments[segments.length - 1]);
}

export function getOfficialArtworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function getClassicSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export const TYPE_BADGE_STYLES: Record<
  string,
  { bg: string; text: string; border: string; accentHex: string }
> = {
  normal:   { bg: 'bg-stone-100',   text: 'text-stone-800',   border: 'border-stone-300',   accentHex: '#78716c' },
  fire:     { bg: 'bg-orange-100',  text: 'text-orange-900',  border: 'border-orange-300',  accentHex: '#ea580c' },
  water:    { bg: 'bg-sky-100',     text: 'text-sky-900',     border: 'border-sky-300',     accentHex: '#0284c7' },
  electric: { bg: 'bg-amber-100',   text: 'text-amber-900',   border: 'border-amber-300',   accentHex: '#d97706' },
  grass:    { bg: 'bg-emerald-100', text: 'text-emerald-900', border: 'border-emerald-300', accentHex: '#059669' },
  ice:      { bg: 'bg-cyan-100',    text: 'text-cyan-900',    border: 'border-cyan-300',    accentHex: '#0891b2' },
  fighting: { bg: 'bg-red-100',     text: 'text-red-900',     border: 'border-red-300',     accentHex: '#dc2626' },
  poison:   { bg: 'bg-purple-100',  text: 'text-purple-900',  border: 'border-purple-300',  accentHex: '#9333ea' },
  ground:   { bg: 'bg-yellow-100',  text: 'text-yellow-900',  border: 'border-yellow-400',  accentHex: '#ca8a04' },
  flying:   { bg: 'bg-indigo-100',  text: 'text-indigo-900',  border: 'border-indigo-300',  accentHex: '#4f46e5' },
  psychic:  { bg: 'bg-pink-100',    text: 'text-pink-900',    border: 'border-pink-300',    accentHex: '#db2777' },
  bug:      { bg: 'bg-lime-100',    text: 'text-lime-900',    border: 'border-lime-300',    accentHex: '#65a30d' },
  rock:     { bg: 'bg-amber-50',    text: 'text-stone-800',   border: 'border-stone-400',   accentHex: '#78716c' },
  ghost:    { bg: 'bg-violet-100',  text: 'text-violet-900',  border: 'border-violet-300',  accentHex: '#7c3aed' },
  dragon:   { bg: 'bg-blue-100',    text: 'text-blue-900',    border: 'border-blue-300',    accentHex: '#2563eb' },
  dark:     { bg: 'bg-zinc-200',    text: 'text-zinc-900',    border: 'border-zinc-400',    accentHex: '#3f3f46' },
  steel:    { bg: 'bg-slate-200',   text: 'text-slate-800',   border: 'border-slate-300',   accentHex: '#475569' },
  fairy:    { bg: 'bg-rose-100',    text: 'text-rose-900',    border: 'border-rose-300',    accentHex: '#e11d48' },
};

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
};

/**
 * Fetches the Pokémon directory list from PokeAPI.
 */
export async function fetchPokemonList(limit: number = 386): Promise<PokemonListItem[]> {
  const response = await fetch(`${POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=0`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon list from PokeAPI (status: ${response.status})`);
  }

  const data: PokeApiListResponse = await response.json();

  return data.results.map((item) => {
    const id = extractPokemonIdFromUrl(item.url);
    return {
      id,
      name: item.name,
      displayName: formatDisplayName(item.name),
      image: getOfficialArtworkUrl(id),
      sprite: getClassicSpriteUrl(id),
    };
  });
}

/**
 * Fetches detailed stats, abilities, types, moves, and species flavor text for a single Pokémon.
 */
export async function fetchPokemonDetail(idOrName: string | number): Promise<PokemonDetailData> {
  const detailRes = await fetch(`${POKEAPI_BASE_URL}/pokemon/${idOrName}`);
  if (!detailRes.ok) {
    throw new Error(`Pokemon ${idOrName} not found (status: ${detailRes.status})`);
  }
  const raw: PokeApiDetailResponse = await detailRes.json();

  let genus = 'Pokémon';
  let flavorText = 'Field research data documented in the National Pokédex archive.';

  try {
    const speciesRes = await fetch(`${POKEAPI_BASE_URL}/pokemon-species/${raw.id}`);
    if (speciesRes.ok) {
      const speciesData = await speciesRes.json();
      const englishGenus = speciesData.genera?.find(
        (g: { language: { name: string }; genus: string }) => g.language.name === 'en'
      );
      if (englishGenus?.genus) {
        genus = englishGenus.genus;
      }

      const englishFlavor = speciesData.flavor_text_entries?.find(
        (f: { language: { name: string }; flavor_text: string }) => f.language.name === 'en'
      );
      if (englishFlavor?.flavor_text) {
        // Strip ROM control characters (, , ) from flavor text
        flavorText = englishFlavor.flavor_text.replace(/[\n\f\r]+/g, ' ');
      }
    }
  } catch {
    // Non-fatal fallback if species endpoint is temporarily unreachable
  }

  const stats = raw.stats.map((s) => ({
    key: s.stat.name,
    label: STAT_LABELS[s.stat.name] || formatDisplayName(s.stat.name),
    value: s.base_stat,
  }));

  const totalBaseStats = stats.reduce((sum, item) => sum + item.value, 0);

  const moves = raw.moves
    .map((m) => {
      const latestDetail = m.version_group_details[m.version_group_details.length - 1];
      return {
        name: formatDisplayName(m.move.name),
        learnMethod: latestDetail?.move_learn_method?.name || 'level-up',
        levelLearnedAt: latestDetail?.level_learned_at ?? 0,
      };
    })
    .sort((a, b) => {
      if (a.learnMethod === 'level-up' && b.learnMethod !== 'level-up') return -1;
      if (a.learnMethod !== 'level-up' && b.learnMethod === 'level-up') return 1;
      return a.levelLearnedAt - b.levelLearnedAt;
    });

  return {
    id: raw.id,
    name: raw.name,
    displayName: formatDisplayName(raw.name),
    genus,
    flavorText,
    heightMeters: `${(raw.height / 10).toFixed(1)} m`,
    weightKg: `${(raw.weight / 10).toFixed(1)} kg`,
    baseExperience: raw.base_experience ?? 0,
    artworkDefault:
      raw.sprites.other?.['official-artwork']?.front_default ||
      getOfficialArtworkUrl(raw.id),
    artworkShiny:
      raw.sprites.other?.['official-artwork']?.front_shiny ||
      raw.sprites.front_shiny ||
      getOfficialArtworkUrl(raw.id),
    spriteDefault: raw.sprites.front_default || getClassicSpriteUrl(raw.id),
    types: raw.types.map((t) => t.type.name),
    abilities: raw.abilities.map((a) => ({
      name: formatDisplayName(a.ability.name),
      isHidden: a.is_hidden,
    })),
    stats,
    totalBaseStats,
    moves,
  };
}
