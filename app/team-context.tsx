"use client";

import * as React from "react";

export type TeamPokemon = { id: number; name: string };

type TeamContextValue = {
  team: TeamPokemon[];
  addToTeam: (pokemon: TeamPokemon) => void;
  removeFromTeam: (id: number) => void;
  clearTeam: () => void;
};

const STORAGE_KEY = "pokemon-team";

const TeamContext = React.createContext<TeamContextValue | null>(null);

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const [team, setTeam] = React.useState<TeamPokemon[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as TeamPokemon[]) : [];
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(team));
  }, [team]);

  const addToTeam = React.useCallback((pokemon: TeamPokemon) => {
    setTeam((prev) => {
      if (prev.length >= 6 || prev.some((p) => p.id === pokemon.id))
        return prev;
      return [...prev, pokemon];
    });
  }, []);

  const removeFromTeam = React.useCallback((id: number) => {
    setTeam((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clearTeam = React.useCallback(() => setTeam([]), []);

  return (
    <TeamContext value={{ team, addToTeam, removeFromTeam, clearTeam }}>
      {children}
    </TeamContext>
  );
}

export function useTeam() {
  const ctx = React.useContext(TeamContext);
  if (!ctx) throw new Error("useTeam must be used within TeamProvider");
  return ctx;
}
