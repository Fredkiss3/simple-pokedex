import * as React from "react";
import type { Pokemon } from "./pokemon-card";
import { PokemonCard, PokemonCardSkeleton } from "./pokemon-card";
import { SearchInput } from "./search-input";

export async function generateMetadata(props: {
  searchParams?: Promise<Record<string, string | undefined>>;
}) {
  const query = (await props.searchParams)?.search;
  return {
    title: query ? `Searching for ${query}` : "Search page"
  };
}
export default async function Page(props: {
  searchParams?: Promise<Record<string, string | undefined>>;
}) {
  const keyString = `search=${(await props.searchParams)?.search}&wait=${(await props.searchParams)?.wait}`;
  return (
    <section className="flex flex-col">
      <SearchInput />
      {(await props.searchParams)?.search ? (
        <React.Suspense
          key={keyString}
          fallback={
            <ul className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 py-4 pb-52 place-items-stretch">
              <PokemonCardSkeleton />
              <PokemonCardSkeleton />
              <PokemonCardSkeleton />
              <PokemonCardSkeleton />
            </ul>
          }
        >
          <PokemonList name={(await props.searchParams)?.search} />
        </React.Suspense>
      ) : (
        <div className="col-span-full py-8 px-4 flex items-center gap-8 justify-center">
          <hr className="h-px w-20 text-gray-100/20" />
          <p className="text-center flex-none italic">Search for a pokemon</p>
          <hr className="h-px w-20 text-gray-100/20" />
        </div>
      )}
    </section>
  );
}

async function PokemonList(props: { name: string }) {
  const pokemons = await fetch(`https://graphql.pokeapi.co/v1beta2`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: /* GraphQL */ `
        query ($name: String!) {
          pokemons: pokemon(
            where: { name: { _ilike: $name } }
            limit: 20
          ) {
            name
            id
          }
        }
      `,
      variables: {
        name: `${props.name}%`
      }
    })
  })
    .then(
      (r) =>
        r.json() as Promise<{
          data: { pokemons: Array<Pokemon> };
        }>
    )
    .then((result) => result.data?.pokemons ?? []);

  return (
    <div
      className={`grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 py-4 pb-52 place-items-stretch`}
    >
      {pokemons.map((p) => (
        <li className="list-none" key={p.id}>
          <PokemonCard pokemon={p} addToTeam />
        </li>
      ))}
      {props.name.length > 0 && pokemons.length === 0 && (
        <li className="list-none text-center italic col-span-full py-8">
          No results found for `{props.name}`
        </li>
      )}
    </div>
  );
}
