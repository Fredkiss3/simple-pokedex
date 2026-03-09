/** biome-ignore-all lint/performance/noImgElement: we don't want image optimization */
import { AddToTeamButton } from "./add-to-team-button";

export type Pokemon = { id: number; name: string };

const TYPE_COLORS: Record<string, string> = {
  normal: "#A8A878",
  fire: "#DC2626",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#4B2D8C",
  steel: "#B8B8D0",
  fairy: "#EE99AC"
};

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SP.ATK",
  "special-defense": "SP.DEF",
  speed: "SPD"
};

type PokeApiData = {
  types: { slot: number; type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  abilities: { ability: { name: string }; is_hidden: boolean }[];
  height: number; // decimetres
  weight: number; // hectograms
  base_experience: number | null;
};

async function fetchPokemonData(id: number): Promise<PokeApiData | null> {
  try {
    return await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, {
      next: { revalidate: 86400 }
    }).then((r) => r.json() as Promise<PokeApiData>);
  } catch {
    return null;
  }
}

export async function PokemonCard({
  pokemon,
  addToTeam = false
}: {
  pokemon: Pokemon;
  addToTeam?: boolean;
}) {
  const data = await fetchPokemonData(pokemon.id);

  const types = data?.types
    .sort((a, b) => a.slot - b.slot)
    .map((t) => t.type.name) ?? ["normal"];
  const accent = TYPE_COLORS[types[0]] ?? TYPE_COLORS.normal;
  const stats = data?.stats ?? [];
  const abilities =
    data?.abilities.filter((a) => !a.is_hidden).map((a) => a.ability.name) ??
    [];
  const hiddenAbility = data?.abilities.find((a) => a.is_hidden)?.ability.name;
  const height = data ? `${(data.height / 10).toFixed(1)} m` : "—";
  const weight = data ? `${(data.weight / 10).toFixed(1)} kg` : "—";

  const pokemonPNGURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
  const pokemonGIFURL = `https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/other/showdown/${pokemon.id}.gif`;

  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col bg-zinc-800 shadow-md h-full"
      style={{ borderTop: `4px solid ${accent}` }}
    >
      {/* Header */}
      <div className="px-4 pt-3 pb-1 flex items-start justify-between gap-2">
        <span className="font-bold text-white capitalize text-base leading-tight">
          {pokemon.name}
        </span>
        <div className="flex flex-col items-end gap-1 flex-none">
          <span className="text-xs text-zinc-500 font-mono">
            #{String(pokemon.id).padStart(3, "0")}
          </span>
          <div className="flex gap-1">
            {types.map((t) => (
              <span
                key={t}
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded capitalize"
                style={{
                  background: `${TYPE_COLORS[t] ?? accent}33`,
                  color: TYPE_COLORS[t] ?? accent
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Artwork */}
      <div className="relative group flex items-center justify-center bg-zinc-900/50 p-4 h-[160px]">
        <img
          width={140}
          height={140}
          src={pokemonGIFURL}
          alt={pokemon.name}
          className="object-contain drop-shadow hidden group-hover:block h-full"
        />
        <img
          width={140}
          height={140}
          src={pokemonPNGURL}
          alt={pokemon.name}
          className="object-contain drop-shadow group-hover:hidden h-full"
        />
      </div>

      {/* Stats */}
      {stats.length > 0 && (
        <div className="px-4 pt-3 pb-1 flex flex-col gap-1.5">
          {stats.map(({ stat, base_stat }) => {
            const label = STAT_LABELS[stat.name] ?? stat.name;
            const pct = Math.min(100, Math.round((base_stat / 255) * 100));
            return (
              <div key={stat.name} className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-400 font-mono w-12 flex-none">
                  {label}
                </span>
                <div className="flex-1 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: accent }}
                  />
                </div>
                <span className="text-[10px] text-zinc-400 font-mono w-7 text-right flex-none">
                  {base_stat}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Physical + Abilities */}
      <div className="px-4 pt-2 pb-3 flex flex-col gap-2 border-t border-zinc-700 mt-2">
        <div className="flex gap-4 text-xs text-zinc-400">
          <span>
            <span className="text-zinc-500">HT </span>
            {height}
          </span>
          <span>
            <span className="text-zinc-500">WT </span>
            {weight}
          </span>
          {data?.base_experience != null && (
            <span>
              <span className="text-zinc-500">EXP </span>
              {data.base_experience}
            </span>
          )}
        </div>
        {abilities.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {abilities.map((a) => (
              <span
                key={a}
                className="text-[10px] bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded capitalize"
              >
                {a.replace("-", " ")}
              </span>
            ))}
            {hiddenAbility && (
              <span className="text-[10px] bg-zinc-700/50 text-zinc-500 px-1.5 py-0.5 rounded capitalize italic">
                {hiddenAbility.replace("-", " ")}
              </span>
            )}
          </div>
        )}

        {addToTeam && <AddToTeamButton pokemon={pokemon} />}
      </div>
    </div>
  );
}

export function PokemonCardSkeleton() {
  return (
    <div className="border rounded-md bg-gray-600 border-gray-200 font-normal p-2 flex flex-col gap-4">
      <span className="sr-only">Loading pokemon...</span>
      <div className="flex gap-2 bg-slate-400 h-4 rounded animate-pulse" />

      <div className="h-[200px] w-full bg-slate-400 rounded animate-pulse" />

      <div className="flex gap-2 bg-slate-400 h-4 rounded animate-pulse" />
    </div>
  );
}
