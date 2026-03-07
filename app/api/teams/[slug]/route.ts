import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "~/db";
import { teams } from "~/schema";

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ slug: string }> },
) {
	const { slug } = await params;

	const [team] = await db
		.select()
		.from(teams)
		.where(eq(teams.slug, slug))
		.limit(1);

	if (!team) {
		return NextResponse.json({ error: "Team not found" }, { status: 404 });
	}

	const pokemons = team.pokemon_ids.map((id, i) => ({
		id,
		name: team.pokemon_names[i],
	}));

	return NextResponse.json({ slug: team.slug, pokemons });
}
