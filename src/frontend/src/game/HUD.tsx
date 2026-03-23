import { useEffect, useRef, useState } from "react";
import { npcs, player, vehicles } from "./gameState";
import { MISSION_DEFS, useGameStore } from "./gameStore";

const MAP_SIZE = 150;
const SCALE = MAP_SIZE / 180;

const WANTED_STARS = ["star1", "star2", "star3", "star4", "star5"];

const CONTROLS = [
  { key: "WASD", label: "Move/Drive" },
  { key: "E", label: "Enter" },
  { key: "F", label: "Exit" },
  { key: "M", label: "Missions" },
  { key: "TAB", label: "Customize" },
  { key: "ESC", label: "Pause" },
];

function Minimap({ activeMissionId }: { activeMissionId: string | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let animId: number;
    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const px = player.x;
      const pz = player.z;
      const cx = MAP_SIZE / 2 - px * SCALE;
      const cz = MAP_SIZE / 2 - pz * SCALE;

      ctx.clearRect(0, 0, MAP_SIZE, MAP_SIZE);
      ctx.fillStyle = "rgba(5, 8, 16, 0.92)";
      ctx.fillRect(0, 0, MAP_SIZE, MAP_SIZE);

      const CELL = 30;
      const BLOCK = 22;

      for (let i = -10; i <= 10; i++) {
        for (let j = -10; j <= 10; j++) {
          const bx = cx + i * CELL * SCALE;
          const bz = cz + j * CELL * SCALE;
          ctx.fillStyle = "#1a2030";
          ctx.fillRect(
            bx - BLOCK * SCALE * 0.5,
            bz - BLOCK * SCALE * 0.5,
            BLOCK * SCALE,
            BLOCK * SCALE,
          );
        }
      }

      ctx.strokeStyle = "#2a3a50";
      ctx.lineWidth = 1;
      for (let j = -11; j <= 11; j++) {
        const ry = cz + j * CELL * SCALE;
        ctx.beginPath();
        ctx.moveTo(0, ry);
        ctx.lineTo(MAP_SIZE, ry);
        ctx.stroke();
      }
      for (let i = -11; i <= 11; i++) {
        const rx = cx + i * CELL * SCALE;
        ctx.beginPath();
        ctx.moveTo(rx, 0);
        ctx.lineTo(rx, MAP_SIZE);
        ctx.stroke();
      }

      const landmarks = [
        { x: -100, z: -100, color: "#4444ff", label: "P" },
        { x: 100, z: 100, color: "#ff4444", label: "H" },
        { x: -100, z: 100, color: "#888888", label: "J" },
      ];
      for (const lm of landmarks) {
        const lx = cx + lm.x * SCALE;
        const lz = cz + lm.z * SCALE;
        if (lx < 0 || lx > MAP_SIZE || lz < 0 || lz > MAP_SIZE) continue;
        ctx.fillStyle = lm.color;
        ctx.beginPath();
        ctx.arc(lx, lz, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.font = "bold 7px Arial";
        ctx.textAlign = "center";
        ctx.fillText(lm.label, lx, lz + 2.5);
      }

      const missionPositions: Record<string, [number, number]> = {
        first_ride: [50, 0],
        city_tour: [80, 80],
        delivery_run: [-60, 60],
        police_chase: [0, -90],
        the_heist: [-80, -60],
      };
      if (activeMissionId && missionPositions[activeMissionId]) {
        const [mx, mz] = missionPositions[activeMissionId];
        const mmx = cx + mx * SCALE;
        const mmz = cz + mz * SCALE;
        if (mmx >= 0 && mmx <= MAP_SIZE && mmz >= 0 && mmz <= MAP_SIZE) {
          ctx.fillStyle = "#f1c40f";
          ctx.beginPath();
          ctx.arc(mmx, mmz, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "white";
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.fillStyle = "#111";
          ctx.font = "bold 8px Arial";
          ctx.textAlign = "center";
          ctx.fillText("!", mmx, mmz + 3);
        }
      }

      for (const v of vehicles.values()) {
        const vx = cx + v.x * SCALE;
        const vz = cz + v.z * SCALE;
        if (vx < 0 || vx > MAP_SIZE || vz < 0 || vz > MAP_SIZE) continue;
        ctx.fillStyle =
          v.type === "police"
            ? "#3355ff"
            : v.type === "ambulance"
              ? "#ff3333"
              : "#44aaff";
        ctx.beginPath();
        ctx.arc(vx, vz, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const npc of npcs.slice(0, 15)) {
        const nx = cx + npc.x * SCALE;
        const nz = cz + npc.z * SCALE;
        if (nx < 0 || nx > MAP_SIZE || nz < 0 || nz > MAP_SIZE) continue;
        ctx.fillStyle = "#667788";
        ctx.beginPath();
        ctx.arc(nx, nz, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(MAP_SIZE / 2, MAP_SIZE / 2, 5, 0, Math.PI * 2);
      ctx.fill();

      const px2 = MAP_SIZE / 2 + Math.sin(player.angle) * 8;
      const pz2 = MAP_SIZE / 2 + Math.cos(player.angle) * 8;
      ctx.strokeStyle = "#27c6d8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(MAP_SIZE / 2, MAP_SIZE / 2);
      ctx.lineTo(px2, pz2);
      ctx.stroke();

      ctx.strokeStyle = "rgba(39,198,216,0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(MAP_SIZE / 2, MAP_SIZE / 2, MAP_SIZE / 2 - 1, 0, Math.PI * 2);
      ctx.stroke();

      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, [activeMissionId]);

  return (
    <div className="relative" style={{ width: MAP_SIZE, height: MAP_SIZE }}>
      <canvas
        ref={canvasRef}
        width={MAP_SIZE}
        height={MAP_SIZE}
        style={{
          borderRadius: "50%",
          boxShadow: "0 0 12px rgba(39,198,216,0.4)",
          border: "2px solid rgba(39,198,216,0.4)",
        }}
      />
      <div
        className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-game opacity-70 tracking-widest"
        style={{ color: "#27c6d8" }}
      >
        LOS SANTOS 2
      </div>
    </div>
  );
}

export default function HUD() {
  const {
    health,
    armor,
    money,
    rank,
    wantedLevel,
    gameTime,
    vehicleType,
    nearVehicleId,
    activeMissionId,
    rewardPopup,
    clearRewardPopup,
    inVehicle,
  } = useGameStore();

  const [showReward, setShowReward] = useState(false);
  const [rewardData, setRewardData] = useState<{
    text: string;
    amount: number;
  } | null>(null);

  useEffect(() => {
    if (rewardPopup) {
      setRewardData(rewardPopup);
      setShowReward(true);
      clearRewardPopup();
      const t = setTimeout(() => setShowReward(false), 3000);
      return () => clearTimeout(t);
    }
  }, [rewardPopup, clearRewardPopup]);

  const hour = Math.floor((gameTime / 60) % 24);
  const minute = Math.floor(gameTime % 60);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const timeStr = `${String(displayHour).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${ampm}`;

  const activeMission = MISSION_DEFS.find((m) => m.id === activeMissionId);

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none"
      style={{ zIndex: 10 }}
    >
      {/* TOP LEFT */}
      <div className="absolute top-4 left-4" data-ocid="hud.panel">
        <div className="hud-panel px-3 py-2 rounded min-w-[180px]">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-game text-red-400 tracking-wider">
              &#x2764; HEALTH
            </span>
            <span className="ml-auto text-[11px] font-game text-red-400">
              {health}%
            </span>
          </div>
          <div className="h-2 bg-gray-800 rounded overflow-hidden">
            <div
              className="h-full rounded transition-all duration-300"
              style={{
                width: `${health}%`,
                background: "linear-gradient(90deg, #e24a4a, #ff6b6b)",
                boxShadow: "0 0 6px #e24a4a",
              }}
            />
          </div>
          <div className="flex items-center gap-2 mt-2 mb-1">
            <span className="text-[10px] font-game text-blue-300 tracking-wider">
              &#x1F6E1; ARMOR
            </span>
            <span className="ml-auto text-[11px] font-game text-blue-300">
              {armor}%
            </span>
          </div>
          <div className="h-2 bg-gray-800 rounded overflow-hidden">
            <div
              className="h-full rounded transition-all duration-300"
              style={{
                width: `${armor}%`,
                background: "linear-gradient(90deg, #43bff0, #66ddff)",
                boxShadow: "0 0 6px #43bff0",
              }}
            />
          </div>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-[10px] font-game text-yellow-400 tracking-wider mr-1">
              WANTED
            </span>
            {WANTED_STARS.map((sid, i) => (
              <span
                key={sid}
                className="text-sm"
                style={{
                  color: i < wantedLevel ? "#f2c14e" : "#333",
                  textShadow: i < wantedLevel ? "0 0 6px #f2c14e" : "none",
                }}
              >
                &#x2605;
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* TOP RIGHT */}
      <div className="absolute top-4 right-4" data-ocid="hud.panel">
        <div className="hud-panel px-4 py-3 rounded text-right min-w-[200px]">
          <div
            className="font-game text-lg tracking-wider"
            style={{ color: "#76d26a", textShadow: "0 0 8px #76d26a" }}
          >
            ${money.toLocaleString()}
          </div>
          <div className="font-game text-[11px] text-gray-400 tracking-widest mt-1">
            <span style={{ color: "#27c6d8" }}>RANK</span> {rank}
          </div>
          <div
            className="font-game text-[11px] mt-1"
            style={{ color: "#c7ced8" }}
          >
            &#x23F1; {timeStr}
          </div>
          {inVehicle && vehicleType && (
            <div
              className="font-game text-[10px] mt-1 uppercase tracking-widest"
              style={{ color: "#ffb34d" }}
            >
              &#x1F697; {vehicleType}
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM LEFT - Minimap */}
      <div className="absolute bottom-6 left-4" data-ocid="hud.panel">
        <Minimap activeMissionId={activeMissionId} />
      </div>

      {/* BOTTOM RIGHT */}
      <div className="absolute bottom-4 right-4 text-right">
        <div
          className="font-game text-[10px] tracking-widest opacity-60"
          style={{ color: "#27c6d8" }}
        >
          MADE WITH SN ENGINE
        </div>
        <div
          className="font-game text-[8px] tracking-widest opacity-40"
          style={{ color: "#27c6d8" }}
        >
          LOS SANTOS 2 &copy; SN STUDIOS
        </div>
      </div>

      {/* Active mission */}
      {activeMission && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <div
            className="hud-panel px-4 py-2 rounded text-center"
            style={{ minWidth: 280 }}
          >
            <div
              className="font-game text-[10px] tracking-widest"
              style={{ color: "#ffb34d" }}
            >
              ACTIVE MISSION
            </div>
            <div
              className="font-game text-sm tracking-wide mt-0.5"
              style={{ color: "#27c6d8" }}
            >
              {activeMission.name}
            </div>
            <div className="font-ui text-[11px] text-gray-400 mt-0.5">
              {activeMission.objective}
            </div>
          </div>
        </div>
      )}

      {/* Enter vehicle prompt */}
      {nearVehicleId && !inVehicle && (
        <div
          className="absolute bottom-36 left-1/2 -translate-x-1/2"
          data-ocid="hud.toast"
        >
          <div className="hud-panel px-5 py-2 rounded-full flex items-center gap-3">
            <kbd className="bg-gray-700 text-white px-2 py-0.5 rounded font-game text-xs">
              E
            </kbd>
            <span className="font-ui text-sm" style={{ color: "#27c6d8" }}>
              Enter Vehicle
            </span>
          </div>
        </div>
      )}

      {/* Exit vehicle prompt */}
      {inVehicle && (
        <div className="absolute bottom-36 left-1/2 -translate-x-1/2">
          <div className="hud-panel px-5 py-2 rounded-full flex items-center gap-3">
            <kbd className="bg-gray-700 text-white px-2 py-0.5 rounded font-game text-xs">
              F
            </kbd>
            <span className="font-ui text-sm" style={{ color: "#27c6d8" }}>
              Exit Vehicle
            </span>
          </div>
        </div>
      )}

      {/* Reward popup */}
      {showReward && rewardData && (
        <div
          className="absolute top-24 left-1/2 -translate-x-1/2 animate-float-up"
          data-ocid="hud.success_state"
        >
          <div className="hud-panel px-6 py-3 rounded text-center">
            <div className="font-game text-[10px] tracking-widest text-yellow-400">
              MISSION COMPLETE!
            </div>
            <div
              className="font-game text-lg mt-1"
              style={{ color: "#76d26a" }}
            >
              +${rewardData.amount.toLocaleString()}
            </div>
            <div className="font-ui text-xs text-gray-400 mt-0.5">
              {rewardData.text}
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-3 opacity-40">
          {CONTROLS.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-1">
              <kbd className="bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded font-game text-[9px]">
                {key}
              </kbd>
              <span className="font-ui text-[9px] text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
