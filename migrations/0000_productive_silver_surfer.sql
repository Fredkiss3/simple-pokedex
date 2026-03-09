CREATE TABLE "teams" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(12) NOT NULL,
	"pokemon_ids" integer[] NOT NULL,
	"pokemon_names" text[] NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "teams_slug_unique" UNIQUE("slug")
);
