import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Player {
    name: string;
    score: bigint;
}
export interface Mission {
    id: string;
    completed: boolean;
    playerName: string;
}
export interface backendInterface {
    createOrUpdateMission(mission: Mission): Promise<void>;
    createOrUpdatePlayer(player: Player): Promise<void>;
    getAllMissions(): Promise<Array<Mission>>;
    getAllPlayers(): Promise<Array<Player>>;
    getMissionById(id: string): Promise<Mission>;
    getPlayerByName(name: string): Promise<Player>;
}
