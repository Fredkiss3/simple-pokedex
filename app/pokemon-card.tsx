/** biome-ignore-all lint/performance/noImgElement: we don't want image optimization */
import { AddToTeamButton } from "./add-to-team-button";

export type Pokemon = { id: number; name: string };

const TYPE_COLORS: Record<string, string> = {
  normal: "#A8A878",
  fire: "#F08030",
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
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC"
};

async function getPrimaryType(id: number): Promise<string> {
  try {
    const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, {
      next: { revalidate: 86400 } // cache for 24h — types never change
    }).then(
      (r) =>
        r.json() as Promise<{
          types: { slot: number; type: { name: string } }[];
        }>
    );

    return data.types.find((t) => t.slot === 1)?.type.name ?? "normal";
  } catch {
    return "normal";
  }
}

export async function PokemonCard({
  pokemon,
  addToTeam = false
}: {
  pokemon: Pokemon;
  addToTeam?: boolean;
}) {
  const type = await getPrimaryType(pokemon.id);
  const accent = TYPE_COLORS[type] ?? TYPE_COLORS.normal;

  const pokemonPNGURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
  const pokemonGIFURL = `https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/other/showdown/${pokemon.id}.gif`;

  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col bg-zinc-800 shadow-md"
      style={{ borderTop: `4px solid ${accent}` }}
    >
      {/* Artwork */}
      <div className="relative group flex items-center justify-center bg-zinc-900/50 p-4 h-[180px]">
        <img
          width={160}
          height={160}
          src={pokemonGIFURL}
          alt={pokemon.name}
          className="object-contain drop-shadow hidden group-hover:block h-full"
        />
        <img
          width={160}
          height={160}
          src={pokemonPNGURL}
          alt={pokemon.name}
          className="object-contain drop-shadow group-hover:hidden h-full"
        />
      </div>

      {/* Info */}
      <div className="px-4 py-3 flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <span className="font-bold text-white capitalize text-base">
            {pokemon.name}
          </span>
          <span
            className="text-xs font-medium px-1.5 py-0.5 rounded capitalize"
            style={{ background: `${accent}`, color: "black" }}
          >
            {type}
          </span>
        </div>

        <span className="text-xs text-zinc-500 font-mono">
          #{String(pokemon.id).padStart(3, "0")}
        </span>

        {addToTeam && <AddToTeamButton pokemon={pokemon} />}
      </div>
    </div>
  );
}
