import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "~/db";
import { teams } from "~/db/schema";

const createTeamSchema = z
	.object({
		pokemon_ids: z.array(z.number().int().positive()).min(1).max(6),
		pokemon_names: z.array(z.string().min(1)).min(1).max(6),
	})
	.refine((d) => d.pokemon_ids.length === d.pokemon_names.length, {
		message: "pokemon_ids and pokemon_names must have the same length",
	});

function generateSlug(length = 10): string {
	const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
	return Array.from(
		{ length },
		() => chars[Math.floor(Math.random() * chars.length)],
	).join("");
}

export async function POST(request: Request) {
	const parsed = createTeamSchema.safeParse(await request.json());

	if (!parsed.success) {
		return NextResponse.json(
			{ error: z.treeifyError(parsed.error) },
			{ status: 400 },
		);
	}

	const { pokemon_ids: pokemonIds, pokemon_names: pokemonNames } = parsed.data;

	let slug = "";
	for (let attempts = 0; attempts < 10; attempts++) {
		const candidate = generateSlug();
		const existing = await db
			.select()
			.from(teams)
			.where(eq(teams.slug, candidate))
			.limit(1);
		if (existing.length === 0) {
			slug = candidate;
			break;
		}
	}

	if (!slug) {
		return NextResponse.json(
			{ error: "Could not generate a unique slug" },
			{ status: 500 },
		);
	}

	const [team] = await db
		.insert(teams)
		.values({ slug, pokemon_ids: pokemonIds, pokemon_names: pokemonNames })
		.returning();

	return NextResponse.json({ url: `/team/${team.slug}` });
}
