/** biome-ignore-all lint/performance/noImgElement: we don't want image optimization */
/** biome-ignore-all lint/a11y/useButtonType: just because */
"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { useTeam } from "./team-context";

export function TeamTray() {
  const { team, removeFromTeam, clearTeam } = useTeam();
  const router = useRouter();
  const [saving, startTransition] = React.useTransition();

  if (team.length === 0) return null;

  async function saveTeam() {
    const res = await fetch("/api/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pokemon_ids: team.map((p) => p.id),
        pokemon_names: team.map((p) => p.name)
      })
    });
    const { url } = await res.json();
    clearTeam();
    router.push(url);
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-700 bg-zinc-900/95 backdrop-blur-sm p-4">
      <div className="max-w-5xl mx-auto flex items-center gap-4 flex-wrap">
        <p className="text-sm font-semibold text-gray-300 flex-none">
          Your team ({team.length}/6):
        </p>
        <div className="flex gap-2 flex-1 flex-wrap">
          {team.map((p) => (
            <span
              key={p.id}
              className="flex items-center gap-1.5 bg-zinc-800 rounded-full px-3 py-1 text-sm text-white"
            >
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`}
                alt={p.name}
                width={24}
                height={24}
                className="size-6"
              />
              {p.name}
              <button
                onClick={() => removeFromTeam(p.id)}
                className="ml-1 text-gray-400 hover:text-white leading-none"
                aria-label={`Remove ${p.name}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <button
          onClick={() => startTransition(saveTeam)}
          disabled={saving}
          className="flex-none bg-sky-600 hover:bg-sky-500 disabled:bg-sky-900 text-white font-semibold px-4 py-2 rounded-lg text-sm"
        >
          {saving ? "Saving…" : "Save team"}
        </button>
      </div>
    </div>
  );
}
