import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "~/db";
import { PokemonCard } from "~/pokemon-card";
import { teams } from "~/db/schema";
import { CopyLinkButton } from "./copy-link-button";

export default async function TeamPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [team] = await db
    .select()
    .from(teams)
    .where(eq(teams.slug, slug))
    .limit(1);

  if (!team) notFound();

  const pokemons = team.pokemon_ids.map((id, i) => ({
    id,
    name: team.pokemon_names[i]
  }));

  return (
    <section className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Shared Team</h1>
          <p className="text-gray-400 text-sm mt-1">
            Slug:{" "}
            <code className="font-mono bg-zinc-800 px-1.5 py-0.5 rounded">
              {slug}
            </code>
          </p>
        </div>
        <CopyLinkButton />
      </div>

      <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
        {pokemons.map((p) => (
          <li key={p.id} className="list-none">
            <PokemonCard pokemon={p} />
          </li>
        ))}
      </ul>

      <div className="flex justify-center items-center pt-4 pb-8 gap-4">
        <Link
          href="/"
          className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-6 py-3 rounded-lg"
        >
          Build your own team
        </Link>
      </div>
    </section>
  );
}

