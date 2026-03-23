import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import CustomizationPanel from "./game/CustomizationPanel";
import Game from "./game/Game";
import HUD from "./game/HUD";
import MissionsPanel from "./game/MissionsPanel";
import { useGameStore } from "./game/gameStore";

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: `particle-${i}`,
  size: 2 + ((i * 7919) % 4),
  color: i % 2 === 0 ? "#27c6d8" : "#ffb34d",
  top: (i * 6271) % 100,
  left: (i * 3947) % 100,
  duration: 2 + ((i * 1237) % 3),
  delay: (i * 431) % 2,
}));

function SplashScreen({ onStart }: { onStart: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "ready">("loading");
  const [enterBlink, setEnterBlink] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setPhase("ready");
          return 100;
        }
        return p + 1.5;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setEnterBlink((b) => !b), 600);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Enter" && phase === "ready") onStart();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [phase, onStart]);

  return (
    <div
      className="relative w-screen h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#050810" }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full opacity-10"
            style={{
              width: p.size,
              height: p.size,
              background: p.color,
              top: `${p.top}%`,
              left: `${p.left}%`,
              animation: `pulse-neon ${p.duration}s infinite ${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative flex flex-col items-center text-center px-8"
      >
        {/* Made with SN badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-game text-[11px] tracking-[0.4em] mb-6 opacity-60"
          style={{ color: "#27c6d8" }}
        >
          MADE WITH SN ENGINE
        </motion.div>

        {/* Main title */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
        >
          <div
            className="font-game text-7xl md:text-8xl font-black tracking-tight leading-none"
            style={{
              color: "#2ecfe3",
              textShadow:
                "0 0 20px #2ecfe3, 0 0 60px #27c6d880, 0 0 100px #27c6d840",
            }}
          >
            LOS SANTOS
          </div>
          <div
            className="font-game text-7xl md:text-8xl font-black tracking-tight"
            style={{
              color: "#ffb34d",
              textShadow: "0 0 20px #ffb34d, 0 0 60px #ffb34d60",
              marginTop: "-8px",
            }}
          >
            2
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="font-ui text-sm tracking-[0.3em] mt-4 mb-8"
          style={{ color: "#c7ced8" }}
        >
          AN OPEN WORLD EXPERIENCE &middot; LOS SANTOS CITY
        </motion.div>

        {/* Character intro */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="font-game text-xs tracking-widest mb-8 opacity-70"
          style={{ color: "#ffb34d" }}
        >
          FEATURING: SUNIL
        </motion.div>

        {/* Loading bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="w-80 mb-6"
        >
          <div className="flex justify-between mb-1">
            <span
              className="font-game text-[10px] tracking-wider"
              style={{ color: "#27c6d8" }}
            >
              {phase === "loading" ? "LOADING CITY..." : "LOS SANTOS 2 LOADED"}
            </span>
            <span
              className="font-game text-[10px]"
              style={{ color: "#27c6d8" }}
            >
              {Math.round(progress)}%
            </span>
          </div>
          <div
            className="h-1.5 rounded overflow-hidden"
            style={{
              background: "rgba(39,198,216,0.15)",
              border: "1px solid rgba(39,198,216,0.3)",
            }}
          >
            <div
              className="h-full rounded transition-all duration-100"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #27c6d8, #2ecfe3)",
                boxShadow: "0 0 8px #27c6d8",
              }}
            />
          </div>
        </motion.div>

        {/* Press Enter */}
        <AnimatePresence>
          {phase === "ready" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <button
                type="button"
                onClick={onStart}
                className="font-game text-sm tracking-[0.4em] py-3 px-10 rounded transition-all hover:scale-105"
                style={{
                  color: enterBlink ? "#27c6d8" : "#2ecfe3",
                  textShadow: enterBlink
                    ? "0 0 15px #27c6d8"
                    : "0 0 25px #2ecfe3",
                  border: "1px solid rgba(39,198,216,0.5)",
                  background: "rgba(39,198,216,0.08)",
                  boxShadow: "0 0 20px rgba(39,198,216,0.15)",
                }}
                data-ocid="splash.primary_button"
              >
                &#9654; PRESS ENTER TO PLAY
              </button>
              <div className="font-ui text-xs text-gray-600 tracking-wide">
                WASD to move &middot; Mouse to look &middot; E to enter vehicles
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Feature badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-12 flex gap-6 text-center"
      >
        {[
          {
            icon: "\u{1F3D9}\uFE0F",
            title: "Open World",
            sub: "Los Santos 2 City",
          },
          { icon: "\u{1F697}", title: "8 Vehicles", sub: "Cars & Bikes" },
          { icon: "\u{1F3AF}", title: "5 Missions", sub: "Story Mode" },
          { icon: "\u{1F464}", title: "Character", sub: "Full Customization" },
        ].map(({ icon, title, sub }) => (
          <div key={title} className="flex flex-col items-center gap-1">
            <span className="text-2xl">{icon}</span>
            <span
              className="font-game text-[10px] tracking-widest"
              style={{ color: "#27c6d8" }}
            >
              {title}
            </span>
            <span className="font-ui text-[9px] text-gray-600">{sub}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function GameTimeUpdater() {
  const tickTime = useGameStore((s) => s.tickTime);
  const lastTime = useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const delta = (now - lastTime.current) / 1000;
      lastTime.current = now;
      tickTime(delta);
    }, 100);
    return () => clearInterval(interval);
  }, [tickTime]);

  return null;
}

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div
      className="w-screen h-screen overflow-hidden"
      style={{ background: "#050810" }}
    >
      <AnimatePresence mode="wait">
        {!gameStarted ? (
          <motion.div
            key="splash"
            className="w-full h-full"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SplashScreen onStart={() => setGameStarted(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="game"
            className="w-full h-full relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <GameTimeUpdater />
            <Game />
            <HUD />
            <MissionsPanel />
            <CustomizationPanel />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
