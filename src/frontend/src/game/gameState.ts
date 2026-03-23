// Module-level mutable game state for high-performance frame-by-frame updates
// This avoids React re-render overhead during the game loop

export interface VehicleRuntime {
  id: string;
  type: string;
  x: number;
  z: number;
  angle: number;
  speed: number;
  color: string;
}

export const input = {
  forward: false,
  back: false,
  left: false,
  right: false,
  sprint: false,
};

export const player = {
  x: 10,
  z: 10,
  angle: 0,
  vy: 0,
};

export const camera = {
  yaw: Math.PI, // behind the player initially
  pitch: 0.25,
};

export const vehicles: Map<string, VehicleRuntime> = new Map(
  [
    {
      id: "v1",
      type: "sedan",
      x: 50,
      z: 0,
      angle: 0,
      speed: 0,
      color: "#c0392b",
    },
    {
      id: "v2",
      type: "sports",
      x: -50,
      z: 50,
      angle: 0.5,
      speed: 0,
      color: "#2980b9",
    },
    {
      id: "v3",
      type: "police",
      x: 80,
      z: -40,
      angle: -0.3,
      speed: 0,
      color: "#1a1a4e",
    },
    {
      id: "v4",
      type: "ambulance",
      x: -80,
      z: -70,
      angle: 1.5,
      speed: 0,
      color: "#ecf0f1",
    },
    {
      id: "v5",
      type: "bike",
      x: 0,
      z: 80,
      angle: 0.8,
      speed: 0,
      color: "#27ae60",
    },
    {
      id: "v6",
      type: "sports",
      x: -110,
      z: 100,
      angle: -0.7,
      speed: 0,
      color: "#f39c12",
    },
    {
      id: "v7",
      type: "sedan",
      x: 110,
      z: 90,
      angle: 0,
      speed: 0,
      color: "#8e44ad",
    },
    {
      id: "v8",
      type: "bike",
      x: 35,
      z: -100,
      angle: 1.5,
      speed: 0,
      color: "#e67e22",
    },
  ].map((v) => [v.id, v]),
);

export const activeVehicleId = { value: null as string | null };
export const nearVehicleId = { value: null as string | null };

export const npcs: Array<{
  id: string;
  x: number;
  z: number;
  angle: number;
  speed: number;
  color: string;
  turnTimer: number;
}> = [];

const NPC_SKIN_COLORS = ["#e6b89c", "#c68642", "#8d5524", "#4a3728", "#f5deb3"];
for (let i = 0; i < 25; i++) {
  const angle = Math.random() * Math.PI * 2;
  const dist = 20 + Math.random() * 120;
  npcs.push({
    id: `npc_${i}`,
    x: Math.cos(angle) * dist,
    z: Math.sin(angle) * dist,
    angle: Math.random() * Math.PI * 2,
    speed: 1.5 + Math.random() * 1.5,
    color: NPC_SKIN_COLORS[i % NPC_SKIN_COLORS.length],
    turnTimer: Math.random() * 3,
  });
}
