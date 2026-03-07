/** biome-ignore-all lint/performance/noImgElement: we don't want image optimization */
import { AddToTeamButton } from "./add-to-team-button";

export type Pokemon = { id: number; name: string };

export function PokemonCard({
  pokemon,
  addToTeam = false,
}: {
  pokemon: Pokemon;
  addToTeam?: boolean;
}) {
  const pokemonPNGURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
  const pokemonGIFURL = `https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/other/showdown/${pokemon.id}.gif`;

  return (
    <dl className="border rounded-md bg-gray-600 border-gray-200 font-normal p-2 flex flex-col gap-4">
      <div className="flex gap-2 justify-center items-center">
        <dt>ID : </dt>
        <dd>
          <strong>{pokemon.id}</strong>
        </dd>
      </div>

      <div className="relative h-[200px] w-full group flex items-center justify-center">
        <img
          width={200}
          height={200}
          src={pokemonGIFURL}
          alt={pokemon.name}
          className="size-full hidden group-hover:inline self-center object-contain drop-shadow-md z-10"
        />
        <img
          width={200}
          height={200}
          src={pokemonPNGURL}
          alt={pokemon.name}
          className="size-full self-center group-hover:hidden object-contain drop-shadow-md relative z-1"
        />
      </div>

      <div className="flex gap-2 justify-center items-center">
        <dt>Name: </dt>
        <dd>{pokemon.name}</dd>
      </div>

      {addToTeam && <AddToTeamButton pokemon={pokemon} />}
    </dl>
  );
}
