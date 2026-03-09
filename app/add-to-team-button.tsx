/** biome-ignore-all lint/a11y/useButtonType: just because */
"use client";

import * as React from "react";
import { type TeamPokemon, useTeam } from "./team-context";

export function AddToTeamButton({ pokemon }: { pokemon: TeamPokemon }) {
  const { team, addToTeam, removeFromTeam } = useTeam();
  const isInTeam = team.some((p) => p.id === pokemon.id);
  const isFull = team.length >= 6 && !isInTeam;

  if (isFull) {
    return (
      <button
        disabled
        className="w-full text-sm py-1.5 px-3 rounded bg-gray-700 text-gray-500 cursor-not-allowed my-1"
      >
        Team full
      </button>
    );
  }

  return (
    <button
      onClick={() =>
        isInTeam ? removeFromTeam(pokemon.id) : addToTeam(pokemon)
      }
      className={`w-full text-sm py-1.5 px-3 rounded my-1 ${
        isInTeam
          ? "bg-red-700 hover:bg-red-600 text-white"
          : "bg-sky-600 hover:bg-sky-500 text-white"
      }`}
    >
      {isInTeam ? "Remove from team" : "Add to team"}
    </button>
  );
}
