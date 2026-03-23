import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Mission, Player } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllPlayers() {
  const { actor, isFetching } = useActor();
  return useQuery<Player[]>({
    queryKey: ["players"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPlayers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllMissions() {
  const { actor, isFetching } = useActor();
  return useQuery<Mission[]>({
    queryKey: ["missions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMissions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveScore() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, score }: { name: string; score: number }) => {
      if (!actor) throw new Error("No actor");
      await actor.createOrUpdatePlayer({ name, score: BigInt(score) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
    },
  });
}

export function useSaveMission() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (mission: Mission) => {
      if (!actor) throw new Error("No actor");
      await actor.createOrUpdateMission(mission);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missions"] });
    },
  });
}
