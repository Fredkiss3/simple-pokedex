import {
	integer,
	pgTable,
	serial,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";

export const teams = pgTable("teams", {
	id: serial("id").primaryKey(),
	slug: varchar("slug", { length: 12 }).unique().notNull(),
	pokemon_ids: integer("pokemon_ids").array().notNull(),
	pokemon_names: text("pokemon_names").array().notNull(),
	created_at: timestamp("created_at").defaultNow(),
});
