import { create } from "zustand";

export const MISSION_DEFS = [
  {
    id: "first_ride",
    name: "First Ride",
    description: "Find and enter any vehicle in Los Santos 2.",
    objective: "Enter a vehicle (press E near a vehicle)",
    reward: 500,
  },
  {
    id: "city_tour",
    name: "City Tour",
    description: "Drive to 3 marked locations around the city.",
    objective: "Visit 3 marked locations (0/3)",
    reward: 1000,
  },
  {
    id: "delivery_run",
    name: "Delivery Run",
    description: "Pick up a package and deliver it to the destination.",
    objective: "Head to the yellow marker to pick up the package",
    reward: 2500,
  },
  {
    id: "police_chase",
    name: "Police Chase",
    description: "Get 5 wanted stars and survive for 60 seconds.",
    objective: "Reach 5 wanted stars and survive",
    reward: 5000,
  },
  {
    id: "the_heist",
    name: "The Heist",
    description: "Collect 5 money bags scattered around Los Santos 2.",
    objective: "Collect 5 money bags (0/5)",
    reward: 10000,
  },
];

interface GameStore {
  health: number;
  armor: number;
  money: number;
  rank: number;
  wantedLevel: number;
  gameTime: number;
  inVehicle: boolean;
  vehicleType: string | null;
  nearVehicleId: string | null;
  showMissions: boolean;
  showCustomization: boolean;
  paused: boolean;
  completedMissions: string[];
  activeMissionId: string | null;
  customization: { skinTone: number; hairStyle: number; outfit: number };
  playerX: number;
  playerZ: number;
  playerAngle: number;
  heistBags: number;
  tourLocations: number;
  rewardPopup: { text: string; amount: number } | null;

  setHealth: (h: number) => void;
  addMoney: (m: number) => void;
  setWantedLevel: (w: number) => void;
  enterVehicle: (type: string) => void;
  exitVehicle: () => void;
  setNearVehicle: (id: string | null) => void;
  toggleMissions: () => void;
  toggleCustomization: () => void;
  completeMission: (id: string) => void;
  setActiveMission: (id: string | null) => void;
  updateCustomization: (
    c: Partial<{ skinTone: number; hairStyle: number; outfit: number }>,
  ) => void;
  tickTime: (ds: number) => void;
  updatePlayerPosition: (x: number, z: number, angle: number) => void;
  setPaused: (p: boolean) => void;
  incrementHeistBag: () => void;
  incrementTourLocation: () => void;
  clearRewardPopup: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  health: 100,
  armor: 85,
  money: 1450230,
  rank: 45,
  wantedLevel: 0,
  gameTime: 165,
  inVehicle: false,
  vehicleType: null,
  nearVehicleId: null,
  showMissions: false,
  showCustomization: false,
  paused: false,
  completedMissions: [],
  activeMissionId: null,
  customization: { skinTone: 2, hairStyle: 1, outfit: 4 },
  playerX: 10,
  playerZ: 10,
  playerAngle: 0,
  heistBags: 0,
  tourLocations: 0,
  rewardPopup: null,

  setHealth: (h) => set({ health: Math.max(0, Math.min(100, h)) }),
  addMoney: (m) => set((s) => ({ money: s.money + m })),
  setWantedLevel: (w) => set({ wantedLevel: Math.max(0, Math.min(5, w)) }),
  enterVehicle: (type) => set({ inVehicle: true, vehicleType: type }),
  exitVehicle: () => set({ inVehicle: false, vehicleType: null }),
  setNearVehicle: (id) => set({ nearVehicleId: id }),
  toggleMissions: () =>
    set((s) => ({ showMissions: !s.showMissions, showCustomization: false })),
  toggleCustomization: () =>
    set((s) => ({
      showCustomization: !s.showCustomization,
      showMissions: false,
    })),
  completeMission: (id) =>
    set((s) => {
      if (s.completedMissions.includes(id)) return {};
      const mission = MISSION_DEFS.find((m) => m.id === id);
      const reward = mission?.reward ?? 0;
      return {
        completedMissions: [...s.completedMissions, id],
        activeMissionId: s.activeMissionId === id ? null : s.activeMissionId,
        money: s.money + reward,
        rank: s.rank + 1,
        rewardPopup: {
          text: mission?.name ?? "Mission Complete",
          amount: reward,
        },
      };
    }),
  setActiveMission: (id) => set({ activeMissionId: id, showMissions: false }),
  updateCustomization: (c) =>
    set((s) => ({ customization: { ...s.customization, ...c } })),
  tickTime: (ds) => set((s) => ({ gameTime: (s.gameTime + ds) % 1440 })),
  updatePlayerPosition: (x, z, angle) =>
    set({ playerX: x, playerZ: z, playerAngle: angle }),
  setPaused: (p) => set({ paused: p }),
  incrementHeistBag: () => set((s) => ({ heistBags: s.heistBags + 1 })),
  incrementTourLocation: () =>
    set((s) => ({ tourLocations: s.tourLocations + 1 })),
  clearRewardPopup: () => set({ rewardPopup: null }),
}));
